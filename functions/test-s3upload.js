const AWS = require("aws-sdk")

const s3 = new AWS.S3({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
});

exports.handler = async (event, context) => {
  console.dir(JSON.parse(event.body));
  var formData = JSON.parse(event.body);

  // Email Validation
  // TODO: don't accept comma in email
  formData.email = (formData.email || "").trim();

  if (formData.email.length > 256) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "This email address is too long. Get a life."
      })
    }
  }

  var emailTest = formData.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

  console.dir(emailTest)

  if (!emailTest) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "This email address is not valid."
      })
    }
  }

  var email = emailTest[0];

  var subscriberList = getSubscriberList();

  // check if subscriber already exists
  var isSubscribed = checkSubscriberExists(email, subscriberList);
  if (isSubscribed) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Thanks, but you are already subscribed."
      })
    }
  }

  var newSubscriberList = appendSubscriber(email, subscriberList);

  return saveSubscriberList(newSubscriberList);
}



// ----------------------- Functions ---


// TODO: download s3 subscriber-file
function getSubscriberList() {
  return [];
}

function checkSubscriberExists(email, subscriberList) {
  for (const i in subscriberList) {
    if (subscriberList[i].email = email) {
      return true;
    }
  }
  return false;
}

function appendSubscriber(email, subscriberList) {
  subscriberList.push({
    email: email,
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
  console.log("the email is" + csvContent)
  return csvContent;
}
