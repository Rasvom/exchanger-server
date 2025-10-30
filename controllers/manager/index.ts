import { login } from './login';
import { refreshTokens } from './refreshTokens';
import { getProfile } from './getProfile';
import { getAllRequests } from './getAllRequests';
import { getRequestDetails } from './getRequestDetails';
import { updateRequestStatus } from './updateRequestStatus';

export const managerControllers = {
  login,
  refreshTokens,
  getProfile,
  getAllRequests,
  getRequestDetails,
  updateRequestStatus
}; 