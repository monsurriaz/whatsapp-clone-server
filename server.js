// importing
import express from 'express';
import mongoose from 'mongoose';
import Message from './dbMessages.js';
import Pusher from 'pusher';

//app config
const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
    appId: "1116229",
    key: "317ceb571ce9bb8dd6c7",
    secret: "853451031ba74e384d42",
    cluster: "ap2",
    useTLS: true
});

//middleware

app.use(express.json());


//DB config
const connection_url = 'mongodb+srv://whatsapp_clone:YwWHT1T1sUcX0bAM@cluster0.x3yya.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', () => {
    console.log('db connect');

    const msgCollection = db.collection('messagecontents');
    // console.log(msgCollection);
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log('A change occured',change);
    })

})

// api routing
app.get('/', (req, res) => res.status(200).send('hello Bangladesh'));

app.get('/messages/sync', (req, res) => {
    Message.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data); // 200 meants ok
        }
    });
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Message.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data); // 201 means create ok
        }
    })
})

//listen

app.listen(port, () => console.log(`Listening on localhost:${port}`));