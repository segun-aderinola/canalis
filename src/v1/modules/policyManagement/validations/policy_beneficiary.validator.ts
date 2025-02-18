export const policyBeneficiaryValidationRules = {
  firstName: "required|string|min:2|max:50",
  lastName: "required|string|min:2|max:50",
  gender: "required|string|in:Male,Female,Other",
  dateOfBirth: "required|date",
  relationshipToCustomer: "required|string|min:3|max:50",
  percentageRate: "required|numeric|min:0|max:100",
  phoneNumber: "required|string|min:10|max:20",
  alternatePhoneNumber: "string|min:10|max:20",
  emailAddress: "required|string|email",
  meansOfId: "string|min:3|max:50",
  idNumber: "string|min:5|max:50",
  idExpiryDate: "required|date",
  idURL: "string|url"
};
