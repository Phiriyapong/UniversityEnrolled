import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '~/trpc/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const news = await api.news.getAll();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
