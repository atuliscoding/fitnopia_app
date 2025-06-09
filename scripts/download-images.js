import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    filename: 'signin-background.jpg',
    description: 'Woman in gym working out with weights',
  },
  {
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    filename: 'signup-background.jpg',
    description: 'Man doing workout in modern gym',
  },
  {
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
    filename: 'hero-background.jpg',
    description: 'Modern gym equipment',
  },
  {
    url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff',
    filename: 'workout-card-1.jpg',
    description: 'Woman doing yoga',
  },
  {
    url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
    filename: 'workout-card-2.jpg',
    description: 'Man lifting weights',
  },
  {
    url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2',
    filename: 'workout-card-3.jpg',
    description: 'People in a fitness class',
  },
  {
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
    filename: 'dashboard-background.jpg',
    description: 'Modern gym interior',
  },
  {
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155',
    filename: 'profile-background.jpg',
    description: 'Person measuring waist',
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../public/images', filename);
    
    // Create the images directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(filepath);

    https.get(`${url}?w=1920&q=85&fit=crop`, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {
        reject(err);
      });
    });
  });
};

const downloadAllImages = async () => {
  try {
    console.log('Starting image downloads...');
    await Promise.all(images.map(img => downloadImage(img.url, img.filename)));
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
};

downloadAllImages(); 