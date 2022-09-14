import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import { isAuth } from '../../../utils/auth';
import config from '../../../utils/config';
import nc from 'next-connect';
import axios from 'axios';

const stripe = new Stripe('sk_test_51LMHmvAw2oupCOB0zk8Vvq55pNjq7zCcLni6sE61D2Q1G6AETsyBUJ1WcKWl8dsBwH4Qv2dcGyWxu8CKd9ljUZzn00dfBc0csB');
const handler = nc();
handler.use(isAuth);
handler.post(async (req, res) => {
  console.log(req.body)
  try {
    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_options: [
        { shipping_rate: 'shr_1LSfIkAw2oupCOB0nKJFpJI1' },
        { shipping_rate: 'shr_1LSfHHAw2oupCOB0Q5SBp3Uv' },
      ],
      line_items: req.body.orderItems.map((item) => {
        const img = item.image;
        const newImage = img.replace('image-', 'https://cdn.sanity.io/images/vfxfwnaw/production/').replace('-webp', '.webp');

        return {
          price_data: { 
            currency: 'usd',
            product_data: { 
              name: item.name,
              images: [newImage],
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled:true,
            minimum: 1,
          },
          quantity: item.quantity
        }
      }),
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/canceled`,
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create(params);

    res.status(200).json(session);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
}  

    
);
handler.get(async (req,res) => {
  
  res.setHeader('Allow', 'POST');
  res.status(405).end('Method Not Allowed');

});
export default handler;





