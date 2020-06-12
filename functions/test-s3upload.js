const AWS = require("aws-sdk")

exports.handler = async (event, context) => {
  console.log("im here");

  const s3 = new AWS.S3({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  });

  try {
    const result = await s3
      .upload({
        // The bucket name
        Bucket: "data.ivansherbs.com",
        // The key/name of your file
        Key: `name-of-your-file.json`,
        // The contents of your file
        Body: JSON.stringify({ hello: "world" }),
        // The access control
        ACL: "private",
        ContentEncoding: "utf8", // required
        ContentType: `application/json`,
      })
      .promise()

    if (error) return { statusCode: 500, body: JSON.stringify(error) }

    return { statusCode: 200, body: JSON.stringify(result) }
  } catch (e) {
    return { statusCode: 500, body: e.message }
  }
}
