import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
   name: { type: String, required: true },
   url: { type: String, required: true },
   status: { type: String, default: '1' }
}, { timestamps: true });

export default mongoose.model('Menu', modelSchema);