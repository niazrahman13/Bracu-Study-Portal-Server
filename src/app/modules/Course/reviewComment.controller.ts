import mongoose from "mongoose";
import ReviewComment from "./reviewComment.model";
import reviewCommentModel from "./reviewComment.model";

// Get comments by reviewId
export const getCommentsByReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
      const comments = await ReviewComment.find({ reviewId });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
    }
  };
  
  // Add a new comment to a review
  export const addReviewComment = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the request body
        
        const { reviewId, userId, userName, commentText } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            console.log('Invalid reviewId:', reviewId); // Log invalid reviewId
            return res.status(400).json({ message: 'Invalid reviewId format' });
        }

        const newComment = new reviewCommentModel({
            reviewId,
            userId,
            userName,
            commentText,
        });

        await newComment.save();
        return res.status(200).json({ message: 'Comment posted successfully' });
    } catch (error) {
        console.error('Error posting comment:', error); 
        return res.status(500).json({ message: 'Error posting comment', error: error.message });
    }
};

  

// Edit a comment
export const editReviewComment = async (req, res) => {
    try {
      const { content } = req.body;
      const { commentId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: 'Invalid commentId format' });
      }
  
      const comment = await ReviewComment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      comment.commentText = content; // Make sure this matches your model
      await comment.save();
  
      return res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating comment', error });
    }
  };
  
  
  // Delete a comment
  export const deleteReviewComment = async (req: Request, res: Response) => {
    try {
      const { commentId } = req.params; 
  
      const deletedComment = await ReviewComment.findByIdAndDelete(commentId);
  

      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);

      return res.status(500).json({ message: 'Error deleting comment', error });
    }
  };
  