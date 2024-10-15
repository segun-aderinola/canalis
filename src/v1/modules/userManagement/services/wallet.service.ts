import logger from "@shared/utils/logger";
import { injectable } from "tsyringe";
import { CreateWallet } from "../dtos/create-wallet.dto";
import WalletFactory from "../factories/wallet.factory";
import WalletRepo from "../repositories/wallet.repo";
import { IWallet } from "../model/wallet.model";

@injectable()
class WalletService {
  constructor(private readonly walletRepo: WalletRepo) {}

  async createWallet(data: CreateWallet) {
    const wallet = WalletFactory.createWallet(data);

    return await this.walletRepo
      .save(wallet)
      .catch((error) => this.handleWalletCreationError(wallet, error));
  }

  async getAll() {
    return await this.walletRepo.getAll();
  }

  private handleWalletCreationError = (wallet: IWallet, error: any) => {
    logger.error(
      { error, wallet },
      "WalletService[handleUserCreationError]: Error occured creating wallets."
    );
  };
}

export default WalletService;
