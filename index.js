const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGODB_TEN_USER}:${process.env.MONGODB_TEN_PASS}@cluster0.esbrpdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    const userCollection = client.db('assignmentTenDB').collection('users');

    // --- send user
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // --- received user from client
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    const itemCollection = client.db('assignmentTenDB').collection('items');
    // --- send art & craft
    app.get('/art-craft', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/art-craft/:itemId', async (req, res) => {
      const id = req.params.itemId;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.findOne(query);
      res.send(result);
    });

    // --- received art & craft from client
    app.post('/art-craft', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await itemCollection.insertOne(item);
      res.send(result);
    });

    // --- delete art & craft item
    app.delete('/art-craft/:itemId', async (req, res) => {
      const id = req.params.itemId;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });

    // Update
    app.put('/art-craft/:itemId', async (req, res) => {
      const id = req.params.itemId;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedItem = req.body;

      const item = {
        $set: {
          itemName: updatedItem.itemName,
          subCategory: updatedItem.subCategory,
          stockStatus: updatedItem.stockStatus,
          price: updatedItem.price,
          rating: updatedItem.rating,
          photo: updatedItem.photo,
          customization: updatedItem.customization,
          processingTime: updatedItem.processingTime,
          shortDescription: updatedItem.shortDescription
        }
      }
      const result = await itemCollection.updateOne(filter, item, options);
      res.send(result);
    });



    const categoryCollection = client.db('assignmentTenDB').collection('category');

    // --- send user
    app.get('/category', async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // --- received user from client
    app.post('/category', async (req, res) => {
      const category = req.body;
      console.log(category);
      const result = await categoryCollection.insertOne(category);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


// --- run server
app.get('/', (req, res) => {
  res.send('Server is running...')
});

app.listen(port, () => {
  console.log(`Server is running port: ${port}
  Link: http://localhost:${port}`);
});