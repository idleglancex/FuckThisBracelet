// api/proxy.js
export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Missing URL parameter');
    }

    try {
        // Fetch the external resource (Meshy GLB)
        const response = await fetch(decodeURIComponent(url));

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        // Get the file data as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Set CORS headers so your frontend can read it
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        
        // Forward the Content-Type (important for 3D loaders)
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        // Send the file back to your frontend
        res.send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching resource');
    }
}