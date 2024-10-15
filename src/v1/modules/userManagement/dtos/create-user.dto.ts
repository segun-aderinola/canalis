
export type CreateUser = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  status: string;
  hasChangedPassword: boolean;
  meansOfId: string;
  roleId: string;
  supervisorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
