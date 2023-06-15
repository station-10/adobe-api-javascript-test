const axios = require('axios');
require('dotenv').config();

// load credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const SCOPES = process.env.SCOPES;


// API endpoints
const TOKEN_URL = 'https://ims-na1.adobelogin.com/ims/token/v3';
const REPORT_URL = `https://mc.adobe.io/${TENANT_ID}/campaign/profileAndServicesExt/`;

// function to get access token
async function getAccessToken() {
    const data = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials&scope=${SCOPES}`;
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    console.log('Sending request to get access token...');
    try {
        const response = await axios.post(TOKEN_URL, data, config);
        console.log('Successfully received access token.');

        // Assuming 'expires_in' is in seconds, convert it to minutes for a more human-readable format
        const expiresInMinutes = response.data.expires_in / 60;

        console.log(`The access token will expire in approximately ${expiresInMinutes} minutes.`);
        return response.data.access_token;
    } catch (error) {
        console.error(`Failed to get access token: ${error.message}`);
        if (error.response) {
            console.error('Error response body: ', error.response.data);
        }
    }
}


// function to get data from Adobe Campaign API
async function getProfileAndServicesData() {
    const accessToken = await getAccessToken();
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': CLIENT_ID,
            'Cache-Control': 'no-cache',
        },
    };

    console.log('Sending request to get profile and services data...');
    try {
        const response = await axios.get(REPORT_URL, config);
        console.log('Successfully received profile and services data.');
        return response.data;
    } catch (error) {
        console.error(`Failed to get profile and services data: ${error.message}`);
        if (error.response) {
            console.error('Error response body: ', error.response.data);
        }
    }
}

// call the function to get profile and services data
getProfileAndServicesData()
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error when calling getProfileAndServicesData:', error.message);
    });
