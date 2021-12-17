const express = require('express')
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;


//middleware setup
app.use(cors());
app.use(express.json()); //convirt data to json format

// mongodb setup

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v0ciw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//console.log(uri)

async function run() {
    try {
     
      await client.connect();
      console.log("Connected successfully to mongo db server");

      const database = client.db("tourshare");
      const createTeamCollection = database.collection("createTeam");
      const joinTeamCollection = database.collection("joinTeam");
      const userCollection=database.collection("systemUserCollection");
      const trandingCollection=database.collection("trandingSection");
      const nidCollection=database.collection("nidNumber");




      //post api for create team
      app.post("/createteam", async (req, res) => {
        const newCreateTeam = req.body;
       //  console.log(newCreateTeam);
        const result = await createTeamCollection.insertOne(newCreateTeam);
  
         //console.log("user order information", result);
        res.json(result);
      });
//get api for individual data using email
      app.get("/createteam", async (req, res) => {
        const email = req.query.email;
        console.log(email)
        const query = { userEmail: email };
       //  console.log(query);
        const cursor = createTeamCollection.find(query);
        const individualTeam = await cursor.toArray();


  
        res.send(individualTeam);
      });
      //get api for individual data using teamName
      app.get("/createteambyTeam", async (req, res) => {
        const teamName = req.query.teamName;
        console.log(teamName)
        const query = { teamName: teamName };
       //  console.log(query);
        const cursor = createTeamCollection.find(query);
        const individualTeam = await cursor.toArray();


  
        res.send(individualTeam);
      });
   // get api for individual data using id
      app.get("/createteam/:id", async (req, res) => {
        const id=req.params.id;
        const query = { _id: ObjectId(id) };
        const cursor = createTeamCollection.find(query);
        const individualTeamById = await cursor.toArray();
       

        res.send(individualTeamById)
      });


      // put api to update data
      app.put("/createteam/:id", async (req, res) => {
        const id=req.params.id;
        const updateTeam=req.body;
        console.log(updateTeam)
        const filter = { _id: ObjectId(id) };
     const option={upsert:true};
     const updateDoc={$set:{


      destination:updateTeam.destination,
      teamMember:updateTeam.teamMember,
      neededMember:updateTeam.neededMember,
      startDate:updateTeam.startDate,
      endDate:updateTeam.endDate
     
     
 
    
     }}

     const result= await createTeamCollection.updateOne(filter,updateDoc,option);

     res.json(result)
      });



//delte api for deleting team
      app.delete("/allcreteteam/:id", async (req, res) => {
        const id = req.params.id;
     //  console.log("delte order id", id);
        const query = { _id: ObjectId(id) };
        const result = await createTeamCollection.deleteOne(query);
        //console.log("deleting count", result);
        res.json(result);
      });
      
      
      //get api for get all data

      app.get("/allcreateteam", async (req, res) => {
        const cursor = createTeamCollection.find({});
        const createTeam = await cursor.toArray();
        res.send(createTeam);
      });

      //update value in create team

      app.put("/allcreateteam/:id", async (req, res) => {
      const id=req.params.id ;
      const updateTeam=req.body.neededMember;
      const updateTotalMember=req.body.teamMember;

     
     
     const filter = { _id: ObjectId(id) };
     const option={upsert:true};
     const updateDoc={$set:{


      neededMember:updateTeam,
      teamMember:updateTotalMember,
     

      disabled:true
     }}

     const result= await createTeamCollection.updateOne(filter,updateDoc,option);

     res.json(result)
      });

      app.post("/jointeam", async (req, res) => {
        const newJoinTeam = req.body;
      //   console.log(newJoinTeam);
        const result = await joinTeamCollection.insertOne(newJoinTeam);
  
        // console.log("user order information", result);
        res.json(result);
      });
      app.get("/jointeam", async (req, res) => {
        const teamName = req.query.teamName;
        //console.log(teamName)
        const query = { teamName: teamName  };
       //  console.log(query);
        const cursor = joinTeamCollection.find(query);
        const individualTeam = await cursor.toArray();
  
        res.send(individualTeam);
      });
    
      //get api for get data

      app.get("/alljointeam", async (req, res) => {
        const cursor = joinTeamCollection.find({});
        const joinTeam = await cursor.toArray();
        res.send(joinTeam);
      });

      app.delete("/alljointeam/:id", async (req, res) => {
        const id = req.params.id;
        console.log("delte order id", id);
        const query = { _id: ObjectId(id) };
        const result = await joinTeamCollection.deleteOne(query);
        //console.log("deleting count", result);
        res.json(result);
      });
      
      //post api for save user in database

      app.post("/users",async(req,res)=>{

        const newUser=req.body;
        const result = await userCollection.insertOne(newUser);
        res.json(result);
      })
    
      //put api for update data in database or save in database if user isnt exist in database
      app.put("/users",async(req,res)=>{

        const newUser=req.body;
        
        const filter={email:newUser.email};
        const option={upsert:true};
        const updateDoc={$set:newUser}
        const result= await userCollection.updateOne(filter,updateDoc,option)
        res.json(result);
      });
//add user admin to database 
      app.put("/users/admin", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
  
        const updateDoc = { $set: { role: "admin" } };
        const result = await userCollection.updateOne(filter, updateDoc);
        res.json(result);
      });

       //get api for individual user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      // console.log(query);
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      //console.log(services);
      res.send({ admin: isAdmin });
    });

    //tranding section get 

    app.get("/tranding",async(req,res)=>{
      const cursor = trandingCollection.find({});
      const trandingPlace = await cursor.toArray();
      res.send(trandingPlace);

    })

 
    app.post("/tranding",async(req,res)=>{

      const newTrandingPlace=req.body;
      console.log(newTrandingPlace)
      const result = await trandingCollection.insertOne(newTrandingPlace);
      res.json(result);
    })
    //nid number section

    app.put("/nid",async(req,res)=>{

      const userNid=req.body;
      const filter={nidNumber:userNid.nidNumber};
      const updateDoc={$set:userNid}
      const option={upsert:true};
      
      const result = await nidCollection.updateOne(filter,updateDoc,option);
      res.json(result);
    })
    app.get("/nid",async(req,res)=>{
      const cursor = nidCollection.find({});
      const nidNumber = await cursor.toArray();
      res.send(nidNumber);

    })

    } finally {
      
     // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('tourshare!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})