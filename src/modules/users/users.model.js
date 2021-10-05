import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
   name: { type: String, required: true },
   last_name: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   last_login: { type: Date },
   status: { type: String, default: '1' }
});

export default mongoose.model('User', schema);