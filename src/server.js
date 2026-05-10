import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
// 404
import { notFoundHandler } from './middleware/notFoundHandler.js';
// 500
import { errorHandler } from './middleware/errorHandler.js';
// routes
import notesRouter from './routes/notesRoutes.js';

// старт
const app = express();
const PORT = process.env.PORT || 3000;

// Mongo
await connectMongoDB();

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Роутc
app.use(notesRouter);

// middleware 404
app.use(notFoundHandler);
// error 500
app.use(errorHandler);

// взлітаємо
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
