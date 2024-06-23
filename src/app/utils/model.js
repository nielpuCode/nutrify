// src/app/utils/model.js
import * as tf from '@tensorflow/tfjs';
import { csv } from 'd3-fetch';

let model;
let nutritionData;
const imgWidth = 180;
const imgHeight = 180;
const dataCat = ['Apple', 'Banana', 'Beetroot', 'Bell Pepper', 'Cabbage', 'Capsicum', 'Carrot', 'Cauliflower', 'Chilli Pepper', 'Corn', 'Cucumber', 'Eggplant', 'Garlic', 'Ginger', 'Grapes', 'Jalapeno', 'Kiwi', 'Lemon', 'Lettuce', 'Mango', 'Onion', 'Orange', 'Paprika', 'Pear', 'Peas', 'Pineapple', 'Pomegranate', 'Potato', 'Radish', 'Soy Beans', 'Spinach', 'Sweetcorn', 'Sweetpotato', 'Tomato', 'Turnip', 'Watermelon'];

async function loadNutritionData() {
    const csvUrl = '/fruitsnutrition.csv';
    const data = await csv(csvUrl);
    nutritionData = data.reduce((acc, curr) => {
        acc[curr.fruit] = curr;
        return acc;
    }, {});
}

export async function loadModel() {
    if (!model) {
        model = await tf.loadLayersModel('/tfjs_model/model.json');
        await loadNutritionData();
    }
    return model;
}

export async function predictSingleImage(imageElement) {
    const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([imgWidth, imgHeight])
        .toFloat()
        .expandDims();
    const predictions = await model.predict(tensor).data();
    const topPredictionIndex = Array.from(predictions).indexOf(Math.max(...predictions));
    const topPrediction = predictions[topPredictionIndex];
    const predictedFruit = dataCat[topPredictionIndex];
    
    // Check if the predicted fruit name is in the dataset
    if (nutritionData[predictedFruit]) {
        return { label: predictedFruit, confidence: topPrediction * 1, nutrition: nutritionData[predictedFruit] };
    } else {
        return null; // Return null if fruit name is not found
    }
}
