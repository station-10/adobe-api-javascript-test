const axios = require('axios');
require('dotenv').config();

// load credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const COMPANY_ID = process.env.COMPANY_ID;
const SCOPES = process.env.SCOPES;

// API endpoints
const TOKEN_URL = 'https://ims-na1.adobelogin.com/ims/token/v3';
const REPORT_URL = `https://analytics.adobe.io/api/${COMPANY_ID}/reports`;

// function to get access token
async function getAccessToken() {
    const data = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials&scope=${SCOPES}`;
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    try {
        const response = await axios.post(TOKEN_URL, data, config);
        return response.data.access_token;
    } catch (error) {
        console.error(`Failed to get access token: ${error}`);
    }
}

// function to get data from Adobe Analytics Reporting API
async function getReportData() {
    const accessToken = await getAccessToken();
    const requestData = buildRequestData();
    const config = buildRequestConfig(accessToken);

    try {
        const response = await axios.post(REPORT_URL, requestData, config);
        return response.data;
    } catch (error) {
        console.error(`Failed to get report data: ${error}`);
    }
}

function buildRequestData() {
    return {
        "rsid": "saintgobaindistributionprod",
        "globalFilters": [
            {
                "type": "dateRange",
                "dateRange": "2023-05-01T00:00:00.000/2023-06-01T00:00:00.000",
                "dateRangeId": "thisMonth"
            }
        ],
        "metricContainer": {
            "metrics": [
                {
                    "columnId": "0",
                    "id": "metrics/visits",
                    "sort": "desc"
                },
                {
                    "columnId": "1",
                    "id": "metrics/orders"
                }
            ]
        },
        "dimension": "variables/marketingchannel",
        "settings": {
            "countRepeatInstances": true,
            "includeAnnotations": true,
            "limit": 50,
            "page": 0,
            "nonesBehavior": "return-nones"
        },
        "statistics": {
            "functions": [
                "col-max",
                "col-min"
            ]
        },
        "capacityMetadata": {
            "associations": [
                {
                    "name": "applicationName",
                    "value": "Analysis Workspace UI"
                },
                {
                    "name": "projectId",
                    "value": "undefined"
                },
                {
                    "name": "projectName",
                    "value": "New project"
                },
                {
                    "name": "panelName",
                    "value": "Freeform table"
                }
            ]
        }
    };
}

function buildRequestConfig(accessToken) {
    return {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': CLIENT_ID,
            'x-proxy-global-company-id': COMPANY_ID,
        },
    };
}

// call the function to get report data
getReportData().then(console.log).catch(console.error);
