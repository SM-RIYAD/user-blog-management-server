const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wacbf1n.mongodb.net/?retryWrites=true&w=majority`;

// mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wacbf1n.mongodb.net/?retryWrites=true&w=majority
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Database Connected!");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const userCollection = client.db("userBlogManagement").collection("users");



app.get("/", (req, res) => {
  res.send("user management  server is running");
});

///adding user api
app.post('/adduser', async (req, res) => {
  const user = req.body;
  // insert email if user doesnt exists: 
  // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
  console.log("user for debug req",user)
  const query = { email: user?.email }
  const existingUser = await userCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: 'user already exists', insertedId: null })
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
});


///get specific user api
app.get("/specificUser/:email", async (req, res) => {
  const email = req.params.email;
console.log("this email is for user details",email)
  // if (email !== req.decoded.email) {
  //   return res.status(403).send({ message: 'forbidden access' })
  // }

  const query = { email: email };
  const user = await userCollection.findOne(query);
  // let DontHasPackage =false;
  // if (user) {
  //   DontHasPackage = user?.badge === 'bronze';
  // }
  res.send({ user });
  // res.send(result);
});


///get all users api
///get all the users 


app.get('/users', async (req, res) => {

  const result = await userCollection.find().toArray();
  res.send(result);
});


///login user api


app.post('/login', async (req, res) => {


  // if (email !== req.decoded.email) {
  //   return res.status(403).send({ message: 'forbidden access' })
  // }

  const user = req.body;
  // insert email if user doesnt exists: 
  // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
  console.log("user for debug req",user)
  const query = { email: user?.email }
  const  existingUser= await userCollection.findOne(query);
  // if (existingUser) {
  //   return res.send({ message: 'user already exists', insertedId: null })
  // }
  // const result = await userCollection.insertOne(user);










  if (user.email===existingUser.email && user.password===existingUser.password) {
    res.send(existingUser);
  }
  else {
    res.send({ message: 'invalid user'});

  }
  
})





///update user api

app.patch('/updateuser/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };

  const userinfo = req.body;
  console.log("from body update", userinfo);

  // console.log("new meal", newmeal);
  const usertoupdate = {
    $set: userinfo,
  };


  const result = await userCollection.updateOne(filter,  usertoupdate);
  res.send(result);
})












app.listen(port, () => {
  console.log(
    `management is running on port: ${port}, ${process.env.DB_USER},${process.env.DB_PASS} `
  );
});
