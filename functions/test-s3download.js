const AWS = require("aws-sdk")

// This function reads the contents of `name-of-your-file.json` from an
// AWS S3 bucket and returns the contents.
exports.handler = async (event, context) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  })

  try {
    const result = await s3.getObject({
      // The bucket name
      Bucket: "data.ivansherbs.com",
      // The key/name of your file
      Key: `name-of-your-file.json`,
    })

    if (error) return { statusCode: 500, body: JSON.stringify(error) }

    return {
      statusCode: 200,
      headers: {
        "content-type": result ? result.ContentType : "application/json",
      },
      body: JSON.stringify({ ...result, Body: result.Body.toString("utf-8") }),
    }
  } catch (e) {
    return { statusCode: 500, body: e.message }
  }
}
