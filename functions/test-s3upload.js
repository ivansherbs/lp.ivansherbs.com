const AWS = require("aws-sdk");
const Stripe = require("stripe");

const s3 = new AWS.S3({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
});

exports.handler = async (event, context) => {
  // validate form data
  var [formData, err] = validateFormData(event.body);
  if (err) {
    return err;
  }

  // download the subscriber list
  try {
    var subscriberList = await getSubscriberList();
  } catch (err) {
    return err;
  }

  // check if subscriber already exists
  var isSubscribed = checkSubscriberExists(formData, subscriberList);
  if (isSubscribed) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Thanks, but you are already subscribed.",
        error: true
      })
    }
  }

  // append subscriber
  var newSubscriberList = appendSubscriber(formData, subscriberList);

  // uploads to s3 the appended subscriber list
  var result = await saveSubscriberList(newSubscriberList);
  if (result.statusCode != 200) {
    return result;
  }

  var stripeSession = await createStripeSession(formData);
  if (!stripeSession) {
    // TODO: handle stripe session creation failure
  }

  var body = JSON.parse(result.body);
  body.sessionId = stripeSession.id;
  result.body = JSON.stringify(body);

  return result;
}



// ----------------------- Functions -----------------------

async function createStripeSession(formData) {

  var stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: ''
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'ideal'],
    line_items: [{
      price: process.env.STRIPE_PRODUCT_PRICE,
      quantity: 1,
    }],
    mode: 'payment',
    customer_email: formData.email,
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['NL','BE'],
    },
    success_url: 'http://localhost:8888/success.html',
    cancel_url: 'http://localhost:8888/teststyling.html'
  });

  return session;
}

// TODO: download s3 subscriber-file
function getSubscriberList() {

  var s3Params = {
    // The bucket name
    Bucket: "data.ivansherbs.com",
    // The key/name of your file
    Key: "subscribers.csv"
  };

  return new Promise((resolve, reject) => {
    s3.getObject(s3Params, (err, data) => {
      if (err) {
        console.error(err);
        reject({
          statusCode: 200,
          body: "Sorry, there was an issue with server.",
          error: true
        });
        return;
      }

      // parse csv to array
      var subscriberList = [];
      var csvContent = data.Body.toString("utf8");
      var csvLines = csvContent.split("\n");
      for (const line of csvLines) {
        if (line.trim() == "") {
          continue;
        }
        var parts = line.split(",");
        subscriberList.push({
          email: parts[0],
          timestamp: new Date(parts[1])
        });
      }

      resolve(subscriberList);
    });
  });
}

function checkSubscriberExists(formData, subscriberList) {
  for (const subscriber of subscriberList) {
    if (subscriber.email == formData.email) {
      return true;
    }
  }
  return false;
}

function appendSubscriber(formData, subscriberList) {
  subscriberList.push({
    email: formData.email,
    timestamp: new Date()
  });
  return subscriberList;
}

// upload appended subscriber file
async function saveSubscriberList(subscriberList) {
  try {
    const result = await s3.upload({
        // The bucket name
        Bucket: "data.ivansherbs.com",
        // The key/name of your file
        Key: "subscribers.csv",
        // The contents of your file
        Body: toCsv(subscriberList),
        // The access control
        ACL: "private",
        ContentEncoding: "utf8", // required
        ContentType: "text/html",
      })
      .promise()
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Congratulations! You're subscribed."
      })
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: e.message
    }
  }
}

// transform array into csv
function toCsv(subscriberList) {
  var csvContent = "";
  subscriberList.forEach(item => {
    csvContent += item.email + "," + item.timestamp.toISOString() + "\n";
  });
  return csvContent;
}

function validateFormData(bodyData) {
  var formData;
  var validatedFormData = {};

  try {
    formData = JSON.parse(bodyData);
  } catch (e) {
    return [validatedFormData, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid form data. Get a life."
      })
    }]
  }
  // Email Validation
  // TODO: don't accept comma in email
  formData.email = (formData.email || "").trim();

  if (formData.email.length > 256) {
    return [validatedFormData, {
      statusCode: 200,
      body: JSON.stringify({
        message: "This email address is too long. Get a life.",
        error: true
      })
    }]
  }

  var emailTest = formData.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!emailTest) {
    return [validatedFormData, {
      statusCode: 200,
      body: JSON.stringify({
        message: "This email address is not valid.",
        error: true
      })
    }]
  }

  validatedFormData.email = emailTest[0];

  return [validatedFormData, null];
}
