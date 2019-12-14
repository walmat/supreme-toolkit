import mongoose from 'mongoose';

import { cart, checkout } from './us';
// import EU from './eu';
// import JP from './jp';
// import Pooky from './pooky';

export const connectDb = () => {
    return mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

const US = {
    cart,
    checkout,
};

export { US };