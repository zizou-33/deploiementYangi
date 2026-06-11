export const API_URL = 'http://localhost:8000';

export const API = {
  auth: {
    register: `${API_URL}/api/auth/register/`,
    login: `${API_URL}/api/auth/login/`,
    profile: `${API_URL}/api/auth/profile`,
    changePassword: `${API_URL}/api/auth/change-password/`,
  },
  driver: {
    me: `${API_URL}/api/driver/me`,
    request: `${API_URL}/api/drivers/request/`,
  },
  ride: {
    create: `${API_URL}/api/ride/create/`,
    customerHistory: `${API_URL}/api/ride/customer-history/`,
    driverHistory: `${API_URL}/api/ride/driver-history/`,
    available: `${API_URL}/api/ride/available`,
    detail: (id: number) => `${API_URL}/api/ride/detail/${id}`,
    cancel: (id: number) => `${API_URL}/api/ride/cancel/${id}`,
    accept: (id: number) => `${API_URL}/api/ride/accept/${id}/`,
    start: (id: number) => `${API_URL}/api/ride/start/${id}/`,
    complete: (id: number) => `${API_URL}/api/ride/complete/${id}/`,
    review: (id: number) => `${API_URL}/api/ride/${id}/review/`,
  },
  admin: {
    requests: `${API_URL}/api/admin/requests/`,
    approveRequest: (id: number) => `${API_URL}/api/admin/request/approve/${id}/`,
    declineRequest: (id: number) => `${API_URL}/api/admin/request/decline/${id}/`,
    rides: `${API_URL}/api/admin/rides`,
    users: `${API_URL}/api/admin/users`,
    blockUser: (id: number) => `${API_URL}/api/admin/user/block/${id}`,
    unblockUser: (id: number) => `${API_URL}/api/admin/user/unblock/${id}`,
  },
  notifications: {
    list: `${API_URL}/api/notifications/`,
    detail: (id: number) => `${API_URL}/api/notifications/${id}`,
  },
};
