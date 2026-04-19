export const AUTH_TOKEN_KEY = 'bookstore_token';

export const saveToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isLoggedIn = () => {
  return Boolean(getToken());
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
