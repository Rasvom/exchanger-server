import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Extend the Express Request type to include our custom manager property
declare module 'express-serve-static-core' {
  interface Request {
    manager?: {
      id: string;
      login: string;
    };
  }
}

export interface AuthenticatedRequest extends Request {}

// Query filter types
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface RequestFilterQuery extends PaginationQuery {
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: string;
  amountTo?: string;
  search?: string;
}

// MongoDB filter types
export interface MongoDateFilter {
  $gte?: Date;
  $lte?: Date;
}

export interface MongoAmountFilter {
  $gte?: number;
  $lte?: number;
}

export interface RequestFilters {
  user?: string;
  status?: string;
  createdAt?: MongoDateFilter;
  $or?: Array<Record<string, any>>;
  sendAmount?: MongoAmountFilter;
  receiveAmount?: MongoAmountFilter;
}

export interface SortOptions {
  [key: string]: 1 | -1;
}

// Response types
export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RequestStats {
  [status: string]: {
    count: number;
    totalSendAmount: number;
    totalReceiveAmount: number;
  };
}

// Update request types
export interface UpdateRequestData {
  status: string;
  manager: string;
  cancelReason?: string;
}

// Error types
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Valid statuses
export const VALID_REQUEST_STATUSES = [
  'PENDING',
  'PROCESSING',
  'VERIFIED',
  'COMPLETED',
  'CANCELED',
] as const;

export type RequestStatus = (typeof VALID_REQUEST_STATUSES)[number];
