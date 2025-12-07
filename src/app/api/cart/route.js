export async function GET(req) {
    console.log('in the cart api page');

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const { MongoClient, ObjectId } = require('mongodb');
    const url =
        'mongodb+srv://chidozieonyejelem1_db_user:4hHD8SMxyCNCPl6e@cluster0.tk6on5o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);
    const dbName = 'app';

    try {
        await client.connect();
        console.log('Connected successfully to server (cart)');
        const db = client.db(dbName);
        const collection = db.collection('shopping_cart');

        if (action === 'add') {
            const pname = searchParams.get('pname');
            const price = parseFloat(searchParams.get('price') || '0');
            const email = searchParams.get('email');

            console.log('cart add:', { pname, price, email });

            if (!pname || !email) {
                return Response.json(
                    { ok: false, error: 'Missing product name or email' },
                    { status: 400 }
                );
            }

            const doc = {
                pname,
                price,
                email,
                createdAt: new Date(),
            };

            const insertResult = await collection.insertOne(doc);
            console.log('Inserted cart item', insertResult.insertedId);

            return Response.json({
                ok: true,
                id: insertResult.insertedId.toString(),
            });
        }

        if (action === 'view') {
            const email = searchParams.get('email');
            console.log('cart view for:', email);

            if (!email) {
                return Response.json(
                    { ok: false, error: 'Missing email' },
                    { status: 400 }
                );
            }

            const docs = await collection.find({ email }).toArray();
            const serialised = docs.map((d) => ({
                ...d,
                _id: d._id.toString(),
            }));

            return Response.json(serialised);
        }

        if (action === 'remove') {
            const id = searchParams.get('id');
            console.log('cart remove id:', id);

            if (!id) {
                return Response.json(
                    { ok: false, error: 'Missing id' },
                    { status: 400 }
                );
            }

            await collection.deleteOne({ _id: new ObjectId(id) });

            return Response.json({ ok: true });
        }

        return Response.json(
            { ok: false, error: 'Unknown action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Cart API error:', error);
        return Response.json(
            { ok: false, error: String(error.message || error) },
            { status: 500 }
        );
    }
}