const express = require('express')
const app = express();
const cors = require("cors");
require("dotenv").config();
const SSLCommerzPayment = require('sslcommerz')
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const { v4: uuidv4 } = require('uuid');


//middleware setup
app.use(cors());
app.use(express.json()); //convirt data to json format
app.use(express.urlencoded({ extended: true }));

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
      const hotelsCollection=database.collection("hotels");
      const bookingCollection=database.collection("booking")




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

    //hotel section api

    app.get("/hotels",async(req,res)=>{
      let search=req.query.search;
      const price=req.query.price;
      const totalRoom=req.query.totalRoom;
      const roomtype=req.query.roomtype?.toLowerCase()
      search = search.replace(/\s+/g, '');
      
      console.log(search,price,roomtype,totalRoom,typeof(totalRoom),typeof(price))
      const query={
        
        destination:search,
      
        price:{$lte:price},
        totalRoom:{$gte:totalRoom},
        rooms:roomtype,
        
      
      }
      const cursor=hotelsCollection.find(query);
      const hotels=await cursor.toArray();
      res.send(hotels)
    })
 //payment getway api
 //payment initialize api
app.post('/init', async (req, res) => {
  console.log(req.body)
  const data = {
      total_amount:req.body.hotelCost,
      currency: 'BDT',
      tran_id: uuidv4() ,
      success_url: 'http://localhost:5000/success',
      fail_url: 'http://localhost:5000/fail',
      cancel_url: 'http://localhost:5000/cancel',
      ipn_url: 'http://localhost:5000/ipn',
      shipping_method: 'Courier',
      product_name: req.body.hotelName,
      product_category: 'Electronic',
      product_profile: 'general',
      payment_status:"pending",
      cus_name: req.body.userName,
      cus_email: req.body.userEmail,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: req.body.phoneNumber,
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
      multi_card_name: 'mastercard',
      value_a: 'ref001_A',
      value_b: 'ref002_B',
      value_c: 'ref003_C',
      value_d: 'ref004_D',
      arrivalTime:req.body.arrivalTime,
      roomType:req.body.roomType,
      checkIn:req.body.checkIn,
      checkOut:req.body.checkOut,
      totalRoom:req.body.totalRoom,
      address:req.body.address,
      
  };
   const bookingInfo=bookingCollection.insertOne(data)
   
  const sslcommer = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD,false) //true for live default false for sandbox
  sslcommer.init(data).then(data => {
      //process the response that got from sslcommerz 
      //https://developer.sslcommerz.com/doc/v4/#returned-parameters
     // console.log(data)
    if(data.GatewayPageURL){
      res.json(data.GatewayPageURL)
    }
    else{
      return res.status(400).json({

        message:"payment session failed"
      })
    }
  });
})
app.post("/success",async(req,res)=>{
   console.log(req.body)
   const bookingCheck=bookingCollection.updateOne({tran_id:req.body.tran_id},{

    $set:{
      val_id:req.body.val_id
    }
   })
  res.status(200).redirect(`http://localhost:3000/success/${req.body.tran_id}`)

})
app.post("/fail",async(req,res)=>{
  const bookingCheck=bookingCollection.deleteOne({tran_id:req.body.tran_id})
  res.status(200).redirect("http://localhost:3000")

})
app.post("/cancel",async(req,res)=>{
  const bookingCheck=bookingCollection.deleteOne({tran_id:req.body.tran_id})
  res.status(200).redirect("http://localhost:3000")

})
app.get("/booking/:tran_id",async(req,res)=>{
  const id=req.params.tran_id;
  const bookingInfo=await bookingCollection.findOne({tran_id:id})
  console.log(bookingInfo)
  res.json(bookingInfo)
})
app.post("/validate",async(req,res)=>{
 
  const bookingInfo=await bookingCollection.findOne({tran_id:req.body.tran_id})
  console.log(bookingInfo)
  if(bookingInfo.val_id===req.body.val_id){
    const update=await bookingCollection.updateOne({tran_id:req.body.tran_id},{

      $set:{payment_status:"payed"}
    })
    res.send(update.modifiedCount>0)
  }
  else{
    res.send("payment not confirmed.booking discard")
  }
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