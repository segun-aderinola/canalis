
export type CreateUser = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  status: string;
  hasChangedPassword: boolean;
  idType: string;
  idNumber: string;
  roleId: string;
  supervisorId?: string;
  region: string;
  createdAt?: Date;
  updatedAt?: Date;
};
