const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://learningDB:hwzTddIfUzAJ28zt@cluster0.af8g6yc.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("userDB");
    const courseCollection = db.collection("user2");
    const enrollCollection =db.collection("enrolls")

    app.get("/courses", async (req, res) => {
      const result = await courseCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/courses/:id", async (req, res) => {
      const { id } = req.params;

      const result = await courseCollection.findOne({ _id: new ObjectId(id) });
      res.send({
        success: true,
        result,
      });
    });

    app.post("/courses", async (req, res) => {
      const data = req.body;
      // console.log(data)
      const result = await courseCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    app.put("/courses/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };
      const result = await courseCollection.updateOne(filter, update);
      res.send({
        success: true,
        result,
      });
    });

    app.delete("/courses/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const result = await courseCollection.deleteOne(filter);

      res.send({
        success: true,
        result,
      });
    });

    app.get("/populer-courses", async (req, res) => {
      const result = await courseCollection
        .find({ isFeatured: true })
        .limit(6)
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/my-courses", async (req, res) => {
      const email = req.query.email;
      const result = await courseCollection
        .find({createdBy: email})
        .toArray();
        res.send(result)
    });

    app.post("/enrolls",async (req,res)=>{
      const data =req.body
      const id =req.params.id
      const result =await enrollCollection.insertOne(data)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
