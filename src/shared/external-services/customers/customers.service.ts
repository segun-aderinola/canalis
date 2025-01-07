import { AxiosInstance } from "axios";
import { ICustomerServiceActions } from "./customers.interface";
import { ICustomerResponse, IOnboardCustomerPayload, IOnboardCustomerRes } from "./customers.types";
import HTTPClient from "@shared/http-client/http-client";
import appConfig from "@config/app.config";
import logger from "@shared/utils/logger";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import httpStatus from "http-status";
import AppError from "@shared/error/app.error";

export class CustomerService implements ICustomerServiceActions {
	private static instance: CustomerService;
	private httpClient: AxiosInstance;

	private constructor() {
		this.httpClient = HTTPClient.create({
			baseURL: appConfig.customer.base_url
		});
	}

	async onboardCustomer(
		payload: IOnboardCustomerPayload
	): Promise<IOnboardCustomerRes> {
		const url = `/individual`;
		const response = await this.httpClient
			.post<ICustomerResponse<IOnboardCustomerRes>>(url, payload)
			.catch((e) => {
				return this.errorHandler(e, payload, "onboardCustomer");
			});
		this.requestResponseLogger(payload, response, url);
		return response.data.data;
	}

	private errorHandler = (e: any, payload, action) => {
		const errorMessage =
			e?.message || "An unexpected error occurred. Please try again";
		if (e?.response?.status && e?.response?.data?.message) {
			logger.error(
				{ e, payload },
				`CustomerServicerviceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(e.response.status, e.response.data.message);
		} else {
			logger.error(
				{ e, payload },
				`CustomerServicerviceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(
				httpStatus.SERVICE_UNAVAILABLE,
				`Error: ${errorMessage}`
			);
		}
	};

	private requestResponseLogger = (
		request: ObjectLiteral | undefined,
		response: ObjectLiteral,
		url: string
	) => {
		logger.info({ request, response }, `CustomerService: ${url}`);
	};

	public static getInstance(): CustomerService {
		if (!CustomerService.instance) {
			CustomerService.instance = new CustomerService();
		}
		return CustomerService.instance;
	}
}