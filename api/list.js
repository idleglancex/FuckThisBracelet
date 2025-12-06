import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const sourceDir = path.join(process.cwd(), 'source');

        if (!fs.existsSync(sourceDir)) {
            // If source folder doesn't exist (unlikely if tracked in git), return empty
            return res.status(200).json([]);
        }

        const files = fs.readdirSync(sourceDir);

        // Filter for 3D model files strictly
        const charms = files.filter(file => {
            if (file.startsWith('.')) return false; // Ignore hidden files like .DS_Store
            if (file.includes('undefined')) return false; // Safety check
            const ext = path.extname(file).toLowerCase();
            return ['.glb', '.gltf', '.obj', '.fbx'].includes(ext);
        }).map(file => `/source/${file}`);

        res.status(200).json(charms);
    } catch (error) {
        console.error('List Error:', error);
        res.status(500).json({ error: 'Failed to list charms' });
    }
}
