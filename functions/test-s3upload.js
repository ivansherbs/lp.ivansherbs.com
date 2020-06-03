const AWS = require("aws-sdk")

exports.handler = async (event, context) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  })

  try {
    const result = await s3.upload({
        // The bucket name
        Bucket: "data.ivansherbs.com",
        // The key/name of your file
        Key: "hello-world.txt",
        // The contents of your file
        Body: "Hello World!",
        // The access control
        ACL: "private",
        ContentEncoding: "utf8", // required
        ContentType: "text/html",
      })
      .promise()

    if (error) return { statusCode: 500, body: JSON.stringify(error) }

    return { statusCode: 200, body: JSON.stringify(result) }
  } catch (e) {
    return { statusCode: 500, body: e.message }
  }
}
