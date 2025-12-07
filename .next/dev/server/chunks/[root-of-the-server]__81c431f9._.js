module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/src/app/api/manager/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
async function GET() {
    const { MongoClient } = __turbopack_context__.r("[externals]/mongodb [external] (mongodb, cjs)");
    const url = 'mongodb+srv://chidozieonyejelem1_db_user:4hHD8SMxyCNCPl6e@cluster0.tk6on5o.mongodb.net/?appName=Cluster0';
    const client = new MongoClient(url);
    const dbName = 'app';
    await client.connect();
    console.log('Connected successfully to server (manager)');
    const db = client.db(dbName);
    const ordersCollection = db.collection('orders');
    const orders = await ordersCollection.find({}).sort({
        createdAt: -1
    }).toArray();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o)=>sum + (o.total || 0), 0);
    const totalItemsSold = orders.reduce((sum, o)=>{
        const items = o.items || [];
        return sum + items.reduce((s, item)=>s + (item.quantity || 1), 0);
    }, 0);
    const serialised = orders.map((o)=>({
            ...o,
            _id: o._id.toString(),
            createdAt: o.createdAt ? o.createdAt.toISOString() : null
        }));
    return Response.json({
        stats: {
            totalOrders,
            totalRevenue,
            totalItemsSold
        },
        orders: serialised
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__81c431f9._.js.map