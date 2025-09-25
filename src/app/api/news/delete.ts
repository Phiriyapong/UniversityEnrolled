import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '~/trpc/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      await api.news.delete(req.body);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete news' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
