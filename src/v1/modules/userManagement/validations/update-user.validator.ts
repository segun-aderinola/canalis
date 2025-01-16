export const updateUserRules = {
  name: "required|string",
  phoneNumber: "required|min:11|max:13|phone",
  address: "required|string",
  role: "required|string",
  supervisorId: "required|uuid",
  region: "required|string",
};