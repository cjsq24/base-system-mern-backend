import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
   state_id: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
   name: { type: String, required: true },
   code: { type: String },
   status: { type: String, default: '1' }
});

export default mongoose.model('City', modelSchema);