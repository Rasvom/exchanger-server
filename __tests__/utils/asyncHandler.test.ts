import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';

describe('asyncHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should call next with error when async function throws', async () => {
    const error = new Error('Test error');
    const asyncFunction = async () => {
      throw error;
    };

    const wrappedFunction = asyncHandler(asyncFunction);
    await wrappedFunction(mockReq as Request, mockRes as Response, mockNext);

    // Wait for Promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should resolve successfully when async function succeeds', async () => {
    const asyncFunction = async (req: Request, res: Response) => {
      res.json({ success: true });
    };

    const wrappedFunction = asyncHandler(asyncFunction);
    await wrappedFunction(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
