import { loadStripe } from "@stripe/stripe-js";
let stripePromise;
export default function getStripe() {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

    }
    return stripePromise;
}