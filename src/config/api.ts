// API Configuration
export const API_CONFIG = {
  BACKEND_URL: '',
  BASE_URL: '/api',
  ENDPOINTS: {
    // Authentication
    LOGIN: '/alumni/login',
    REGISTER: '/alumni/register',
    LOGOUT: '/alumni/logout',
    REFRESH: '/alumni/refresh',
    FORGOT_PASSWORD: '/alumni/forgot-password',
    RESET_PASSWORD: '/alumni/reset-password',
    
    // User Profile
    ME: '/alumni/me',
    USER_PROFILE: (id: string) => `/alumni/${id}`,
    UPDATE_PROFILE: (id: string) => `/alumni/${id}/profile`,
    COMPLETION_STATUS: (id: string) => `/alumni/${id}/completion-status`,
    UPLOAD_PROFILE_PICTURE: (id: string) => `/alumni/${id}/profile-picture`,
    DELETE_PROFILE_PICTURE: (id: string) => `/alumni/${id}/profile-picture`,
    
    // Sponsors
    SPONSORS: '/sponsors',

    // Notices
    NOTICES: '/notices',

    // Banners
    BANNERS: '/banners',
    BANNER_BY_PATH: (path: string) => `/banners?path=${path}`,

    // Events
    EVENTS: '/events',
    EVENT_BY_ID: (id: string) => `/events/${id}`,
    EVENT_PRICING: (id: string) => `/events/${id}/pricing`,
    ACTIVE_REUNION: '/events/active-reunion',
    
  // bKash Payment
  BKASH_CREATE_PAYMENT: '/bkash/create-payment',
  BKASH_EXECUTE_PAYMENT: '/bkash/execute-payment',
  BKASH_QUERY_PAYMENT: '/bkash/query-payment',

  COMMITTEES: '/committees',
  COMMITTEE_BY_ID: (id: string|number) => `/committee/${id}`,
    
  // Reunion Registration
  EVENT_REGISTRATION: (eventId: string | number) => `/events/${eventId}/register`
  }
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get authorization headers
export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authToken = token || localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Helper function for multipart form data headers
export const getMultipartHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {};
  
  const authToken = token || localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};
