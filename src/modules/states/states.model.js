import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const modelSchema = new Schema({
   country_id: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
   name: { type: String, required: true },
   code: { type: String },
   status: { type: String, default: '1' }
});

export default mongoose.model('State', modelSchema);