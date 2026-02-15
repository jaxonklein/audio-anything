/**
 * Deployment Status Monitor
 *
 * This script checks whether the audio loop bug fix has been deployed to production.
 * Run this periodically (every 30 seconds) to monitor deployment progress.
 *
 * Usage:
 *   node DEPLOYMENT-MONITOR.js
 *
 * Output:
 *   - If fix is deployed: Shows "[AudioPlayer] Version 718a009 loaded"
 *   - If old code: Shows "Fix not yet deployed"
 */

const https = require('https');
const url = 'https://audio-anything-lac.vercel.app';

console.log(`\n🔍 Checking deployment status...`);
console.log(`Time: ${new Date().toLocaleString()}`);
console.log(`URL: ${url}\n`);

function checkDeployment() {
  https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      // Look for the diagnostic log in the HTML/JS
      if (data.includes('718a009')) {
        console.log('✅ FIX DETECTED: Version 718a009 is deployed!');
        console.log('Audio loop bug fix is now in production.');
        console.log('Next step: QA re-tests audio playback');
      } else if (data.includes('[AudioPlayer]')) {
        console.log('⏳ AudioPlayer component found but version is old');
        console.log('Waiting for deployment to complete...');
      } else {
        console.log('⏳ Fix not yet deployed');
        console.log('Auto-deployment may still be in progress');
        console.log('Check Vercel dashboard for build status');
      }

      console.log(`\nPage size: ${data.length} bytes`);
      console.log(`Last check: ${new Date().toLocaleTimeString()}`);
      console.log('Check again in 30 seconds...\n');
    });
  }).on('error', (err) => {
    console.error('Error fetching page:', err.message);
    console.log('Retrying in 30 seconds...\n');
  });
}

// Check immediately
checkDeployment();

// Check every 30 seconds
setInterval(checkDeployment, 30000);

console.log('Monitoring started. Press Ctrl+C to stop.');
