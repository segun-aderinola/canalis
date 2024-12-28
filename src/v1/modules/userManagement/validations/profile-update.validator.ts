export const profileUpdateRules = {
  name: "required|string",
  phoneNumber: "required|min:11|max:13|phone",
  address: "required|string",
  roleId: "required|string",
  supervisorId: "required|string",
  region: "required|string",
  avatar: "required|string"
};