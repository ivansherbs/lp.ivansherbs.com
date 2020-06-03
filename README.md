# Trial Checkout Landing Page

Use Stripe Checkout with Netlify Functions to sell your products online.

## Features

Load products from a JSON product catalogue
Create Checkout Sessions with Netlify Functions
Process Stripe webhook events with Netlify Functions to handle fulfillment

## How to run locally

### Prerequisites

- Node >= 10
- Netlify CLI
- Stripe CLI

Follow the steps below to run locally

#### 1. Clone and configure the sample

```shell
git clone https://github.com/thekizoch/trialcheckout
```

You will need a Stripe account in order to run. Once you set up your account, go to the Stripe developer dashboard to find your API keys.

```
STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
STRIPE_SECRET_KEY=<replace-with-your-secret-key>
```

### 2. Run Netlify Functions locally

You can run the Netlify Functions locally with Netlify Dev:

npm run functions
netlify dev

# Work in progress

## Write S3 Bucket with a Read every 24 to send reminder email to Subscribers

Tutorial can be found here:
https://www.dferber.de/how-to-write-files-to-aws-s3-from-netlify-functions/

What has been done:
- AWS keys set in netlify for private S3 bucket data.ivansherbs.Commerce
- test upload and download functions written for an undefined file.


What needs to be done:
- Create a Zapier function that calls the read function test-download.js to process email sending.

What needs to be defined:
- When we write an S3 file, does that mean it can be appended? or only new files added?
