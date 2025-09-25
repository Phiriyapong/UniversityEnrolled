import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '~/trpc/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const updatedNews = await api.news.edit(req.body);
      res.status(200).json(updatedNews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to edit news' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
