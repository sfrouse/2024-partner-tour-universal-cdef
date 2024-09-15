import fs from 'fs';

export default function getLastUploadedImage() {
    const imagePath = './uploads/lastUpload.png';
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return base64Image;
}