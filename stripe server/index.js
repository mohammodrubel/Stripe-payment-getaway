const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51P1kt4F28zhW1wrkrOOWNrZEkSxRSyRrzBp0huGcBynbCw3A7tGvFYHtrxKZDvrUBodr8WvKBSnNWiWOufPY2dCs00EYEGteul'); 
const app = express();
const port = process.env.PORT || 9000;
const uri = "mongodb+srv://payment:UIVuCTe1aFE0NmWI@cluster0.bcznviz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
async function run() {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("database connect successfully");
    const paymentCollection = await client.db("demoData").collection("payment") 



      app.post("/create-payment-intent", async (req, res) => {
        const { price } = req.body;
        const amount = price * 100;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      });

      app.post('/payment',async(req,res)=>{
        console.log(req.body)
        const payment = req.body
        const result = await paymentCollection.insertOne(payment)
        res.send(  result)
       
      })

    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/')
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
