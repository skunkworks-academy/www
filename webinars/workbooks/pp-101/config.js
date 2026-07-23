/*
 * PP-101 runtime configuration.
 *
 * GitHub Pages serves static files only. Set submissionEndpoint to a secure
 * HTTPS serverless/API endpoint that accepts the workbook JSON payload and
 * sends it to the Training Coordinator. Never place an email API secret here.
 */
window.PP101_CONFIG = Object.freeze({
  submissionEndpoint: 'https://formspree.io/f/xaqrdvzb',
  coordinatorEmail: 'training@skunkworksacademy.com',
  storageKey: 'skunkworks-pp-101-workbook-v2',
  maximumResponseCharacters: 4000
});

const pp101Logo = document.querySelector('.brand .logo');
if (pp101Logo) {
  const logoImage = document.createElement('img');
  logoImage.className = 'logo';
  logoImage.src = 'https://raw.githubusercontent.com/skunkworks-academy/www/refs/heads/main/images/favicon-black.png';
  logoImage.alt = 'Skunkworks Academy logo';
  logoImage.width = 42;
  logoImage.height = 42;
  logoImage.style.objectFit = 'contain';
  logoImage.style.padding = '5px';
  logoImage.style.background = '#ffffff';
  logoImage.style.borderRadius = '13px';
  pp101Logo.replaceWith(logoImage);
}
