import { Request, Response } from 'express';
import Forum from '../Forum/Forum.model';
import Comment from './Comments.model';
import mongoose from 'mongoose';

// Post a new issue

export const postIssue = async (req: Request, res: Response) => {
  try {
    const { courseName, description, userId, userName } = req.body;

    // Create a new issue
    const newIssue = new Forum({
      courseName,
      description,
      createdBy: { userId, userName },
    });

    // Save the issue in the database
    await newIssue.save();

    return res.status(201).json({ message: 'Issue posted successfully' });
  } catch (error) {
    console.error('Error posting the issue:', error);
    return res.status(500).json({ message: 'Error posting the issue', error });
  }
};


// Fetch all issues
export const getIssues = async (req: Request, res: Response) => {
  try {
    const issues = await Forum.find().sort({ createdAt: -1 });
    return res.status(200).json(issues);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching issues', error });
  }
};

// Post a comment
export const postComment = async (req: Request, res: Response) => {
  try {
    const { issueId, userId, userName, commentText } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({ message: 'Invalid issueId format' });
    }

    const newComment = new Comment({
      issueId,
      userId,
      userName,
      commentText,
    });

    await newComment.save();
    return res.status(200).json({ message: 'Comment posted successfully' });
  } catch (error) {
    console.error('Error posting comment:', error); // Detailed logging
    return res.status(500).json({ message: 'Error posting comment', error: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { issueId } = req.params;

    // Validate issueId
    if (!issueId || !mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({ message: 'Invalid or missing issueId' });
    }

    // Fetch comments for the given issueId
    const comments = await Comment.find({ issueId }).sort({ timestamp: -1 });
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Error fetching comments', error });
  }
};

// Updated resolveIssue function
export const resolveIssue = async (req: Request, res: Response) => {
  try {
    const { issueId, userId } = req.body;

    // Validate input
    if (!issueId || !userId) {
      return res.status(400).json({ message: 'Missing issueId or userId' });
    }

    // Fetch the issue
    const issue = await Forum.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if the user has permission to resolve this issue
    if (issue.createdBy.userId !== userId) {
      return res.status(403).json({ message: 'You can only resolve your own issue' });
    }

    // Delete the issue
    await Forum.findByIdAndDelete(issueId);

    return res.status(200).json({ message: 'Issue resolved and deleted successfully' });
  } catch (error) {
    console.error('Error resolving issue:', error); // Log error details
    return res.status(500).json({ message: 'Error resolving issue', error });
  }
};


// Edit a comment
export const editComment = async (req: Request, res: Response) => {
  try {
    const { commentId, newCommentText } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid commentId format' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.commentText = newCommentText;
    await comment.save();
    return res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error); // Log error for debugging
    return res.status(500).json({ message: 'Error updating comment', error });
  }
};


export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params; // Extract from params
    const result = await Comment.findByIdAndDelete(commentId);

    if (!result) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error); // Log error for debugging
    return res.status(500).json({ message: 'Error deleting comment', error });
  }
};