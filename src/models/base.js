import mongoose from 'mongoose';

const usaSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true,
  },
});

export default name => mongoose.model(name, usaSchema);