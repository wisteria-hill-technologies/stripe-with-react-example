require('dotenv').config();
const app = require("express")();
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")(process.env.STRIPE_TEST_SECRET);
const bodyParser = require('body-parser'); //Help parse incoming HTTP requests
app.use(bodyParser.text());

app.get('/hello', (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.post("/charge", async (req, res) => {
  // Traditional Stripe - No longer use this endpoint.
  try {
    let {status} = await stripe.charges.create({
      amount: 4000,
      currency: "gbp",
      description: "An example charge",
      source: req.body  // req.body will be a token string sent from the FE
    });

    res.json({status});
  } catch (err) {
    res.status(500).end();
  }
});

app.get("/start-payment", async (req, res) => {
  // Call this endpoint to set paymentIntents first.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 30000,
    currency: 'gbp',
    payment_method_types: ['card'],
    description: "testing paymentIntent",
    metadata: { test: 'test 123' }  // additional info if I want to add here. maybe pass this info from the front end via /start-payment endpoint above.
  });
  console.log('paymentIntent.id>>>>', paymentIntent.id);
  // Return client_secret for the paymentIntent created above to the Front end.
  res.json({client_secret: paymentIntent.client_secret});
});

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  // Set stripe dashboard so that stripe will trigger this endpoint when paymentIntent status changes.
  console.log('contacted by webhook!!!');

  let event = null;
  try {
    event = JSON.parse(request.body) || {};
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  let intent = null;
  switch (event.type) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      console.log("Succeeded:", intent.id);
      console.log("Succeeded: billing_details>>>", intent.charges.data[0].billing_details);
      console.log("Succeeded: metadata>>>", intent.charges.data[0].metadata);
      break;
    case 'payment_intent.payment_failed':
      intent = event.data.object;
      const message = intent.last_payment_error && intent.last_payment_error.message;
      console.log('Failed:', intent.id, message);
      break;
  }

  response.sendStatus(200);
});

app.listen(9000, () => console.log("Listening on port 9000"));

