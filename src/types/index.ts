export interface TokenRecord {
  token: string;
  accountNumber: string;
  createdAt: Date;
}

export interface ErrorResponse {
  error: string;
  statusCode?: number;
}
