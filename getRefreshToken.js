const { google } = require("googleapis");
const readlineSync = require("readline-sync");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Generate an authentication URL
const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",  // Needed to get a refresh token
    scope: ["https://www.googleapis.com/auth/drive"],
});

console.log("Authorize this app by visiting this URL:", authUrl);

// Ask user to enter the code from the browser
const code = readlineSync.question("Enter the code from the browser: ");

// Exchange code for tokens
oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
        console.error("Error getting tokens:", err);
        return;
    }

    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token); // Save this

    // Store tokens securely
    oauth2Client.setCredentials(tokens);
});
