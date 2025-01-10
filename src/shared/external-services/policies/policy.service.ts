import appConfig from "@config/app.config";
import axios from "axios";
import { IPolicy } from "src/v1/modules/policyManagement/model/policy.model";

export const createPolicy = async (data: IPolicy) => {    
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${appConfig.api_gateway.base_url}/v1/general/policies/direct`,
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": appConfig.api_gateway.secret_key,
      },
      data: JSON.stringify(data),
    }
    try {
      const response = await axios.request(config);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    } 
  }

  export const getAll = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${appConfig.api_gateway.base_url}/v1/general/policies`,
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": appConfig.api_gateway.secret_key,
      },
    };

    const response = await axios.request(config);
    return response.data;
  }