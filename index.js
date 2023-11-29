const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.taymcgi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const allArticlesCollection =client.db('newsPaper').collection('allArticles');
    const usersCollection =client.db('newsPaper').collection('users');


      //  user related
      app.get('/users', async(req, res)=>{
        const result= await usersCollection.find().toArray();
        res.send(result)
      })
    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
     })

     app.patch("/users/admin/:id", async(req,res)=>{
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)}
      const updateDoc={
        $set:{
          role:'admin'
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc)
     })


    //  articles related
    app.get('/allArticles', async(req, res)=>{
      const cursor = allArticlesCollection.find();
      const result = await cursor.toArray();
      res.send(result)

    })
    app.get('/allArticles/:id', async(req, res)=>{
      const id = req.params.id;
      const result =await allArticlesCollection.findOne({_id: new ObjectId(id)});
      res.send(result)

    })
     app.post('/allArticles', async(req, res)=>{
      const user = req.body;
      const result = await allArticlesCollection.insertOne(user);
      res.send(result)
     })

   

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('newspaper is running')
})

app.listen(port, ()=>{
    console.log(`newspaper server is on port ${port} `)
})