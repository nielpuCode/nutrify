// This is my src/models/Nutrition.js
import mongoose from 'mongoose';

const NutritionSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    'energy (kcal)': { type: Number, default: 0 },
    'water (g)': { type: Number, default: 0 },
    'protein (g)': { type: Number, default: 0 },
    'total fat (g)': { type: Number, default: 0 },
    'carbohydrates (g)': { type: Number, default: 0 },
    'fiber (g)': { type: Number, default: 0 },
    'sugars (g)': { type: Number, default: 0 },
    'calcium (mg)': { type: Number, default: 0 },
    'iron (mg)': { type: Number, default: 0 },
    'magnesium (mg)': { type: Number, default: 0 },
    'phosphorus (mg)': { type: Number, default: 0 },
    'potassium (mg)': { type: Number, default: 0 },
    'sodium (g)': { type: Number, default: 0 },
    'vitamin A (IU)': { type: Number, default: 0 },
    'vitamin C (mg)': { type: Number, default: 0 },
    'vitamin B1 (mg)': { type: Number, default: 0 },
    'vitamin B2 (mg)': { type: Number, default: 0 },
    'vitamin B3 (mg)': { type: Number, default: 0 },
    'vitamin B5 (mg)': { type: Number, default: 0 },
    'vitamin B6 (mg)': { type: Number, default: 0 },
    'vitamin E (mg)': { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Nutrition = mongoose.models.Nutrition || mongoose.model('Nutrition', NutritionSchema);

export default Nutrition;