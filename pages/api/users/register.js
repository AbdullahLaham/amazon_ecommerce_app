import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import config from '../../../utils/config';
import { signToken } from '../../../utils/auth';

export default async function handler(req= NextApiRequest, res= NextApiResponse) {
    const projectId = config.projectId;
    const dataset = config.dataset;
    const tokenWithWriteAccess = process.env.ADMIN_USER_TOKEN; 
    if (req.method === 'POST') {
        const createMutaions = [
            {
                create: {
                    _type: 'user',
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password),
                    isAdmin: false,
        
                },
            },
        ];
        const existUser = await client.fetch(`*[_type == "user" && email == '${req.body.email}'][0]`); 
        if (existUser) {
            res.status(401).send({message: 'Email already exist'})
        }
        const {data} = await axios.post(`https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
        {mutations: createMutaions},
        {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${tokenWithWriteAccess}`
            }
        }
        );
        const userId = data.results[0].id;
        const user = {
            _id: userId,
            name: req.body.name,
            email: req.body.email,
            isAdmin: false,

        }
        const token = signToken(user);
        res.status(200).json({...user}, token)
    }
}