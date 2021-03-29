const express = require('express')
const app = express()
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParse = require('body-parser');
require('dotenv').config()
const pass = "volunteer0987";

const port = process.env.PORT || 5055;
app.use(cors());
app.use(bodyParse.json());

// console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vd3ar.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection err", err)
  const eventCollection = client.db("volunteer").collection("events");

  app.get("/event", (req,res) =>{
      eventCollection.find()
      .toArray((err,items) =>{
          console.log("from database",items)
        res.send(items)
      })
  })


  app.post('/addEvent', (req,res) =>{
      const newEvent = req.body;
      console.log("adding new event", newEvent)
      eventCollection.insertOne(newEvent)
      .then(result =>{
          console.log("inserted",result.insertedCount)
          res.send(result.insertedCount > 0 )
      })
  })

  app.delete('/deleteEvent/:id', (req,res) =>{
      const id = ObjectID(req.params.id);
      console.log("delete this ", id);
      eventCollection.findOneAndDelete({_id:id})
      .then(document =>{
          res.send(document.deletedCount>0)
      })
  })
  
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})