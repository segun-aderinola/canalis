
import { getEnv } from "./env.config";

const appConfig = {
	app: {
		name: process.env.APP_NAME,
		brand: process.env.BRAND_NAME,
		env: getEnv(),
	},
	server: {
		port: Number(process.env.PORT),
	},
	redis: {
		host: String(process.env.REDIS_HOST),
		port: Number(process.env.REDIS_PORT),
		password: String(process.env.REDIS_PASSWORD),
	},
	database: {
		DB_CLIENT: process.env.DB_CLIENT,
		DB_URL: String(process.env.DB_URL),
	},
	coreBusinessApplication: {
		generalInsurance: {
			base_url: String(process.env.GENERAL_INSURANCE_SERVICE_URL),
		},
	},
	finance: {
		base_url: String(process.env.FINANCE_SERVICE_URL),
	},
	customer: {
		base_url: String(process.env.CUSTOMER_SERVICE_URL),
	},
	quotation: {
		base_url: String(process.env.QUOTATIONS_SERVICE_URL),
	},
	generalApiGateway: {
		base_url: String(process.env.API_GATEWAY_URL),
	},
	api_gateway: {
		base_url: String(process.env.API_GATEWAY_URL),
		secret_key: String(process.env.API_GATEWAY_SECRET_KEY),
	},
};

export default appConfig;



