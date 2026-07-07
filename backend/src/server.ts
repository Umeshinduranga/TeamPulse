
import { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();

const port = Number(process.env.PORT ?? 5000);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
