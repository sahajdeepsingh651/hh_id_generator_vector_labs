export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).send('No image');

    // Remove the data:image/png;base64, prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const blob = new Blob([buffer], { type: 'image/png' });
    
    const form = new FormData();
    form.append('files[]', blob, 'image.png');

    const response = await fetch('https://uguu.se/upload.php', {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      return res.status(response.status).send('Upload failed');
    }

    const json = await response.json();
    if (!json.success || !json.files || !json.files[0].url) {
      return res.status(500).send('Invalid response from uguu');
    }

    return res.status(200).json({ url: json.files[0].url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
