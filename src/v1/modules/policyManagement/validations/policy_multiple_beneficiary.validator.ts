export const policyBeneficiariesValidationRules = {
  "policyBeneficiaries.*.policyId": "required|string|uuid",
  "policyBeneficiaries.*.firstName": "required|string|min:2|max:50",
  "policyBeneficiaries.*.lastName": "required|string|min:2|max:50",
  "policyBeneficiaries.*.gender": "required|string|in:Male,Female,Other",
  "policyBeneficiaries.*.dateOfBirth": "required|date|before:today",
  "policyBeneficiaries.*.relationshipToCustomer": "required|string|min:3|max:50",
  "policyBeneficiaries.*.percentageRate": "required|numeric|min:0|max:100",
  "policyBeneficiaries.*.phoneNumber": "required|string|min:10|max:20",
  "policyBeneficiaries.*.alternatePhoneNumber": "string|min:10|max:20",
  "policyBeneficiaries.*.emailAddress": "required|string|email",
  "policyBeneficiaries.*.meansOfId": "string|min:3|max:50",
  "policyBeneficiaries.*.idNumber": "string|min:5|max:50",
  "policyBeneficiaries.*.idExpiryDate": "required|date|after:today",
  "policyBeneficiaries.*.idURL": "string|url"
};
