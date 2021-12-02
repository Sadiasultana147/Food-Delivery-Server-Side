

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
        const usersCollection = database.collection("users"); 0

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




        //DELETE API ORDER


        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: objectId(id) };
            const result = await orderCollection.deleteOne(query);

            console.log('deleting order with id ', result);

            res.json(result);
        })

        // // POST API Orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            order.status = 'pending';
            console.log(order.status)
            const result = await orderCollection.insertOne(order);
            console.log(`A document was inserted with statuse And the _id: ${result.insertedId}`);
            res.send(result)

        })

        app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            // const updatedStatus = req.body;
            const filter = { _id: objectId(id) };
            //console.log(updatedStatus);
            orderCollection
                .updateOne(filter, {
                    $set: { status: "Confirm" },
                })
                .then((result) => {
                    res.json(result);
                });
        });

        app.post("/addUserInfo", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        //google sign in user update/put function
        app.put('/addUserInfo', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        //  make admin

        app.put("/makeAdmin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        });

        // check admin or not
        app.get("/checkAdmin/:email", async (req, res) => {
            const result = await usersCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
        });


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runnig food SERVER')
})


app.listen(port, () => {
    console.log("Runnig food server on port", port)
})