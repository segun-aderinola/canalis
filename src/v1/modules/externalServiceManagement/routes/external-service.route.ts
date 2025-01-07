import express, { Request, Response } from "express";
import { container } from "tsyringe";
import { validate } from "@shared/middlewares/validator.middleware";
import ExternalServiceController from "../controller/external-service.controller";
import {
	generatePaymentLinkRules,
	generatePremiumRules,
	generateQuoteRules,
	getSingleProductRules,
	onboardCustomerRules,
	getSingleQuoteRules,
	getQuotesRules,
} from "../validations/external-service.validator";

const externalServiceController = container.resolve(ExternalServiceController);
const router = express.Router();

router.get(
	"/external-services/products",
	(req: Request, res: Response, next) => {
		externalServiceController.getProducts(req, res).catch((e) => next(e));
	}
);


router.get(
	"/external-services/products/:id",
	validate(getSingleProductRules),
	(req: Request, res: Response, next) => {
		externalServiceController.getProductById(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/products/generate-premium",
	validate(generatePremiumRules),
	(req: Request, res: Response, next) => {
		externalServiceController.generatePremium(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/products/generate-payment-link",
	validate(generatePaymentLinkRules),
	(req: Request, res: Response, next) => {
		externalServiceController.genratePaymentLink(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/products/onboard-customer",
	validate(onboardCustomerRules),
	(req: Request, res: Response, next) => {
		externalServiceController.onboardCustomer(req, res).catch((e) => next(e));
	}
);

router.post(
	"/external-services/quotes/generate-quote",
	validate(generateQuoteRules),
	(req: Request, res: Response, next) => {
		externalServiceController.generateQuote(req, res).catch((e) => next(e));
	}
);

router.get(
	"/external-services/quotes",
	validate(getQuotesRules),
	(req: Request, res: Response, next) => {
		externalServiceController.getQuotes(req, res).catch((e) => next(e));
	}
);

router.get(
	"/external-services/quotes/:id",
	validate(getSingleQuoteRules),
	(req: Request, res: Response, next) => {
		externalServiceController.getQuoteById(req, res).catch((e) => next(e));
	}
);

router.get(
	"/external-services/quotes/:id/history",
	validate(getSingleQuoteRules),
	(req: Request, res: Response, next) => {
		externalServiceController.getQuoteHistoryById(req, res).catch((e) => next(e));
	}
);

export default router;
