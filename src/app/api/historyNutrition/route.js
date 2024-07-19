// // src/app/api/historyNutrition/route.js

// import connect from '../../../utils/db';
// import Nutrition from '../../../models/Nutrition';
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//     await connect();  // Ensure the database connection is established

//     try {
//         const url = new URL(request.url);
//         const userEmail = url.searchParams.get('userEmail');

//         // Check if userEmail parameter is provided
//         if (!userEmail) {
//             return new NextResponse(JSON.stringify({ message: 'User email is required' }), { status: 400 });
//         }

//         // Query the database for nutrition history
//         const nutritionHistory = await Nutrition.find({
//             userEmail: userEmail,
//             date: { $lt: new Date() } // Fetch all records before today
//         }).lean().sort({ date: -1 }); // Sort by date descending

//         // Handle case where no records are found
//         if (!nutritionHistory.length) {
//             return new NextResponse(JSON.stringify({ message: 'Nutrition history not found' }), { status: 404 });
//         }

//         // Return successful response with data
//         return new NextResponse(JSON.stringify({ message: 'Nutrition history fetched successfully', data: nutritionHistory }), { status: 200 });
//     } catch (error) {
//         console.error('Error fetching nutrition history:', error);
//         return new NextResponse(JSON.stringify({ message: 'Failed to fetch nutrition history', error: error.message }), { status: 500 });
//     }
// }
