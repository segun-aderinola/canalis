import { ISingleProductRes, IProductsRes, IProductPayload } from "./products.types";


export interface IProductServiceActions {
	getProducts(payload: IProductPayload): Promise<IProductsRes[]>;
	getProductById(id: string, accessToken: string): Promise<ISingleProductRes>;
}