import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sourceDir = path.join(process.cwd(), 'source');

        // Ensure source directory exists
        if (!fs.existsSync(sourceDir)) {
            fs.mkdirSync(sourceDir, { recursive: true });
        }

        // We expect the file content in the body and a filename in headers or query
        const filename = req.query.filename || `model_${Date.now()}.glb`;
        const filePath = path.join(sourceDir, filename);

        // In a real Vercel environment with body parsing enabled (default), 
        // req.body might be a buffer if configured, or we might need to stream.
        // For simplicity in this local simulation, we assume req.body is the buffer or string.
        // However, standard Vercel functions parse JSON by default. 
        // For binary upload, it's better to use a stream or raw body.
        // Here we will try to write req.body directly.

        // Note: In some setups, you might need to disable body parsing config for the route
        // to receive raw buffer. For now, let's assume standard Buffer handling.

        const buffer = Buffer.from(req.body);

        fs.writeFileSync(filePath, buffer);

        res.status(200).json({ success: true, filename: filename });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
}
