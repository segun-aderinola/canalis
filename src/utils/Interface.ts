export interface UserAttributes {
    id?: string;
    email: string;
    name: string,
    address?: string,
    phoneNumber: string,
    password: string,
    roleId?: string,
    meansOfId?: string,
    supervisorId?: string,
    region?: string,
    hasChangedPassword?: boolean,
    status?: string,
    createdAt?: Date,
    updatedAt?: Date
  }

  export interface PolicyAttributes {
    id?: string;
    customerId: string;
    agentId: string,
    productId: string,
    policyNumber?: string,
    firstName: string,
    lastName: string,
    meansOfId: string,
    dateOfBirth: string,
    age: string,
    gender: string,
    cellPhone: string,
    alternatePhoneNumber?: string,
    stateOfOrigin: string,
    lgaOfOrigin: string,
    email: string,
    residentialAddress: string,
    policyType: string,
    policyStatus: string,
    pendingActivation: boolean,
    pendingPayment: boolean,
    pendingCustomerService: boolean,
    paymentFrequency: string;
    savingsAmount: number;
    annualRiskCover: number;
    annualRiskPremium: number;
    recurringPayment: boolean;
    savingsGoal: string;
    beneficiary: [
      {
        firstName: string,
        lastName: string,
        relationship: string,
        dateOfBirth: string,
        cellPhoneNumber: string,
        email: string,
        gender: string,
        percentageRate: number,
        age: string,
      }
    ];
    paid: boolean,
    dateCreated?: Date,
    expiryDate?: Date,
    deleteStatus?: string,
    createdAt: Date,
    updatedAt: Date
  }

  export interface ProductAttributes {
    id?: string;
    name: string;
    deleteStatus: string,
    amount: number,
    createdAt: Date,
    updatedAt: Date
  }

  export interface ProfileUpdateLogAttributes {
    id?: string;
    userId?: string;
    createdAt: Date,
    updatedAt: Date
  }

  export interface PaymentAttributes {
    id?: string;
    userId: string,
    policyId: string,
    paymentURL: string;
    amount: number,
    status: string,
    createdAt: Date,
    updatedAt: Date
  }

  export interface RoleAttributes {
    id?: string;
    name: string,
    slug: string,
    status?: string,
    createdAt?: Date,
    updatedAt?: Date
  }

  export interface TransactionAttributes {
    id?: string;
    userId: string;
    status: string,
    payment_method: string,
    amount: string,
    type: string,
    createdAt: Date,
    updatedAt: Date
  }

  export interface WalletAttributes {
    id?: string;
    userId: string;
    amount?: number,
    ledgerBalance?: number,
    accountNumber?: string,
    accountName?: string,
    bankName?: string,
    createdAt?: Date,
    updatedAt?: Date
  }

export interface OtpAttributes {
    id?: string;
    userId: string;
    otp: string,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date
  }

  export interface DeleteAccountAttributes {
    id?: string;
    userId: string;
    reason: string,
    createdAt: Date,
    updatedAt: Date
  }

  export interface NotificationAttributes {
    id?: string;
    userId: string;
    message: string,
    title: string,
    status: string,
    createdAt: Date,
    updatedAt: Date
  }
  export interface NotificationSettingsAttributes {
    id?: string;
    userId: string;
    notification_from_saafri: boolean,
    email_notification: string,
    email_newsletter: string,
    push_notification: string,
  }

  export interface FavoritePropertyAttributes {
    id?: string;
    userId: string;
    property_id: string;
    status: string
  }

  export interface RatingAttributes {
    id?: string;
    userId: string;
    property_id: string;
    message: string,
    rate: number,
  }

