const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(express.json());
app.use(cors());

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.072tx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("goTravel");
    const featuresCollection = database.collection("features");
    const servicesCollection = database.collection("services");
    const bookingsCollection = database.collection("bookings");
    //GET API features
    app.get("/features", async (req, res) => {
      const cursor = featuresCollection.find({});
      const feature = await cursor.toArray();
      res.json(feature);
    });
    //GET API services
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.json(services);
    });
    //POST API Services
    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await servicesCollection.insertOne(services);
      res.json(result);
    });
    //GET API Services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("hitting services id", id);
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });
    //Post API Booking
    app.post("/bookings", async (req, res) => {
      console.log("hitting book", req.body);
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.json(result);
    });
    //GET API Booking
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const cursor = bookingsCollection.find(query);
      const mybooking = await cursor.toArray();
      res.json(mybooking);
    });
    //DELETE API
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.json(result);
    });
    //GET ALL Bookings For Admin
    app.get("/managebookings", async (req, res) => {
      const cursor = bookingsCollection.find({});
      const bookings = await cursor.toArray();
      res.json(bookings);
    });
    //Approve
    app.get("/managebookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.findOne(query);
      res.json(result);
    });
  } finally {
    //  await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("loading GoTravel Server");
});
app.listen(port, () => {
  console.log("listening to port", port);
});
