'use client';
// src/app/pages.js
import React, { useState } from 'react';
import Link from 'next/link';
import ImagePredictor from './components/ImagePredictor';

const categories = {
    Energy: ['energy (kcal/kJ)'],
    Macronutrients: ['water (g)', 'protein (g)', 'total fat (g)', 'carbohydrates (g)', 'fiber (g)', 'sugars (g)'],
    Minerals: ['calcium (mg)', 'iron (mg)', 'magnesium (mg)', 'phosphorus (mg)', 'potassium (mg)', 'sodium (g)'],
    Vitamins: ['vitamin A (IU)', 'vitamin C (mg)', 'vitamin B1 (mg)', 'vitamin B2 (mg)', 'vitamin B3 (mg)', 'vitamin B5 (mg)', 'vitamin B6 (mg)', 'vitamin E (mg)'],
};

export default function Home() {
    const [nutritionResult, setNutritionResult] = useState(null);

    const handleNutritionPrediction = (result) => {
        setNutritionResult(result);
    };

    return (
        <div className="min-h-screen bg-[#FFF6E9] flex flex-col">
            <nav className="bg-[#0D9276] shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-[#FFF6E9]">
                        <Link href="/">Nutrify</Link>
                    </div>
                    <div className="space-x-4 font-bold">
                        <Link href="/login" className="text-[#FFF6E9] hover:text-[#40A2E3] transition">Login</Link>
                        <Link href="/register" className="text-[#FFF6E9] hover:text-[#40A2E3] transition">Register</Link>
                    </div>
                </div>
            </nav>

            <main className="flex flex-col justify-between container mx-auto px-1 py-8 w-full border-0">
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-bold text-[#0D9276]">Welcome to Nutrify</h1>
                    <p className="text-lg text-[#0D9276]">
                        Track your nutrition intake and stay healthy with our app!
                    </p>
                </div>

                <div className="flex flex-row w-full justify-around border-0 cursor-default">
                    <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
                        <ImagePredictor onPrediction={handleNutritionPrediction} />
                    </div>
                    {nutritionResult && Object.keys(nutritionResult.nutrition).length > 0 && (
                        <div className="border-0 w-full flex flex-col p-4">
                            <div className="border-0 w-full p-2 mb-4 bg-white rounded-lg shadow-lg text-center">
                                <h3 className="text-lg font-semibold rounded-lg mb-2 bg-[#0D9276] text-white">Energy</h3>
                                {categories.Energy.map((key) => (
                                    <div key={key} className="text-[#0D9276]">
                                        <span className="font-bold">{key}:</span>{' '}
                                        <span className={nutritionResult.nutrition[key] === '-' ? 'text-red-500' : ''}>
                                            {nutritionResult.nutrition[key] ?? '-'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-row justify-center gap-x-2">
                                {['Macronutrients', 'Minerals', 'Vitamins'].map((category) => (
                                    <div key={category} className="border-0 w-full p-2 bg-white rounded-lg shadow-lg">
                                        <h3 className="text-lg text-center font-semibold rounded-lg mb-2 bg-[#0D9276] text-white">{category}</h3>
                                        {categories[category].map((key) => (
                                            <div key={key} className="text-[#0D9276]">
                                                <span className="font-bold">{key}:</span>{' '}
                                                <span className={nutritionResult.nutrition[key] === '-' ? 'text-red-500' : ''}>
                                                    {nutritionResult.nutrition[key] ?? '-'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {nutritionResult && Object.keys(nutritionResult.nutrition).length === 0 && (
                        <p className="text-lg font-medium text-[#0D9276]">No nutrition info available</p>
                    )}
                </div>

            </main>
        </div>
    );
}
