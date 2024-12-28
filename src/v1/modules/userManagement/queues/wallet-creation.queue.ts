import Queue from 'bull';
import WalletService from '../services/wallet.service';
import logger from '@shared/utils/logger';
import { container } from 'tsyringe';

const walletCreationQueue = new Queue('wallet-creation', {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || undefined,
  },
});

walletCreationQueue.process(async (job) => {
  const { user } = job.data;
  try {
    const walletService = container.resolve(WalletService);
    await walletService.createWallet(user);
    logger.info(`Wallet created successfully for user: ${user.email}`);
  } catch (error: any) {
    logger.error(
      { error: error.message, user },
      `Failed to create wallet for user: ${user.email}`
    );
    throw new Error(error.message);
  }
});

export default walletCreationQueue;
