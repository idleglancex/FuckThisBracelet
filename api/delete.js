import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { filename } = req.query;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    // Basic security check to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    try {
        const filePath = path.join(process.cwd(), 'source', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlinkSync(filePath);

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ error: 'Delete failed: ' + error.message });
    }
}
