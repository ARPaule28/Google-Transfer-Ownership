const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set credentials using the access token
oAuth2Client.setCredentials({ access_token: process.env.ACCESS_TOKEN });

module.exports = {
  drive: google.drive({ version: 'v3', auth: oAuth2Client }),
};
