export async function GET(req) {
    console.log('in the login api page');

    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const pass = searchParams.get('pass');

        console.log('Login request for:', email);

        if (!email || !pass) {
            return Response.json({
                valid: false,
                error: 'Missing email or password',
            });
        }

        const { MongoClient } = require('mongodb');
        const url =
            'mongodb+srv://chidozieonyejelem1_db_user:4hHD8SMxyCNCPl6e@cluster0.tk6on5o.mongodb.net/?appName=Cluster0';
        const client = new MongoClient(url);
        const dbName = 'app';

        await client.connect();
        console.log('Connected successfully to server (login)');

        const db = client.db(dbName);

        let user =
            (await db
                .collection('users')
                .findOne({ $or: [{ email }, { username: email }] })) ||

        console.log('User document found:', user);

        if (!user) {
            return Response.json({
                valid: false,
                error: 'User not found',
            });
        }

        const storedPass = user.password ?? user.pass ?? '';
        const account_type = user.account_type ?? user.acc_type ?? 'customer';

        if (!storedPass) {
            return Response.json({
                valid: false,
                error: 'No password stored for this user',
            });
        }

        let ok = false;

        if (storedPass.startsWith('$2')) {
            const bcrypt = require('bcrypt');
            ok = bcrypt.compareSync(pass, storedPass);
            console.log('Hash comparison result (bcrypt):', ok);
        } else {
            ok = pass === storedPass;
            console.log('Plain-text comparison result:', ok);
        }

        if (!ok) {
            return Response.json({
                valid: false,
                error: 'Incorrect password',
            });
        }

        return Response.json({
            valid: true,
            account_type,
        });
    } catch (error) {
        console.error('Login API error:', error);
        return Response.json({
            valid: false,
            error: String(error.message || error),
        });
    }
}