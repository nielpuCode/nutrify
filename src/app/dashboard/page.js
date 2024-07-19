// this is my src/app/page.js

"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const nutritionMetrics = [
    { name: 'Energy', unit: 'kcal', standard: 2000, key: 'energy (kcal)' },
    { name: 'Water', unit: 'g', standard: 3700, key: 'water (g)' },
    { name: 'Protein', unit: 'g', standard: 50, key: 'protein (g)' },
    { name: 'Total Fat', unit: 'g', standard: 70, key: 'total fat (g)' },
    { name: 'Carbohydrates', unit: 'g', standard: 300, key: 'carbohydrates (g)' },
    { name: 'Fiber', unit: 'g', standard: 30, key: 'fiber (g)' },
    { name: 'Sugars', unit: 'g', standard: 90, key: 'sugars (g)' },
    { name: 'Calcium', unit: 'mg', standard: 1000, key: 'calcium (mg)' },
    { name: 'Iron', unit: 'mg', standard: 18, key: 'iron (mg)' },
    { name: 'Magnesium', unit: 'mg', standard: 400, key: 'magnesium (mg)' },
    { name: 'Phosphorus', unit: 'mg', standard: 700, key: 'phosphorus (mg)' },
    { name: 'Potassium', unit: 'mg', standard: 4700, key: 'potassium (mg)' },
    { name: 'Sodium', unit: 'g', standard: 2.3, key: 'sodium (g)' },
    { name: 'Vitamin A', unit: 'IU', standard: 5000, key: 'vitamin A (IU)' },
    { name: 'Vitamin C', unit: 'mg', standard: 60, key: 'vitamin C (mg)' },
    { name: 'Vitamin B1', unit: 'mg', standard: 1.2, key: 'vitamin B1 (mg)' },
    { name: 'Vitamin B2', unit: 'mg', standard: 1.3, key: 'vitamin B2 (mg)' },
    { name: 'Vitamin B3', unit: 'mg', standard: 16, key: 'vitamin B3 (mg)' },
    { name: 'Vitamin B5', unit: 'mg', standard: 5, key: 'vitamin B5 (mg)' },
    { name: 'Vitamin B6', unit: 'mg', standard: 1.7, key: 'vitamin B6 (mg)' },
    { name: 'Vitamin E', unit: 'mg', standard: 15, key: 'vitamin E (mg)' }
];


const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

const getAccomplishmentMessage = (percentage) => {
    const messages = [
        { threshold: 90, messages: ["Amazing job!", "You're smashing it!", "Outstanding performance!"] },
        { threshold: 80, messages: ["Great work!", "You're doing fantastic!", "Keep it up, you're almost there!"] },
        { threshold: 70, messages: ["Good job!", "Nice progress!", "You're on the right track!"] },
        { threshold: 60, messages: ["You're doing well, keep going!", "Solid effort!", "Keep pushing!"] },
        { threshold: 50, messages: ["Halfway there, don't stop!", "You're getting there!", "Keep the momentum!"] },
    ];

    for (const level of messages) {
        if (percentage >= level.threshold) {
            return getRandomMessage(level.messages);
        }
    }
    return getRandomMessage(messages[messages.length - 1].messages);
};

