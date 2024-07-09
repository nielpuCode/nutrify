// src/app/page.js
'use client';
import React, { useState, useEffect } from 'react';
import ImagePredictor from './components/ImagePredictor';
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = {
    Energy: ['energy (kcal)'],
    Macronutrients: ['water (g)', 'protein (g)', 'total fat (g)', 'carbohydrates (g)', 'fiber (g)', 'sugars (g)'],
    Minerals: ['calcium (mg)', 'iron (mg)', 'magnesium (mg)', 'phosphorus (mg)', 'potassium (mg)', 'sodium (g)'],
    Vitamins: ['vitamin A (IU)', 'vitamin C (mg)', 'vitamin B1 (mg)', 'vitamin B2 (mg)', 'vitamin B3 (mg)', 'vitamin B5 (mg)', 'vitamin B6 (mg)', 'vitamin E (mg)'],
};

const Home = () => {
    const { data: session } = useSession();
    const [userEmail, setUserEmail] = useState('');
    const [nutritionResult, setNutritionResult] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleNutritionPrediction = (result) => {
        setNutritionResult(result);
    };

    const handleTogglePrediction = (result) => {
        setNutritionResult(result);
    };

    useEffect(() => {
        if (session?.user?.email) {
            setUserEmail(session.user.email);
        }
    }, [session]);

    const handleAddToDatabase = async (e) => {
        e.preventDefault();

        try {
            const multipliedNutrition = multiplyNutritionValues(nutritionResult.nutrition, quantity);
            const dataToSend = {
                userEmail,
                ...multipliedNutrition,
            };
    
            const res = await fetch('/api/nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await res.json();
            if (res.status === 201) {
                toast.success('Nutrition added to database successfully!');
                setNutritionResult(null);
            } else {
                toast.error('Failed to add nutrition to database.');
                console.error('Failed to add nutrition to database');
            }
        } catch (error) {
            toast.error('Error adding nutrition to database.');
            console.error('Error adding nutrition to database:', error);
        }
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const multiplyNutritionValues = (nutrition, multiplier) => {
        const multipliedNutrition = {};
        for (const key in nutrition) {
            if (!isNaN(nutrition[key])) {
                multipliedNutrition[key] = (nutrition[key] * multiplier).toFixed(2);
            } else {
                multipliedNutrition[key] = nutrition[key];
            }
        }
        return multipliedNutrition;
    };
    
    const displayedNutrition = nutritionResult ? multiplyNutritionValues(nutritionResult.nutrition, quantity) : {};

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
            <ToastContainer />
            <main className="flex flex-col justify-between container mx-auto px-4 py-8 w-full border-0 relative">
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-bold text-purple-700">Welcome to Nutrify</h1>
                    <p className="text-lg text-purple-700 mt-3">
                        Track your nutrition intake and stay healthy with our app!
                    </p>
                </div>

                <div className="flex flex-col md:flex-row w-full justify-around border-0 cursor-default space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 border-0">
                        <ImagePredictor onPrediction={handleNutritionPrediction} onTogglePrediction={handleTogglePrediction} />
                        {nutritionResult && (
                            <button onClick={handleAddToDatabase} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">
                                Add to Database
                            </button>
                        )}
                    </div>
                    {nutritionResult && Object.keys(displayedNutrition).length > 0 && (
                        <div className="border-0 w-full flex flex-col p-4">
                            <div className="border-0 w-full p-2 mb-4 bg-white rounded-lg shadow-lg text-center">
                                <h3 className="text-lg font-semibold rounded-lg mb-2 bg-purple-700 text-white">Energy</h3>
                                {categories.Energy.map((key) => (
                                    <div key={key} className="text-purple-700">
                                        <span className="font-bold">{key}:</span>{' '}
                                        <span className={displayedNutrition[key] === '-' ? 'text-red-500' : ''}>
                                            {displayedNutrition[key] ?? '-'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-row justify-center gap-x-2 flex-wrap sm:flex-nowrap border-0">
                                {['Macronutrients', 'Minerals', 'Vitamins'].map((category) => (
                                    <div key={category} className="border-0 w-full p-2 bg-white rounded-lg shadow-lg">
                                        <h3 className="text-lg text-center font-semibold rounded-lg mb-2 bg-purple-700 text-white">{category}</h3>
                                        {categories[category].map((key) => (
                                            <div key={key} className="text-purple-700">
                                                <span className="font-bold">{key}:</span>{' '}
                                                <span className={displayedNutrition[key] === '-' ? 'text-red-500' : ''}>
                                                    {displayedNutrition[key] ?? '-'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className="max-[639px]:fixed max-[639px]:bottom-0 max-[639px]:left-0 max-[639px]:right-0 px-5 py-3 sm:block sm:mt-4 sm:w-full max-[639px]:bg-white sm:rounded-xl">
                                <label className="block mb-2 text-lg font-semibold text-gray-700 text-center">Quantity</label>
                                <input type="range" min="1" max="20" value={quantity} onChange={handleQuantityChange} className="slider w-[100%] mx-auto sm:w-full"/>
                                <div className="text-center mt-2 text-lg text-gray-800">Selected Quantity: {quantity}</div>
                            </div>
                        </div>
                    )}
                    {nutritionResult && Object.keys(displayedNutrition).length === 0 && (
                        <p className="text-lg font-medium text-purple-700">No nutrition info available</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
