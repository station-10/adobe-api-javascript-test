# adobe-api-javascript-test

This script uses Node.js and axios to make requests to the Adobe Campaign API and fetch profile and services data.

# Setup

## Install dependencies

You need to have Node.js and npm installed on your local machine. Once you have these, you can install the dependencies by running:

```bash
npm install
```

This will install the required axios and dotenv modules.

## Configure environment variables

The script expects the following environment variables:

CLIENT_ID - Your Adobe API Client ID
CLIENT_SECRET - Your Adobe API Client Secret
TENANT_ID - Your Adobe Tenant ID
SCOPES - The scopes your application requires access to

You need to create a .env file in the root directory of the project, and add these variables. Here's a template for your .env file:

```bash
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
TENANT_ID=your_tenant_id
SCOPES=your_scopes
```

# Usage

To execute the script, run:

```bash
node script.js
```

This script will first get an access token from Adobe using the Client Credentials flow, and then use that token to make an API request to get profile and services data from Adobe Campaign. The received data will be logged to the console.
