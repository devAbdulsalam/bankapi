/**
 * @type {{ SUPER_ADMIN: 'SUPER_ADMIN', ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
	SUPER_ADMIN: 'SUPER_ADMIN',
	ADMIN: 'ADMIN',
	USER: 'USER',
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

/**
 * @type {{ GOOGLE: "GOOGLE"; GITHUB: "GITHUB"; EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
export const UserLoginType = {
	GOOGLE: 'GOOGLE',
	GITHUB: 'GITHUB',
	EMAIL_PASSWORD: 'EMAIL_PASSWORD',
};

export const AvailableSocialLogins = Object.values(UserLoginType);

/**
 * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED";SUCCESS: 'SUCCESS',FAILED: 'FAILED' } as const}
 */
export const TransactionStatusEnum = {
	FAILED: 'FAILED',
	CANCELLED: 'CANCELLED',
	PENDING: 'PENDING',
	SUCCESS: 'SUCCESS',
};

export const AvailableTransactionStatuses = Object.values(
	TransactionStatusEnum
);
/**
 * @type {{ CREDIT: 'CREDIT', DEBIT: 'DEBIT', } as const}
 */
export const TransactionTypeEnum = {
	CREDIT: 'CREDIT',
	DEBIT: 'DEBIT',
};

export const AvailableTransactionTypes = Object.values(TransactionTypeEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
