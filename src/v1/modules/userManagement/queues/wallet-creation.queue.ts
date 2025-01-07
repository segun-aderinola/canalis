import Queue from 'bull';
import WalletService from '../services/wallet.service';
import logger from '@shared/utils/logger';
import { container } from 'tsyringe';
import appConfig from "@config/app.config";

const walletCreationQueue = new Queue('wallet-creation', {
  redis: {
    host: appConfig.redis.host,
    port: appConfig.redis.port
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
