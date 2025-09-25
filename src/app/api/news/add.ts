import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '~/trpc/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newNews = await api.news.add(req.body);
      res.status(201).json(newNews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add news' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
