import mongoose from 'mongoose';

const useSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true,
  },
});

export const cart = mongoose.model('carts', useSchema);
export const checkout = mongoose.model('checkouts', useSchema);