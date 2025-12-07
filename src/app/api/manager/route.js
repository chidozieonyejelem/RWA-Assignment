export async function GET() {
    const { MongoClient } = require('mongodb');
    const url = 'mongodb+srv://chidozieonyejelem1_db_user:4hHD8SMxyCNCPl6e@cluster0.tk6on5o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);
    const dbName = 'app';

    await client.connect();
    console.log('Connected successfully to server (manager)');
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');

    const orders = await ordersCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.total || 0),
        0
    );
    const totalItemsSold = orders.reduce((sum, o) => {
        const items = o.items || [];
        return (
            sum +
            items.reduce((s, item) => s + (item.quantity || 1), 0)
        );
    }, 0);

    const serialised = orders.map((o) => ({
        ...o,
        _id: o._id.toString(),
        createdAt: o.createdAt ? o.createdAt.toISOString() : null,
    }));

    return Response.json({
        stats: { totalOrders, totalRevenue, totalItemsSold },
        orders: serialised,
    });
}