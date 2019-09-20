require('dotenv').config();
const app = require("express")();
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")(process.env.STRIPE_TEST_SECRET);

app.use(require("body-parser").text());


app.post("/charge", async (req, res) => {
  console.log('req.body>>>', req.body);
  try {
    let {status} = await stripe.charges.create({
      amount: 2000,
      currency: "usd",
      description: "An example charge",
      source: req.body   // req.body contains token sent from the FE
    });

    res.json({status});
  } catch (err) {
    res.status(500).end();
  }
});

app.listen(9000, () => console.log("Listening on port 9000"));

