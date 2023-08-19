import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import 'express-async-errors';
import subscriptionRouter from './modules/subscription/subscriptionController.js';

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors());

app.get('/api/healthz', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
app.use('/api', subscriptionRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
