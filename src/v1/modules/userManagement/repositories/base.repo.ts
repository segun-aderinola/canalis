import { ObjectLiteral } from "@shared/types/object-literal.type";
import { Model, Transaction } from "objection";
import { Wallet } from "../model/wallet.model";

export class BaseRepository<T, M extends Model> {
  private model: typeof Model | any;
  constructor(model: M | any) {
    this.model = model;
  }

  setModel(model: M | any) {
    this.model = model;
  }

  async findById(id: string, relations: string[] = []): Promise<M> {
    const query = this.model.query();

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }

    return await query.findById(id);
  }

  async updateById(id: string, data: Partial<M>, trx?: Transaction): Promise<M> {
    return await this.model.query(trx).patchAndFetchById(id, data).returning("*");
  }

  async save(data: Partial<T>, transaction?: Transaction): Promise<M> {
    return await this.model.query(transaction).insert(data).returning("*");
  }

  async saveBulk(data: Partial<T[]>, transaction?: Transaction): Promise<M> {
    return await this.model.query(transaction).insert(data).returning("*");
  }

  async getAll() {
    return await this.model.query();
  }

  async getAllWithRelations(relations: string[] = []) {
    const query = this.model.query();

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }

    return await query;
  }

  async deleteById(id: string) {
    return await this.model.query().deleteById(id);
  }

  async findByName(name: string) {
    return await this.model.query().findOne({ name });
  }

  async findByEmail(email: string) {
    return await this.model.query().findOne({ email });
  }

  
  async findByEmails(emails: string[]): Promise<any[]> {
    return this.model.query().whereIn('email', emails);
  }

  async findByIdsAndRole(ids: string[], role: string): Promise<any[]> {
    return this.model.query()
      .whereIn('id', ids)
      .andWhere('roleId', role);
  }

  async saveMany(users: any[]): Promise<any[]> {
    return await this.model.query().insert(users).returning('*');
  }

  async findOne(filter: ObjectLiteral): Promise<T | undefined> {
    return await this.model.query().where(filter).first();
  }

  async findOneWhere(filter: ObjectLiteral): Promise<T | undefined> {
    return await this.model.query().where(filter)[0];
  }
  async findOrWhere(
    filter: ObjectLiteral, 
    orFilter?: ObjectLiteral, 
    andFilter?: ObjectLiteral
  ): Promise<T | undefined> {
    const query = this.model.query();

    query.where(filter);

    if (orFilter) {
      for (const key in orFilter) {
        if (Object.prototype.hasOwnProperty.call(orFilter, key)) {
          query.orWhere(key, orFilter[key]);
        }
      }
    }
  
    if (andFilter) {
      for (const key in andFilter) {
        if (Object.prototype.hasOwnProperty.call(andFilter, key)) {
          query.andWhere(key, andFilter[key]);
        }
      }
    }
  
    return await query.first();
  }
  
  
  

  async findWhere(filter: ObjectLiteral, relations: string[] = []): Promise<T[]> {
    const query = this.model.query();

    for (const relation of relations) {
      query.withGraphFetched(relation);
    }

    return await query.where(filter);
  }

  async findAndCountAll(
    filter: ObjectLiteral, 
    relations: string[] = [], 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ data: T[], totalRecords: number }> {
    const query = this.model.query();
  
    for (const relation of relations) {
      query.withGraphFetched(relation);
    }
  

    const totalRecords = await this.model.query().where(filter).resultSize();
   
    const data = await query
      .where(filter)
      .limit(limit)
      .offset((page - 1) * limit);
  
    return { data, totalRecords };
  }

  async findAll(filter: ObjectLiteral): Promise<T[]> {
    console.log("Filter received for findWhere:", filter);
    const query = this.model.query();
    return await query.where(filter);
  }

  async findAllWhere(filter: Record<string, any>): Promise<Wallet[]> {
    const query = this.model.query();
  
    if (filter.userId && Array.isArray(filter.userId)) {
      return query.whereIn("userId", filter.userId);
    }
    return query.where(filter);
  }
}
