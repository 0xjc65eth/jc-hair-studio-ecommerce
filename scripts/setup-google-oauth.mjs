#!/usr/bin/env node

/**
 * GOOGLE OAUTH SETUP FOR SEARCH CONSOLE API
 * ========================================
 *
 * This script helps you set up Google OAuth credentials for
 * accessing the Google Search Console API.
 *
 * Steps:
 * 1. Creates OAuth2 client
 * 2. Generates authorization URL
 * 3. Exchanges authorization code for tokens
 * 4. Saves tokens for future use
 *
 * Usage:
 *   node scripts/setup-google-oauth.mjs
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { URL } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREDENTIALS_FILE = path.join(__dirname, '..', 'google-oauth-credentials.json');
const TOKEN_FILE = path.join(__dirname, '..', 'google-oauth-token.json');
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/indexing'
];

class GoogleOAuthSetup {
  constructor() {
    this.oauth2Client = null;
    this.server = null;
  }

  async log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  async checkCredentialsFile() {
    try {
      await fs.access(CREDENTIALS_FILE);
      return true;
    } catch {
      return false;
    }
  }

  async createCredentialsFile() {
    await this.log('Creating credentials file template...');

    const template = {
      web: {
        client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        project_id: 'your-project-id',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: 'YOUR_CLIENT_SECRET',
        redirect_uris: ['http://localhost:3000/oauth2callback']
      }
    };

    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(template, null, 2));

    await this.log(`Credentials template created at: ${CREDENTIALS_FILE}`);
    await this.log('\nPlease follow these steps:');
    await this.log('1. Go to: https://console.cloud.google.com/apis/credentials');
    await this.log('2. Create a new OAuth 2.0 Client ID (or use existing one)');
    await this.log('3. Add http://localhost:3000/oauth2callback to authorized redirect URIs');
    await this.log('4. Download the credentials JSON file');
    await this.log('5. Replace the content of google-oauth-credentials.json with the downloaded file');
    await this.log('6. Enable the following APIs in your Google Cloud Project:');
    await this.log('   - Google Search Console API');
    await this.log('   - Web Search Indexing API');
    await this.log('\nRun this script again after setting up credentials.\n');

    return false;
  }

  async loadCredentials() {
    const hasCredentials = await this.checkCredentialsFile();

    if (!hasCredentials) {
      await this.createCredentialsFile();
      return false;
    }

    try {
      const credentials = JSON.parse(await fs.readFile(CREDENTIALS_FILE, 'utf8'));

      if (credentials.web.client_id.includes('YOUR_CLIENT_ID')) {
        await this.log('ERROR: Please replace placeholder values in google-oauth-credentials.json');
        await this.log('Follow the instructions above to get real credentials.');
        return false;
      }

      const { client_secret, client_id, redirect_uris } = credentials.web;

      this.oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      await this.log('Credentials loaded successfully!');
      return true;
    } catch (error) {
      await this.log(`Error loading credentials: ${error.message}`);
      return false;
    }
  }

  async getAuthorizationCode() {
    return new Promise((resolve, reject) => {
      const authUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
      });

      console.log('\n========================================');
      console.log('AUTHORIZATION REQUIRED');
      console.log('========================================\n');
      console.log('Opening browser for authorization...');
      console.log('If the browser does not open, please visit this URL:\n');
      console.log(authUrl);
      console.log('\n========================================\n');

      // Start local server to receive callback
      this.server = http.createServer(async (req, res) => {
        try {
          const url = new URL(req.url, 'http://localhost:3000');

          if (url.pathname === '/oauth2callback') {
            const code = url.searchParams.get('code');

            if (code) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(`
                <html>
                  <head><title>Authorization Successful</title></head>
                  <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: green;">Authorization Successful!</h1>
                    <p>You can close this window and return to the terminal.</p>
                  </body>
                </html>
              `);

              this.server.close();
              resolve(code);
            } else {
              res.writeHead(400, { 'Content-Type': 'text/html' });
              res.end(`
                <html>
                  <head><title>Authorization Failed</title></head>
                  <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: red;">Authorization Failed!</h1>
                    <p>No authorization code received.</p>
                  </body>
                </html>
              `);

              this.server.close();
              reject(new Error('No authorization code received'));
            }
          }
        } catch (error) {
          this.server.close();
          reject(error);
        }
      });

      this.server.listen(3000, () => {
        console.log('Local server started on http://localhost:3000');
        console.log('Waiting for authorization...\n');

        // Try to open browser automatically
        try {
          import('open').then(({ default: open }) => {
            open(authUrl);
          }).catch(() => {
            console.log('Could not open browser automatically. Please click the URL above.');
          });
        } catch {
          console.log('Could not open browser automatically. Please click the URL above.');
        }
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        if (this.server) {
          this.server.close();
          reject(new Error('Authorization timeout'));
        }
      }, 300000);
    });
  }

  async exchangeCodeForTokens(code) {
    await this.log('Exchanging authorization code for tokens...');

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      await this.log('Tokens received successfully!');
      return tokens;
    } catch (error) {
      await this.log(`Error exchanging code for tokens: ${error.message}`);
      throw error;
    }
  }

  async saveTokens(tokens) {
    try {
      await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
      await this.log(`Tokens saved to: ${TOKEN_FILE}`);
      return true;
    } catch (error) {
      await this.log(`Error saving tokens: ${error.message}`);
      return false;
    }
  }

  async testConnection() {
    await this.log('\nTesting connection to Google Search Console API...');

    try {
      const searchConsole = google.searchconsole({ version: 'v1', auth: this.oauth2Client });

      const response = await searchConsole.sites.list();

      if (response.data.siteEntry && response.data.siteEntry.length > 0) {
        await this.log('Connection successful!');
        await this.log('\nYour verified sites:');
        response.data.siteEntry.forEach(site => {
          console.log(`  - ${site.siteUrl}`);
        });
        return true;
      } else {
        await this.log('WARNING: No sites found. Make sure you have verified your site in Google Search Console.');
        return false;
      }
    } catch (error) {
      await this.log(`Error testing connection: ${error.message}`);
      return false;
    }
  }
}

// Main execution
async function main() {
  const setup = new GoogleOAuthSetup();

  console.log('\n GOOGLE OAUTH SETUP FOR SEARCH CONSOLE API');
  console.log('============================================\n');

  try {
    // Load credentials
    const credentialsLoaded = await setup.loadCredentials();
    if (!credentialsLoaded) {
      process.exit(1);
    }

    // Get authorization code
    const code = await setup.getAuthorizationCode();

    // Exchange code for tokens
    const tokens = await setup.exchangeCodeForTokens(code);

    // Save tokens
    await setup.saveTokens(tokens);

    // Test connection
    await setup.testConnection();

    console.log('\n========================================');
    console.log('SETUP COMPLETED SUCCESSFULLY!');
    console.log('========================================\n');
    console.log('You can now use the following scripts:');
    console.log('  - npm run seo:force-index (API method)');
    console.log('  - npm run seo:monitor-index (Monitor indexation status)');
    console.log('  - npm run seo:master-index (All methods)\n');

  } catch (error) {
    console.error('\n Setup failed:', error.message);
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('\n Unexpected error:', error);
  process.exit(1);
});
