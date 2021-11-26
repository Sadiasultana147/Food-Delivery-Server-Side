

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors");

const objectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
// MiddleWare
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpk1a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//console.log(uri) // for checking user/pass is alright

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodDelivery");
        const deliveryCollection = database.collection("services");
        //OrderCollection
        const orderCollection = database.collection("orders");

        //GET API ALL SERVICE

        app.get('/services', async (req, res) => {
            const cursor = deliveryCollection.find({});
            const service = await cursor.toArray();
            res.send(service)
        })

        // GET SINGLE SERVICE API

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const service = await deliveryCollection.findOne(query);
            res.json(service);
        })


        // POST API SERVICE
        app.post('/services', async (req, res) => {
            const service = req.body;

            console.log("Hitting the post", service)
            const result = await deliveryCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)
        })

        //DELETE API Service


        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: objectId(id) };
            const result = await deliveryCollection.deleteOne(query);

            console.log('deleting service with id ', result);

            res.json(result);
        })



        //GET API ORDER

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order)
        })

        //GET SINGLE API ORDER

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const user = await orderCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        })
        // // POST API Order
        app.post('/orders', async (req, res) => {
            const order = req.body;

            const result = await orderCollection.insertOne(order);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)

        })



        //DELETE API ORDER


        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: objectId(id) };
            const result = await orderCollection.deleteOne(query);

            console.log('deleting order with id ', result);

            res.json(result);
        })


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runnig food SERVER')
})


app.listen(port, () => {
    console.log("Runnig food server onnnnnn the  port", port)
})