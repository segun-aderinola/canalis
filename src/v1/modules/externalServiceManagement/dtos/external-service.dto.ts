import { IOnboardCustomerPayload } from "@shared/external-services/customers/customers.types";
import { IGetQuotesPayload, IGenerateQuotePayload, IGetQuoteByIdPayload } from "@shared/external-services/quotes/quotes.types";

export type PremiumDTO = {
	sumInsured: number;
  premiumRate: number;
};

export type QuoteDTO = IGenerateQuotePayload;

export type GetQuotesDTO = IGetQuotesPayload;

export type GetQuoteDTO = IGetQuoteByIdPayload

export type PaymentLinkDTO = {
  email: string;
  amount: string;
}

export type OnboardCustomerDTO = IOnboardCustomerPayload;