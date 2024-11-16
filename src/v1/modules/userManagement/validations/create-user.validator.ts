export const createUserRules = {
  name: "required|string",
  email: "required|string|email",
  phoneNumber: "required|min:11|max:13|phone",
  address: "required|string",
  idType: "required|string",
  idNumber: "required|string",
  roleId: "required|string",
  supervisorId: "required|string",
  region: "required|string",
};
