const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vpsgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());


app.post('/addEvent', (req, res) => {
    const event = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const eventsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL_1);
        eventsCollection.insertMany(event)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            });
        client.close();
    });
});


app.get('/events', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        eventsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
        client.close();
    })
});

app.post('/addVolunteer', (req, res) => {
    const volunteer = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const volunteersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL_2);
        volunteersCollection.insertOne(volunteer)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
        client.close();
    });
});

app.get('/registeredEvents', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const volunteersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL_2);
        volunteersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
        client.close();
    })
});

app.get('/volunteers', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const volunteersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL_2);
        volunteersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
        client.close();
    });
});

app.delete('/delete/:id', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const volunteersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL_2);
        volunteersCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            });
        client.close();
    });

})

app.get('/', (req, res) => {
    res.send('welcome back')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);