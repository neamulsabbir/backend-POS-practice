const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// posSystem
// EZyx3dGGZb4Dqxmt

const uri =
  "mongodb+srv://posSystem:EZyx3dGGZb4Dqxmt@cluster0.ivmjea7.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const products = client.db("POS-Project").collection("products");
    const orders = client.db("POS-Project").collection("orders");

    app.get("/products", async (req, res) => {
      try {
        const query = {};
        const result = await products.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/products", async (req, res) => {
      try {
        const product = req.body;
        const result = await products.insertOne(product);
        res.send(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.put("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateProduct = req.body;
        const currentDate = new Date();

        const increaseStock = req.body.increaseStock;

        updateProduct.stock =
          parseInt(updateProduct.stock) + parseInt(increaseStock);
        updateProduct.lastUpdated = currentDate;

        const updateDoc = { $set: updateProduct };
        const options = { upsert: true };
        const result = await products.updateOne(filter, updateDoc, options);
        res.send(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.delete("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await products.deleteOne(query);
        res.sendStatus(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/orders", async (req, res) => {
      const ordersData = req.body;
      const result = await orders.insertOne(ordersData);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const result = await orders.findOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
