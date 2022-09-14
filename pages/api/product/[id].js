import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
export default async function handler(req= NextApiRequest, res= NextApiResponse) {
  if (req.method === 'GET') {
    const {id} = req.query;
    const product = await client.fetch(`*[_type == 'product' && _id == '${id}']`);
    res.status(200).json(product.data)
    // res.sendData(product);
  }
}