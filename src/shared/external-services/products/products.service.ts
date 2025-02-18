import { AxiosInstance } from "axios";
import { IProductServiceActions } from "./products.interface";
import {
	IProductsRes,
	IProductResponse,
	ISingleProductRes,
	IProductPayload,
} from "./products.types";
import HTTPClient from "@shared/http-client/http-client";
import appConfig from "@config/app.config";
import logger from "@shared/utils/logger";
import { ObjectLiteral } from "@shared/types/object-literal.type";
import httpStatus from "http-status";
import AppError from "@shared/error/app.error";

export class ProductService implements IProductServiceActions {
	private static instance: ProductService;
	private httpClient: AxiosInstance;
	private url: string;

	private constructor() {
		this.httpClient = HTTPClient.create({
			baseURL: appConfig.api_gateway.base_url,
			headers: {
				"x-secret-key": appConfig.api_gateway.secret_key,
			},
		});
		this.url = "general/products";
	}

	async getProducts(query: IProductPayload): Promise<IProductsRes[]> {
		const path = `/${this.url}?page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
		const accessToken = query.accessToken;
		const response = await this.httpClient
			.get<IProductResponse<IProductsRes[]>>(path, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.catch((e) => {
				return this.errorHandler(e, null, "getProducts");
			});
		this.requestResponseLogger(undefined, response, path);
		return response.data.data;
	}

	async getProductById(id: string, accessToken: string): Promise<ISingleProductRes> {
		const path = `/${this.url}/${id}`;
		const response = await this.httpClient
			.get<IProductResponse<ISingleProductRes>>(path, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.catch((e) => {
				return this.errorHandler(e, null, "getProductById");
			});
		this.requestResponseLogger({ id }, response, path);
		return response.data.data;
	}

	private errorHandler = (e: any, payload, action) => {
		const errorMessage =
			e?.message || "An unexpected error occurred. Please try again";
		if (e?.response?.status && e?.response?.data?.message) {
			logger.error(
				{ e, payload },
				`ProductServiceErrorHandler[${action}]: ${errorMessage}`
			);
			throw new AppError(e.response.status, e.response.data.message);
		} else {
			logger.error(
				{ e, payload },
				`ProductServiceErrorHandler[${action}]: ${errorMessage}`
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
		logger.info({ request, response }, `ProductService: ${url}`);
	};

	public static getInstance(): ProductService {
		if (!ProductService.instance) {
			ProductService.instance = new ProductService();
		}
		return ProductService.instance;
	}
}