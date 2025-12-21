import Stripe from 'stripe';
import fs from 'fs';


const rawData = fs.readFileSync('stripeKey.json');
const { stripeSecretKey } = JSON.parse(rawData);

const stripe = new Stripe(stripeSecretKey);

export default stripe;