/*
 * PP-101 runtime configuration.
 *
 * GitHub Pages serves static files only. Set submissionEndpoint to a secure
 * HTTPS serverless/API endpoint that accepts the workbook JSON payload and
 * sends it to the Training Coordinator. Never place an email API secret here.
 */
window.PP101_CONFIG = Object.freeze({
  submissionEndpoint: '',
  coordinatorEmail: 'training@skunkworksacademy.com',
  storageKey: 'skunkworks-pp-101-workbook-v2',
  maximumResponseCharacters: 4000
});
