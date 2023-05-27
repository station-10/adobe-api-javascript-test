const axios = require('axios');
const fs = require('fs');

// load credentials from file
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// function to get access token
async function getAccessToken() {
    const url = 'https://ims-na1.adobelogin.com/ims/token/v3';
    const data = `client_id=${credentials.client_id}&client_secret=${credentials.client_secret}&grant_type=client_credentials&scope=${credentials.scopes}`;

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const response = await axios.post(url, data, config);
    return response.data.access_token;
}

// function to get data from Adobe Analytics Reporting API
async function getReportData() {
    const accessToken = await getAccessToken();

    const url = `https://analytics.adobe.io/api/${credentials.company_id}/reports`;
    const requestData = {
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
    }

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': credentials.client_id,
            'x-proxy-global-company-id': credentials.company_id,
        },
    };

    const response = await axios.post(url, requestData, config);
    return response.data;
}

// call the function to get report data
getReportData().then(console.log).catch(console.error);
