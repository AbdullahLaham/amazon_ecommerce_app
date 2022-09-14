
import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../../utils/client';
import { isAuth } from '../../../../utils/auth';
import config from '../../../../utils/config';
import nc from 'next-connect';
import axios from 'axios';
const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
    const {id} = req.query;
    const order = await client.fetch(`*[_type == "order" && _id == '${id}']`);
    res.status(200).json(order);
});
export default handler;
