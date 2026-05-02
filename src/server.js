// env
import 'dotenv/config';

// cors
import cors from 'cors';

// express
import express from 'express';

// pino
import pino from 'pino-http';

// express & port
const app = express();
const PORT = process.env.PORT || 3000;

// our PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// pino
app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// notes
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// dynamic notes
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// test error
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// middleware 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// error 500
app.use((err, req, res, next) => {
  console.log(err.message);

  res.status(500).json({
    message: 'Server error',
    error: err.message,
  });
});
