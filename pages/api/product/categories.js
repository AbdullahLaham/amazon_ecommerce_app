
import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import { isAuth } from '../../../utils/auth';
import config from '../../../utils/config';
import nc from 'next-connect';
import axios from 'axios';
const handler = nc();
handler.get(async (req, res) => {
    const categories = ['earphones', 'headphones'];
    res.send(categories);
});
export default handler;
