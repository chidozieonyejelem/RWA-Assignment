export async function GET(req) {
    console.log('in the register api page');

    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const pass = searchParams.get('pass');
        const account_type = searchParams.get('account_type') || 'customer';

        if (!email || !pass) {
            return Response.json({
                ok: false,
                error: 'Missing email or password',
            });
        }

        const { MongoClient } = require('mongodb');
        const bcrypt = require('bcrypt');

        const url =
            'mongodb+srv://chidozieonyejelem1_db_user:4hHD8SMxyCNCPl6e@cluster0.tk6on5o.mongodb.net/?appName=Cluster0';
        const client = new MongoClient(url);
        const dbName = 'app';

        await client.connect();
        console.log('Connected successfully to server (register)');

        const db = client.db(dbName);
        const users = db.collection('users');

        const existing = await users.findOne({ email });
        if (existing) {
            return Response.json({
                ok: false,
                error: 'User with that email already exists',
            });
        }

        const hash = bcrypt.hashSync(pass, 10);

        const userDoc = {
            email,
            password: hash,
            account_type,
            createdAt: new Date(),
        };

        await users.insertOne(userDoc);

        return Response.json({ ok: true });
    } catch (error) {
        console.error('Register API error:', error);
        return Response.json({
            ok: false,
            error: 'Internal server error in register API',
        });
    }
}