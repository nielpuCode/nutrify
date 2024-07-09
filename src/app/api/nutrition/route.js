// This is my src/app/api/nutrition/route.js

import connect from '../../../utils/db';
import Nutrition from '../../../models/Nutrition';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    console.log('Received data in API:', JSON.stringify(body, null, 2));

    const { userEmail, ...nutritionData } = body;

    try {
        await connect();

        console.log('NutritionData before processing:', JSON.stringify(nutritionData, null, 2));

        // Convert string values to numbers and filter the data
        const filteredData = {};
        Object.keys(nutritionData).forEach(key => {
            if (Nutrition.schema.paths[key]) {
                const value = nutritionData[key];
                filteredData[key] = isNaN(value) ? 0 : Number(value);
            }
        });

        console.log('Filtered Nutrition Data:', JSON.stringify(filteredData, null, 2));

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingNutrition = await Nutrition.findOne({
            userEmail: userEmail,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        let savedNutrition;

        if (existingNutrition) {
            // Update existing record by adding the current value with the new value
            Object.keys(filteredData).forEach(key => {
                existingNutrition[key] += filteredData[key];
            });
            savedNutrition = await existingNutrition.save();
            console.log('Updated Nutrition:', JSON.stringify(savedNutrition, null, 2));
        } else {
            // Create a new record
            savedNutrition = await Nutrition.create({ userEmail, ...filteredData });
            console.log('Saved Nutrition:', JSON.stringify(savedNutrition, null, 2));
        }

        return NextResponse.json({ message: 'Nutrition Added or Updated', data: savedNutrition }, { status: 201 });
    } catch (error) {
        console.error('Error adding nutrition to database:', error);
        return NextResponse.json({ message: 'Failed to add nutrition', error: error.message }, { status: 400 });
    }
}

export async function GET(request) {
    await connect();

    try {
        const url = new URL(request.url);
        const userEmail = url.searchParams.get('userEmail');
        if (!userEmail) {
            return new NextResponse(JSON.stringify({ message: 'User email is required' }), { status: 400 });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const nutrition = await Nutrition.findOne({
            userEmail: userEmail,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).lean();

        if (!nutrition) {
            return new NextResponse(JSON.stringify({ message: 'Nutrition data not found for today' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: 'Nutrition data fetched successfully', data: nutrition }), { status: 200 });
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        return new NextResponse(JSON.stringify({ message: 'Failed to fetch nutrition data', error: error.message }), { status: 500 });
    }
}
