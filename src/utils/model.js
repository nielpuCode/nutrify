// src/app/utils/model.js
import * as tf from '@tensorflow/tfjs';
import { csv } from 'd3-fetch';

let model1;
let model2;
let nutritionData;
const imgWidth = 180;
const imgHeight = 180;
const dataCat = ['Apple', 'Banana', 'Beetroot', 'Bell Pepper', 'Cabbage', 'Capsicum', 'Carrot', 'Cauliflower', 'Chilli Pepper', 'Corn', 'Cucumber', 'Eggplant', 'Garlic', 'Ginger', 'Grapes', 'Jalapeno', 'Kiwi', 'Lemon', 'Lettuce', 'Mango', 'Onion', 'Orange', 'Paprika', 'Pear', 'Peas', 'Pineapple', 'Pomegranate', 'Potato', 'Radish', 'Soy Beans', 'Spinach', 'Sweetcorn', 'Sweetpotato', 'Tomato', 'Turnip', 'Watermelon', 'Durian', 'Strawberry', 'Watermelon'];

async function loadNutritionData() {
    const csvUrl = '/fruitsnutrition.csv';
    const data = await csv(csvUrl);
    nutritionData = data.reduce((acc, curr) => {
        acc[curr.fruit] = curr;
        return acc;
    }, {});
}

export async function loadModels() {
    if (!model1) {
        model1 = await tf.loadLayersModel('/tfjs_model/model.json');
    }
    if (!model2) {
        model2 = await tf.loadLayersModel('/tfjs_model_MobileNetV2/model.json');
    }
    await loadNutritionData();
}

async function predictWithModel(model, imageElement) {
    const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([imgWidth, imgHeight])
        .toFloat()
        .expandDims();
    const predictions = await model.predict(tensor).data();
    const topPredictionIndex = Array.from(predictions).indexOf(Math.max(...predictions));
    const topPrediction = predictions[topPredictionIndex];
    const predictedFruit = dataCat[topPredictionIndex];
    
    if (nutritionData[predictedFruit]) {
        return { label: predictedFruit, confidence: topPrediction, nutrition: nutritionData[predictedFruit] };
    } else {
        return null;
    }
}

export async function predictSingleImage(imageElement) {
    await loadModels();
    
    const prediction1 = await predictWithModel(model1, imageElement);
    const prediction2 = await predictWithModel(model2, imageElement);
    
    if (!prediction1 && !prediction2) {
        return null; // Return null if both models fail to detect
    }

    return { 
        prediction1, 
        prediction2,
        highest: prediction1 && prediction2 ? (prediction1.confidence > prediction2.confidence ? prediction1 : prediction2) : (prediction1 || prediction2)
    };
}
