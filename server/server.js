import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Service from './models/Service.js';
import serviceRoutes from './routes/serviceRoutes.js';
import { sampleServices } from './seed/services.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Do I Need To Go API is running.' });
});

app.use(serviceRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    message: 'Server error',
    error: err.message,
  });
});

async function ensureDemoServices() {
  const existingCount = await Service.countDocuments();

  if (existingCount > 0) {
    return;
  }

  await Service.insertMany(sampleServices);
  console.log('Inserted sample services into the connected database');
}

async function startServer() {
  try {
    await connectDB();
    await ensureDemoServices();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
