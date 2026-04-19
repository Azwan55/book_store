import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bookstore_default_secret';

export const protect = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    request.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    return response.status(401).json({ message: 'Token is invalid or expired' });
  }
};
