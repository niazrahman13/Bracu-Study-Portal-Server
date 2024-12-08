import mongoose, { Schema, Document } from 'mongoose';

interface CommentDocument extends Document {
  issueId: string;
  userId: string;
  userName: string;
  commentText: string;
  timestamp: Date;
}

const CommentSchema: Schema = new Schema({
  issueId: { type: Schema.Types.ObjectId, ref: 'Forum', required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  commentText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Comment = mongoose.model<CommentDocument>('Comment', CommentSchema);
export default Comment;
