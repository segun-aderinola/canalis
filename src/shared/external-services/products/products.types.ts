export interface IProductResponse<T>{
 status: boolean;
 message: string;
 data: T;
}

export interface IUnpaginatedProductsRes {
	id: string;
	name: string;
	slug: string;
	prefix: string;
	naicomCode: string;
	riskType: string;
	type: string;
	classOfBusiness: {
		id: string;
    name: string;
    code: string;
	};
}

interface IRisk {
	id: string;
	name: string;
	sumInsured: string;
	premiumRate: string;
	discountRate: string;
	sectionId: string | null;
	productId: string;
	createdAt: string;
	updatedAt: string;
}

interface IDiscount {
	id: string;
	name: string;
	discountRate: string;
	discountType: string;
	isEditable: boolean;
	sectionId: string | null;
	productId: string;
	createdAt: string;
	updatedAt: string;
}

interface ISection {
	id: string;
	name: string;
	productId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ISingleProductRes {
	id: string;
	name: string;
	slug: string;
	prefix: string;
	naicomCode: string;
	classOfBusinessId: string;
	type: string;
	premiumRate: string;
	discountRate: string;
	minSumInsured: string;
	maxSumInsured: string;
	premiumCalculationType: string;
	isPremiumEditable: boolean;
	policyDocumentTemplateUrl: string;
	policyDocumentName: string;
	isActive: boolean;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	risks: IRisk[];
	discounts: IDiscount[];
	sections: ISection[];
}