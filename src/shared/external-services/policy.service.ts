import axios from "axios";
import { IPolicy } from "src/v1/modules/policyManagement/model/policy.model";

const empleServiceBaseURL = process.env.EMPLE_SERVICE_BASE_URL;
const empleServiceAuthUsername = process.env.EMPLE_SERVICE_AUTH_USERNAME;
const empleServiceAuthPassword = process.env.EMPLE_SERVICE_AUTH_PASSWORD;
const policyServiceBaseURL = process.env.POLICY_SERVICE_BASE_URL;


export const authenticate = async () => {
    let data = JSON.stringify({
      email: empleServiceAuthUsername,
      password: empleServiceAuthPassword,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${empleServiceBaseURL}/v1/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    try {
      const response = await axios.request(config);
      const token = response.data.data.token.type + " "+response.data.data.token.accessToken;
      return token;
    } catch (error: any) {
      console.log(error)
    } 
  }

export const createPolicy = async (data: IPolicy) => {
    const getToken = await authenticate();
    console.log(getToken);
    
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${policyServiceBaseURL}/v1/policy/direct`,
      headers: {
        "Content-Type": "application/json",
        ...(getToken && { Authorization: getToken }),
      },
      data: JSON.stringify(data),
    };
    try {
      const response = await axios.request(config);
      return response.data.data;
    } catch (error: any) {
      console.log(error)
    } 
  }

  export const getAll = async () => {
    const getToken = await authenticate();
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${empleServiceBaseURL}/v1/policies`,
      headers: {
        "Content-Type": "application/json",
        ...(getToken && { Authorization: getToken }),
      },
    };

    const response = await axios.request(config);
    return response.data;
  }