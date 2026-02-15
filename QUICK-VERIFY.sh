#!/bin/bash
# Quick verification script — run this to check if deployment is complete

echo "🔍 Quick Deployment Status Check"
echo "================================="
echo "Time: $(date)"
echo ""

# Method 1: Check if diagnostic log is in the page HTML
echo "Checking production for diagnostic log..."
curl -s https://audio-anything-lac.vercel.app 2>/dev/null | grep -q "718a009"

if [ $? -eq 0 ]; then
    echo "✅ SUCCESS: Fix is deployed!"
    echo ""
    echo "Next steps:"
    echo "1. Refresh https://audio-anything-lac.vercel.app (Ctrl+Shift+R)"
    echo "2. Open DevTools (F12) → Console"
    echo "3. Look for: [AudioPlayer] Version 718a009 loaded"
    echo "4. If present: Tell QA to re-test"
    echo ""
else
    echo "⏳ Fix not yet deployed (or still building)"
    echo "Try again in 30 seconds..."
    echo ""
    echo "Or manually check:"
    echo "1. Go to https://audio-anything-lac.vercel.app"
    echo "2. Press F12 → Console"
    echo "3. Look for: [AudioPlayer] Version 718a009 loaded"
    echo ""
fi

echo "Last check: $(date)"
