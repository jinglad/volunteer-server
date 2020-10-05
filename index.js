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


client.connect(err => {
    const eventsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL_1);
    const volunteersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLL_2);

    app.get('/', (req, res) => {
        res.send('welcome back')
    })

    app.post('/addEvent', (req, res) => {
        const event = req.body;
        eventsCollection.insertMany(event)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    })

    app.get('/events', (req, res) => {
        eventsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addVolunteer', (req, res) => {
        const volunteer = req.body;
        volunteersCollection.insertOne(volunteer)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/registeredEvents', (req, res) => {
        volunteersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/volunteers', (req, res) => {
        volunteersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        volunteersCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);