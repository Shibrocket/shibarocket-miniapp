import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Example stats you can replace with actual data from Firebase or your database
            const stats = {
                users: 1200,
                activeUsers: 850,
                earnings: 15000
            };
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch stats' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