const DashboardPage = () => {
    const { data: session, status } = useSession();
    const [nutritionData, setNutritionData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [dataFetched, setDataFetched] = useState(false); // New state variable to track if data has been fetched
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (session && session.user && session.user.email && !dataFetched) { // Check if data is already fetched
                try {
                    const response = await fetch(`/api/nutrition?userEmail=${encodeURIComponent(session.user.email)}`);
                    if (response.ok) {
                        const jsonData = await response.json();
                        if (jsonData.message === 'Nutrition data fetched successfully') {
                            const normalizedData = Object.keys(jsonData.data).reduce((acc, key) => {
                                acc[key] = parseFloat(jsonData.data[key]) || 0;
                                return acc;
                            }, {});
                            setNutritionData(normalizedData);
                        } else {
                            console.log('No data fetched or error occurred:', jsonData.message);
                        }
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Error fetching nutrition data:', error);
                }

                try {
                    const historyResponse = await fetch(`/api/historyNutrition?userEmail=${encodeURIComponent(session.user.email)}`);
                    if (historyResponse.ok) {
                        const historyJson = await historyResponse.json();
                        if (historyJson.message === 'Nutrition history fetched successfully') {
                            setHistoryData(historyJson.data.filter(dayData => {
                                const today = new Date().setHours(0, 0, 0, 0);
                                const dayDate = new Date(dayData.date).setHours(0, 0, 0, 0);
                                return dayDate < today; // Filter out today's data
                            }));
                        } else {
                            console.log('No history data fetched or error occurred:', historyJson.message);
                        }
                    } else {
                        throw new Error(`HTTP error! Status: ${historyResponse.status}`);
                    }
                } catch (error) {
                    console.error('Error fetching nutrition history:', error);
                }

                setDataFetched(true); 
            }
        };

        if (status === 'authenticated') {
            fetchData();
        }
    }, [session, status, dataFetched]); 
    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    // Calculate overall accomplishment for today's data
    const totalMetrics = nutritionMetrics.reduce((acc, metric) => {
        const value = nutritionData ? nutritionData[metric.key] : 0;
        acc.total += value;
        acc.standard += metric.standard;
        return acc;
    }, { total: 0, standard: 0 });

    const todayAccomplishment = ((totalMetrics.total / totalMetrics.standard) * 100).toFixed(2);
    const todayMessage = getAccomplishmentMessage(todayAccomplishment);

    return (
        <div className="w-full mx-auto my-10 p-6 bg-white rounded-md cursor-default">
            <h1 className="text-4xl font-bold mb-4 text-center text-purple-700">Nutrition Dashboard</h1>
            <p className="text-xl text-center text-purple-600 mb-8">{todayMessage}</p>
            
            <div className='w-full border-0 text-center'>
                <Link href="/llm_advice" className='bg-gradient-to-b from-purple-500 to-purple-300 rounded-full text-xl hover:text-2xl transition-all duration-200 ease-in-out w-fit px-3 py-1 my-5 mx-auto font-extrabold text-white'>Ask Something</Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-6 border-0 my-4">
                {nutritionMetrics.map((metric) => {
                    const value = nutritionData ? (nutritionData[metric.key] === 0 ? 0 : nutritionData[metric.key].toFixed(1)) : 0;
                    const standard = metric.standard || 100;
                    return (
                        <div key={metric.name} className="bg-gradient-to-b from-gray-100 to-purple-300 p-4 rounded-lg shadow-lg">
                            <div className="flex flex-col mb-1">
                                <span className="text-[15px] sm:text-xl text-center bg-purple-600/40 rounded-xl font-medium text-white truncate px-2">
                                    {metric.name} ({metric.unit})
                                </span>
                                <span className="text-sm sm:text-xl font-medium text-purple-600 rounded-full py-1 text-center">
                                    <span className='font-extrabold'>{value}</span>/{standard} {metric.unit}
                                </span>
                            </div>
                            <div className="w-full bg-white rounded-full h-4">
                                <div
                                    className="bg-green-500 h-4 rounded-full"
                                    style={{ width: `${Math.min((value / standard) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">Nutrition History</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {historyData.map((dayData) => {
                        const totalMetrics = nutritionMetrics.reduce((acc, metric) => {
                            const value = dayData[metric.key] || 0;
                            acc.total += value;
                            acc.standard += metric.standard;
                            return acc;
                        }, { total: 0, standard: 0 });

                        const accomplishment = ((totalMetrics.total / totalMetrics.standard) * 100).toFixed(2);
                        const message = getAccomplishmentMessage(accomplishment);

                        return (
                            <div key={dayData.date} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xl font-medium text-purple-600">
                                        {new Date(dayData.date).toLocaleDateString()}
                                    </span>
                                    <span className="text-xl font-medium text-purple-600">
                                        {accomplishment}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-300 rounded-full h-4">
                                    <div
                                        className="bg-purple-600 h-4 rounded-full"
                                        style={{ width: `${Math.min(accomplishment, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-purple-600">
                                    {message}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
