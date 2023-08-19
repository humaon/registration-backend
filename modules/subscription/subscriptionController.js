import express from 'express';
import { nanoid } from 'nanoid';
import { signToken, verifyToken } from '../../utils/token.js';
import { createSubscription, getSubscription, updateSubscription } from './subscriptionService.js';

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.get('/subscribe', async (req, res) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(400).json({
      status: 'failed',
      message: 'Can not perform this operation',
    });
  }

  const decoded = await verifyToken(token, JWT_SECRET);
  const userId = decoded.id;
  const data = await getSubscription(userId);

  res.status(200).json({ status: 'success', data });
});

router.post('/subscribe', async (req, res) => {
  // data validation
  const { name, sectors, agreedToTerms } = req.body;
  if (
    name.trim() === '' ||
    !Array.isArray(sectors) ||
    sectors.length === 0 ||
    agreedToTerms === false
  ) {
    return res.status(400).json({
      status: 'failed',
      message: 'Bad request',
    });
  }

  const userId = nanoid();
  const data = {
    userId,
    name,
    sectors,
    agreedToTerms,
  };
  const savedData = await createSubscription(data);

  const token = signToken(userId, JWT_SECRET);
  res.status(200).json({ status: 'success', data: savedData, token });
});

router.put('/subscribe', async (req, res) => {
  // token validation
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(400).json({
      status: 'failed',
      message: 'Can not perform this operation',
    });
  }

  const decoded = await verifyToken(token, JWT_SECRET);
  const userId = decoded.id;

  // data validation
  const { name, sectors, agreedToTerms } = req.body;
  if (
    name.trim() === '' ||
    !Array.isArray(sectors) ||
    sectors.length === 0 ||
    agreedToTerms === false
  ) {
    return res.status(400).json({
      status: 'failed',
      message: 'Bad request',
    });
  }

  const data = {
    name,
    sectors,
    agreedToTerms,
  };
  const updatedData = await updateSubscription(userId, data);

  res.status(200).send({ status: 'success', data: updatedData });
});

export default router;
