export async function GET() {
    console.log('in getProducts api page');

    const { MongoClient } = require('mongodb');
    const url = 'mongodb+srv://chidozieonyejelem1_db_user:4hHD8SMxyCNCPl6e@cluster0.tk6on5o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);
    const dbName = 'app';

    await client.connect();
    console.log('Connected successfully to server (getProducts)');
    const db = client.db(dbName);
    const collection = db.collection('products');

    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);

    const serialised = findResult.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
    }));

    return Response.json(serialised);
}