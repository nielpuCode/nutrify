// components/ImagePredictor.js
"use client";
// components/ImagePredictor.js
import React, { useState } from 'react';
import { loadModel, predictSingleImage } from '../utils/model';

const ImagePredictor = ({ onPrediction }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setSelectedImage(file);
            setLoading(true);
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.onload = async () => {
                const model = await loadModel();
                const pred = await predictSingleImage(imgElement);
                setPrediction(pred);
                setLoading(false); 
                onPrediction(pred); 
                URL.revokeObjectURL(url);  
            };
        }
    };

    return (
        <div className="container mx-auto min-w-fit">
            <h1 className="text-2xl font-bold text-[#0D9276] mb-4">Let's Take Look Deeper!</h1>
            {/* <h1 className="text-2xl font-bold text-[#0D9276] mb-4">Upload an Image to Predict</h1> */}
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-[#40A2E3] file:text-white
                          hover:file:bg-[#0D9276]"
            />
            {imageURL && (
                <div className="mt-4">
                    <img src={imageURL} alt="Selected" className="max-w-[350px] h-[350px] mb-4"/>
                </div>
            )}
            {loading && (
                <div className="flex justify-center items-center mt-4">
                    <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                </div>
            )}
            {prediction && (
                <div className="mt-4">
                    <p className="text-lg font-medium text-[#0D9276]">Prediction: {prediction.label}</p>
                    <p className="text-lg font-medium text-[#0D9276]">Confidence: {prediction.confidence.toFixed(2)}%</p>
                </div>
            )}
        </div>
    );
};

export default ImagePredictor;
