#!/usr/bin/env node

const { MongoClient } = require('mongodb');

// URI do MongoDB
const uri = process.env.MONGODB_URI || 'mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster';

async function checkRealSales() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('jc-hair-studio-ecommerce');

        // Buscar pedidos reais
        const ordersCollection = db.collection('orders');
        const totalOrders = await ordersCollection.countDocuments();

        // Pedidos de hoje
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await ordersCollection.countDocuments({
            createdAt: { $gte: today }
        });

        // Última venda
        const lastOrder = await ordersCollection.findOne(
            {},
            { sort: { createdAt: -1 } }
        );

        // Carrinhos abandonados (mais de 1 hora sem atualização)
        const oneHourAgo = new Date(Date.now() - 3600000);
        const cartsCollection = db.collection('carts');
        const abandonedCarts = await cartsCollection.countDocuments({
            updatedAt: { $lt: oneHourAgo },
            items: { $exists: true, $ne: [] }
        });

        // Valor total de vendas hoje
        const todaySalesValue = await ordersCollection.aggregate([
            {
                $match: {
                    createdAt: { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]).toArray();

        const totalValue = todaySalesValue.length > 0 ? todaySalesValue[0].total : 0;

        // Output formatado para o bash ler
        console.log(JSON.stringify({
            success: true,
            totalOrders,
            todayOrders,
            abandonedCarts,
            lastOrderTime: lastOrder ? lastOrder.createdAt : null,
            todayValue: totalValue || 0,
            currency: 'EUR'
        }, null, 0));

    } catch (error) {
        console.log(JSON.stringify({
            success: false,
            error: error.message,
            totalOrders: 0,
            todayOrders: 0,
            abandonedCarts: 0
        }, null, 0));
    } finally {
        await client.close();
    }
}

// Executar
checkRealSales();