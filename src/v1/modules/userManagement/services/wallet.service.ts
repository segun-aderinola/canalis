import { injectable } from "tsyringe";
import axios from "axios";
import logger from "@shared/utils/logger";
import WalletRepository from "../repositories/wallet.repository";
import { IUser } from "../model/user.model";
import AppError from "@shared/error/app.error";
import appConfig from "@config/app.config";

@injectable()
class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async createWallet(user: IUser) {
    try {
      let data = JSON.stringify({
        accountName: user.name,
        autoPayoutEnabled: true,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${appConfig.finance.base_url}/payments/virtual-accounts`,
        headers: {
          "Content-Type": "application/json",
				  "x-secret-key": appConfig.api_gateway.secret_key,
        },
        data: data,
      };

      try {

          const response = await axios.request(config);
          if (response.data.status) {
            const data = {
              userId: user.id,
              walletId: response.data.data.id,
              accountNumber: response.data.data.accountNumber,
          };
            await this.walletRepository.save(data);
          }
      } catch (error: any) {
        logger.error({ error: error.message }, "Error creating wallet");
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "Error creating wallet");
      throw new AppError(400, error.message ||
          "An unexpected error occurred while creating the user");
    }
  }

  async getWallet(userId: string) {
    const wallet = await this.walletRepository.findOne({ userId });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
      `${appConfig.finance.base_url}/payments/virtual-accounts/${wallet?.accountNumber}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(config);
      if (response.data.status) {
        return {
          accountNumber: response.data.data.accountNumber,
          status: response.data.data.status,
          accountName: response.data.data.accountName,
          autoPayoutEnabled: response.data.data.autoPayoutEnabled,
        };
      }
      return {
        accountNumber: "",
        status: "",
        accountName: "",
        autoPayoutEnabled: "",
      };
    } catch (error: any) {
      logger.error({ error: error.message }, "Error fetching wallet");
    }
  }
}

export default WalletService;
