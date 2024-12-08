import { Request, Response } from 'express';
import User from '../User/User.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const generateToken = (user: any) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({ token, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error while registering user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({ token, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const firebaseLogin = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, password: '' });
      await user.save();
    } else {
      user.name = name;
      await user.save();
    }

    res.status(200).json({ user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error during Firebase login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Helper functions for sending friend request
const getUserById = async (userId: string) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error(`Error retrieving user with ID ${userId}:`, error);
    throw new Error('Database error');
  }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { receiverId } = req.body;
  const senderId = req.user._id; // Ensure authentication middleware is used to get the logged-in user ID

  if (senderId === receiverId) {
    return res.status(400).json({ message: "You cannot send a friend request to yourself." });
  }

  try {
    // Add receiverId to sender's friendRequests
    await User.findByIdAndUpdate(senderId, { $addToSet: { friendRequests: receiverId } });

    // Add senderId to receiver's friendRequests
    await User.findByIdAndUpdate(receiverId, { $addToSet: { friendRequests: senderId } });

    res.status(200).json({ message: "Friend request sent." });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: "Server error." });
  }
};


export const createGroup = async (req: Request, res: Response) => {
  const { name, userIds } = req.body;

  try {
    const group = new Group({ name, members: userIds });
    await group.save();

    await User.updateMany(
      { _id: { $in: userIds } },
      { $push: { groups: group._id } }
    );

    return res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getAllLoggedInUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, 'name email friends friendRequests groups').lean();
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};
