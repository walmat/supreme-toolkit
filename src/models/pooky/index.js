import mongoose from 'mongoose';

const usaSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  tohru: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  }
});

export default mongoose.model(`Pooky`, usaSchema);