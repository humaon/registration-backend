import { prisma } from '../../utils/db.js';

export const createSubscription = async (data) => {
  return await prisma.subscription.create({ data });
};

export const updateSubscription = async (userId, data) => {
  return await prisma.subscription.update({ where: { userId }, data });
};

export const getSubscription = async (userId) => {
  return await prisma.subscription.findUnique({ where: { userId } });
};
