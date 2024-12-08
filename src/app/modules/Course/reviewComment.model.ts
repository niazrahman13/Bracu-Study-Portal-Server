import mongoose from "mongoose";

const ReviewCommentSchema = new mongoose.Schema({
  reviewId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Review' },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  commentText: { type: String, required: true }, // Ensure this matches your code
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('ReviewComment', ReviewCommentSchema);
