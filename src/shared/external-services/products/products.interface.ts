import { ISingleProductRes, IUnpaginatedProductsRes } from "./products.types";


export interface IProductServiceActions {
	getUnpaginatedProducts(): Promise<IUnpaginatedProductsRes[]>;
	getProductById(payload: string): Promise<ISingleProductRes>;
}