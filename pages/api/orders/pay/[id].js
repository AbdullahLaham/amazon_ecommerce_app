import axios from 'axios';
import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import config from '../../../../utils/config';

const handler = nc();

handler.use(isAuth);
handler.post(async (req, res) => {
  const tokenWithWriteAccess = 'skEAloPNTcA6TAiIdFkI5vnCLmAfkNBf6waWx3t5fOtZnKMfVrGPXfQ2EkGYUV4ltI5Y6SSkx0FoYRgwAcbBENbyBXM3XDVUZZiOtyXPqBcU4c7OoLkY67ZohI5UA7t8EsdQ2i42L9N6bWBShAd4GNTtHDLSXs4qzsWGrVH3WTxDWjoEHSiL';
  await axios.post(
    `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
    {
      mutations: [
        {
          patch: {
            id: req.query.id,
            set: {
              isPaid: true,
              paidAt: new Date().toISOString(),
            },
          },
        },
      ],
    },
    {
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );

  res.send({ message: 'order paid' });
});

export default handler;