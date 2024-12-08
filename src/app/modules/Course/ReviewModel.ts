import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  howToDoWell: { type: String, required: true },
  deleted: { type: Boolean, default: false } // Add this line
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
