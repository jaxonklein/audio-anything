import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Post the message to the CEO agent's Mattermost channel
    // 2. Wait for the CEO agent's response (via webhook or polling)
    // 3. Return the CEO's response
    //
    // For now, we'll simulate an intelligent CEO response based on common questions

    const lowerMessage = message.toLowerCase();
    let response = '';

    // Handle common questions
    if (lowerMessage.includes('premium') || lowerMessage.includes('upgrade')) {
      response = "Great question! Premium is $4.99/month with a 7-day free trial. You get 200 generations per month (vs 3/hour for free), 25k word limit (vs 5k), permanent audio storage, and priority support. Click 'Upgrade to Premium' in the navbar to get started!";
    } else if (lowerMessage.includes('podcast')) {
      response = "Absolutely! Audio Anything is perfect for podcasts. Just paste the URL of any article, blog post, or even PDF, and we'll convert it to natural-sounding podcast audio. You can choose from 4 different voices and adjust playback speed. Many users create daily podcast feeds from their reading lists!";
    } else if (lowerMessage.includes('voice')) {
      response = "We offer 4 high-quality podcast voices - 2 male and 2 female. Each has a warm, professional sound perfect for long-form content. You can preview and select them in the voice dropdown when generating audio. Premium users can also request additional voices!";
    } else if (lowerMessage.includes('limit') || lowerMessage.includes('rate')) {
      response = "Free users get 3 generations per hour, which is great for trying things out. If you need more, Premium gives you 200 generations per month with no hourly limits. Your counter resets every hour for free tier, or monthly for Premium.";
    } else if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
      response = "It's super simple! Just paste a URL into the input field and click 'Generate Audio'. We'll extract the article text, clean it up, and convert it to natural podcast-style audio using AI voices. You can then listen, adjust speed, and save it to your library if you're signed in.";
    } else if (lowerMessage.includes('device') || lowerMessage.includes('sync')) {
      response = "If you create a free account (just sign in with Google), your playback position syncs across all your devices! Start listening on your phone, continue on your laptop. Premium users also get permanent audio storage so your generated content never expires.";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      response = "Audio Anything is free to try with 3 generations per hour. If you love it, Premium is just $4.99/month with a 7-day free trial. You can cancel anytime - no hard feelings!";
    } else if (lowerMessage.includes('beta')) {
      response = "Welcome to our private beta! You're one of the first to try Audio Anything. We'd love your feedback - just reply here anytime. If you have friends who'd love this, you'll get a personal invite code once you create an account!";
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      response = "Hey there! 👋 I'm Maren, the CEO. I'm here to help with any questions about Audio Anything. What would you like to know?";
    } else if (lowerMessage.includes('thank')) {
      response = "You're so welcome! I'm here anytime you need help. Enjoy using Audio Anything! 😊";
    } else {
      // Generic helpful response
      response = "That's a great question! I want to make sure I give you the best answer. Could you tell me a bit more about what you're trying to do? Or feel free to ask about: upgrading to Premium, how the voices work, pricing, device sync, or anything else!";
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
