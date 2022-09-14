
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
        const user = await client.fetch(`*[_type == "user" && email == '${req.body.email}'][0]`);
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = signToken({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
            });
            res.send({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              token,
            });
            
          } else {
            res.status(401).send({ message: 'Invalid email or password' });
          }
        
    }
}