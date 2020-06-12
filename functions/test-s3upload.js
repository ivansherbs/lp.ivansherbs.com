const AWS = require("aws-sdk")

exports.handler = async (event, context) => {
  console.dir(JSON.parse(event.body));
  var formData = JSON.parse(event.body);

  // TODO: validate Email
  //3 at least 2 characters after last (fix Regex)

  // Email Validation
  formData.email = (formData.email || "").trim();

  if (formData.email.length > 256) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "This email address is too long. Get a life." })
    }
  }

  var emailTest = formData.email.match(/^[^@\s]+@[^@\s\.]+\.[^@\s]+$/)

  console.dir(emailTest)

  if (!emailTest) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "This email address is not valid." })
    }
  }

  var email = emailTest[0];


  // TODO: download s3 subscriber-file

  // TODO: check if subscriber already exists

  // TODO: append subscriber

  // upload appended subscriber file
  const s3 = new AWS.S3({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  });

  try {
    const result = await s3.upload({
        // The bucket name
        Bucket: "data.ivansherbs.com",
        // The key/name of your file
        Key: "subscriber-file.json",
        // The contents of your file
        Body: email,
        // The access control
        ACL: "private",
        ContentEncoding: "utf8", // required
        ContentType: "text/html",
      })
      .promise()
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Congratulations! You're subscribed." })
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
