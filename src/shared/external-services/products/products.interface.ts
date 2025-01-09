import { ISingleProductRes, IProductsRes, IProductPayload } from "./products.types";


export interface IProductServiceActions {
	getProducts(payload: IProductPayload): Promise<IProductsRes[]>;
	getProductById(payload: string): Promise<ISingleProductRes>;
}