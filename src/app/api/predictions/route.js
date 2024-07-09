// This is my src/app/api/predictions/route.js

import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export async function POST(request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error(
        'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
      );
    }

    const { prompt } = await request.json();

    const options = {
      version: '8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e', // Correct version ID
      input: { prompt }
    };

    if (WEBHOOK_HOST) {
      options.webhook = `${WEBHOOK_HOST}/api/webhooks`;
      options.webhook_events_filter = ["start", "completed"];
    }

    const prediction = await replicate.predictions.create(options);

    if (prediction?.error) {
      console.error('Prediction error:', prediction.error);
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
