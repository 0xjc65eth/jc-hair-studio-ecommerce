/**
 * Gmail Integration Helper for JC Hair Studio
 * Facilitates OAuth 2.0 setup and email sending via Gmail API
 */

const { google } = require('googleapis');

class GmailHelper {
  constructor() {
    this.oauth2Client = null;
    this.gmail = null;
  }

  /**
   * Initialize OAuth2 client with credentials
   * @param {Object} credentials - Google OAuth2 credentials
   * @param {string} credentials.client_id - Google Client ID
   * @param {string} credentials.client_secret - Google Client Secret
   * @param {string} credentials.redirect_uri - Redirect URI
   */
  initializeOAuth(credentials) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  /**
   * Generate authorization URL for OAuth flow
   * @param {Array} scopes - Google API scopes
   * @returns {string} Authorization URL
   */
  getAuthUrl(scopes = ['https://www.googleapis.com/auth/gmail.send']) {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
    return authUrl;
  }

  /**
   * Exchange authorization code for tokens
   * @param {string} code - Authorization code from OAuth callback
   * @returns {Object} Token information
   */
  async getTokens(code) {
    const { tokens } = await this.oauth2Client.getAccessToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  /**
   * Set tokens for authenticated requests
   * @param {Object} tokens - OAuth2 tokens
   */
  setTokens(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Send email via Gmail API
   * @param {Object} emailData - Email configuration
   * @param {string} emailData.to - Recipient email
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.html - HTML content
   * @param {string} emailData.text - Plain text content
   * @param {string} emailData.from - Sender email (must be authenticated Gmail account)
   */
  async sendEmail(emailData) {
    const { to, subject, html, text, from } = emailData;

    // Create email message
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="boundary"',
      '',
      '--boundary',
      'Content-Type: text/plain; charset=utf-8',
      '',
      text || '',
      '--boundary',
      'Content-Type: text/html; charset=utf-8',
      '',
      html || '',
      '--boundary--'
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return {
        success: true,
        messageId: result.data.id,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * Get user profile information
   * @returns {Object} User profile data
   */
  async getUserProfile() {
    try {
      const result = await this.gmail.users.getProfile({
        userId: 'me'
      });
      return {
        success: true,
        profile: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if tokens are valid and refresh if necessary
   * @returns {boolean} Token validity status
   */
  async validateTokens() {
    try {
      await this.oauth2Client.getAccessToken();
      return true;
    } catch (error) {
      console.error('Token validation failed:', error.message);
      return false;
    }
  }
}

module.exports = GmailHelper;

// Example usage:
/*
const GmailHelper = require('./lib/gmail-helper');

// Initialize
const gmailHelper = new GmailHelper();
gmailHelper.initializeOAuth({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI
});

// Get authorization URL (for initial setup)
const authUrl = gmailHelper.getAuthUrl();
console.log('Visit this URL to authorize:', authUrl);

// After user authorizes and you get the code:
// const tokens = await gmailHelper.getTokens(authorizationCode);

// Send email
const emailResult = await gmailHelper.sendEmail({
  to: 'customer@example.com',
  subject: 'Confirmação de Pedido - JC Hair Studio',
  html: '<h1>Obrigado pelo seu pedido!</h1>',
  text: 'Obrigado pelo seu pedido!',
  from: 'JC Hair Studio <juliocesarurss65@gmail.com>'
});
*/