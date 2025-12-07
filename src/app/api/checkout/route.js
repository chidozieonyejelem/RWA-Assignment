export async function GET(req) {
    console.log('in the checkout api page');

    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const phone = searchParams.get('phone');
        const address = searchParams.get('address');

        const totalRaw = parseFloat(searchParams.get('total') || '0');

        const total = Number.isFinite(totalRaw)
            ? Number(totalRaw.toFixed(2))
            : 0;

        if (!email || !address) {
            return Response.json({
                ok: false,
                error: 'Missing email or address',
            });
        }

        const { MongoClient } = require('mongodb');
        const url =
            'mongodb+srv://chidozieonyejelem1_db_user:4hHD8SMxyCNCPl6e@cluster0.tk6on5o.mongodb.net/?appName=Cluster0';
        const client = new MongoClient(url);
        const dbName = 'app';

        await client.connect();
        console.log('Connected successfully to server (checkout)');

        const db = client.db(dbName);
        const cartCollection = db.collection('shopping_cart');
        const ordersCollection = db.collection('orders');

        const cartItems = await cartCollection.find({ email }).toArray();
        console.log(`Found ${cartItems.length} cart items for ${email}`);

        const orderDoc = {
            email,
            name,
            phone,
            address,
            total,
            createdAt: new Date(),
        };

        const result = await ordersCollection.insertOne(orderDoc);

        await cartCollection.deleteMany({ email });

        console.log(
            `Order confirmation (mock email) -> to: ${email}, orderId: ${
                result.insertedId
            }, total: €${total.toFixed(2)}`
        );

        return Response.json({
            ok: true,
            orderId: result.insertedId.toString(),
        });
    } catch (error) {
        console.error('Checkout API error:', error);
        return Response.json(
            {
                ok: false,
                error: String(error.message || error),
            },
            { status: 500 }
        );
    }
}