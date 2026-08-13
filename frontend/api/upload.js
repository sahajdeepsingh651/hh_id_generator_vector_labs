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
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', blob, 'image.png');

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      return res.status(response.status).send('Upload failed');
    }

    const url = await response.text();
    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
