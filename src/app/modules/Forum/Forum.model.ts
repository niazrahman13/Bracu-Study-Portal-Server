import mongoose, { Schema, Document } from 'mongoose';

interface ForumDocument extends Document {
  courseName: string;
  description: string;
  createdBy: {
    userId: string;
    userName: string;
  };
  resolved: boolean;
}

const ForumSchema: Schema = new Schema({
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
  },
  resolved: { type: Boolean, default: false }, // You can add a resolved flag for marking resolved issues.
});

const Forum = mongoose.model<ForumDocument>('Forum', ForumSchema);
export default Forum;
