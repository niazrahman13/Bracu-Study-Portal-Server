import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import User from '../modules/User/User.model';

// Utility function to generate JWT
const generateToken = (user: any) => {
  return jwt.sign({ userId: user._id, role: user.role }, config.jwt_access_secret!, {
    expiresIn: config.jwt_access_expires_in, // Ensure this is set in your config
  });
};

// Middleware for protected routes
const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Extract token from the 'Bearer token' format
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt_access_secret!) as JwtPayload;

    const { userId, role, iat } = decoded;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // Check if user is deleted or blocked
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
    }

    if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }

    // Ensure the token was not issued before a password change
    if (user.passwordChangedAt && user.passwordChangedAt > new Date(iat * 1000)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Check user roles if required
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You do not have permission to access this resource!');
    }

    req.user = user; // Attach user to request
    next();
  });
};

// Register new user
export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create the new user
  user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user', // Assuming default role is 'user', change if needed
  });

  // Generate JWT token
  const token = generateToken(user);

  return res.status(201).json({ token, user: { email: user.email, name: user.name } });
});

// Login user
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = generateToken(user);

  return res.json({ token, user: { email: user.email, name: user.name } });
});

// Firebase login (Google authentication)
export const firebaseLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body;

  // Check if user exists by email
  let user = await User.findOne({ email });
  if (!user) {
    // Create user if not found
    user = await User.create({
      email,
      name,
      role: 'user', // Default role for Google login, change if necessary
    });
  }

  // Generate JWT token
  const token = generateToken(user);

  return res.json({ token, user: { email: user.email, name: user.name } });
});

// Fetch all users (for admin)
export const fetchAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  return res.json(users);
});

export default auth;
