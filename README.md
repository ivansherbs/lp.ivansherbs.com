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

### Setup your Netlify environment

1. Create a site by running `ntl init`

2. In the Settings -> Build & deploy -> Environment add the following environment variables:

```
STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
STRIPE_SECRET_KEY=<replace-with-your-secret-key>
MY_AWS_ACCESS_KEY_ID=<your-aws-access-key>
MY_AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
```

### Steps to run the code locally

1. Clone and configure the sample

```shell
git clone https://github.com/thekizoch/trialcheckout
```

2. Login into your Netlify account from the CLI

Make sure you have `netlify-cli` module installed globally (`npm i -g netlify-cli`), then run:

```shell
ntl login
```

Login and allow acess from your browser.


3. Link the current repo to the Netlify site

```shell
ntl link --id <site_api_id>
```

where `site_api_id` is under Settings -> General -> API ID

4. Run Netlify CLI locally

```shell
netlify dev
```

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
