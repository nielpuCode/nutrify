// This is my src/app/api/predictions/[id]/route.js

import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const prediction = await replicate.predictions.get(id);

    if (prediction?.error) {
      console.error('Prediction error:', prediction.error);
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
