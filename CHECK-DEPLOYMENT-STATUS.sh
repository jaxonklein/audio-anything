#!/bin/bash
# Quick script to check if the Vercel deployment has completed
# Run every 30 seconds to monitor deployment progress

echo "🔍 Checking Vercel deployment status..."
echo "URL: https://audio-anything-lac.vercel.app"
echo ""

# Fetch page and extract console logs
echo "Fetching production page..."

# Use curl to get the HTML and look for our diagnostic marker
curl -s https://audio-anything-lac.vercel.app | grep -i "version.*718a009" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ FIX DETECTED: Version 718a009 code is deployed!"
    echo "The audio loop bug fix is now in production."
else
    echo "⏳ Fix not yet deployed - checking for old code markers..."

    # Try to get more diagnostic info via JavaScript evaluation
    echo ""
    echo "For detailed console inspection, open browser DevTools:"
    echo "1. Go to https://audio-anything-lac.vercel.app"
    echo "2. Press F12 to open DevTools"
    echo "3. Go to Console tab"
    echo "4. Look for message: [AudioPlayer] Version 718a009 loaded - fix deployed"
    echo ""
    echo "If you see this message: ✅ FIX IS DEPLOYED"
    echo "If you don't see this message: ⏳ Still waiting for deployment"
fi

echo ""
echo "Last check: $(date)"
