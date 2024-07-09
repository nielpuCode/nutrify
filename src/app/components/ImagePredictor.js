// src/app/components/ImagePredictor.js
"use client";
import React, { useState } from 'react';
import { loadModels, predictSingleImage } from '../../utils/model';

const ImagePredictor = ({ onPrediction, onTogglePrediction }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [alternativePrediction, setAlternativePrediction] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setSelectedImage(file);
            setLoading(true);
            setErrorMessage(''); 
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.onload = async () => {
                await loadModels(); // Ensure both models are loaded
                const { highest, prediction1, prediction2 } = await predictSingleImage(imgElement);
                setPrediction(highest);
                setAlternativePrediction(highest === prediction1 ? { prediction: prediction2, model: 'Model 2' } : { prediction: prediction1, model: 'Model 1' });
                setLoading(false);
                if (highest) {
                    onPrediction(highest);
                } else {
                    setErrorMessage('Could not recognize the image. Please try again with a different image.');
                }
                URL.revokeObjectURL(url);
            };
        }
    };

    const handleTogglePrediction = () => {
        const currentPrediction = prediction;
        const currentAlternative = alternativePrediction.prediction;
        const currentModel = alternativePrediction.model;

        setPrediction(currentAlternative);
        setAlternativePrediction({ prediction: currentPrediction, model: currentModel === 'Model 1' ? 'Model 2' : 'Model 1' });
        onTogglePrediction(currentAlternative);
    };

    return (
        <div className="container mx-auto min-w-fit">
            <h1 className="text-2xl font-bold text-purple-700 mb-4">Let's Take Look Deeper!</h1>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-purple-700 file:text-white
                          hover:file:bg-[#0D9276]"
            />
            {imageURL && (
                <div className="mt-4">
                    <img src={imageURL} alt="Selected" className="border-0 mx-auto max-w-[300px] max-h-[250px] md:max-w-[350px] md:h-[350px] mb-4"/>
                </div>
            )}
            {loading && (
                <div className="flex justify-center items-center mt-4">
                    <div className="loader border-t-4 border-purple-700 rounded-full w-8 h-8 animate-spin"></div>
                </div>
            )}
            {errorMessage && (
                <p className="text-lg font-medium text-red-500">{errorMessage}</p>
            )}
            {prediction && (
                <div className="mt-4">
                    <p className="text-lg font-medium text-purple-700">Prediction: {prediction.label}</p>
                    <p className="text-lg font-medium text-purple-700">Confidence: {prediction.confidence.toFixed(2)}%</p>
                    {alternativePrediction && alternativePrediction.prediction && (
                        <button 
                            onClick={handleTogglePrediction} 
                            className="mt-2 text-sm text-purple-500 underline"
                        >
                            Or it may be {alternativePrediction.prediction.label} from {alternativePrediction.model}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImagePredictor;
