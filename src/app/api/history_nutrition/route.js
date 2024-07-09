// src/app/api/history_nutrition/route.js

import connect from '../../../utils/db';
import Nutrition from '../../../models/Nutrition';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await connect();

    try {
        const url = new URL(request.url);
        const userEmail = url.searchParams.get('userEmail');
        if (!userEmail) {
            return new NextResponse(JSON.stringify({ message: 'User email is required' }), { status: 400 });
        }

        const nutritionHistory = await Nutrition.find({
            userEmail: userEmail,
            date: {
                $lt: new Date() // Fetch all records before today
            }
        }).lean().sort({ date: -1 }); // Sort by date descending

        if (!nutritionHistory.length) {
            return new NextResponse(JSON.stringify({ message: 'Nutrition history not found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: 'Nutrition history fetched successfully', data: nutritionHistory }), { status: 200 });
    } catch (error) {
        console.error('Error fetching nutrition history:', error);
        return new NextResponse(JSON.stringify({ message: 'Failed to fetch nutrition history', error: error.message }), { status: 500 });
    }
}
