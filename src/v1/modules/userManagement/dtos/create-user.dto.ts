
export type CreateUser = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  avatar?: string;
  status?: string;
  isDefaultPassword?: boolean;
  idType?: string;
  idNumber?: string;
  roleId: string;
  supervisorId?: string;
  region: string;
  createdAt?: Date;
  updatedAt?: Date;
};