import { Request, Response } from 'express';
import Course from '../Course/CourseMode';  
import Review from './ReviewModel';

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get course by ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// Post a new course (optional)
export const addCourse = async (req, res) => {
  const { courseCode, courseName } = req.body;
  const newCourse = new Course({ courseCode, courseName });
  try {
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a course by ID (optional)
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get reviews for a specific course
export const getReviewsByCourseId = async (req, res) => {
    try {
      const reviews = await Review.find({ courseId: req.params.courseId });
      console.log('Fetched Reviews:', reviews); // Log fetched reviews
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error); // Log the error
      res.status(500).json({ message: error.message });
    }
  };
  
  export const postReview = async (req, res) => {
    const { title, description, howToDoWell } = req.body;// Assuming user is authenticated and email is available
  
    const review = new Review({
      courseId: req.params.courseId,
      title,
      description,
      howToDoWell,
    });
  
    try {
      await review.save();
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// Update a review
export const editReview = async (req, res) => {
  const { courseId, reviewId } = req.params;
  const { title, description, howToDoWell } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review || review.courseId.toString() !== courseId) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.title = title;
    review.description = description;
    review.howToDoWell = howToDoWell;

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a review
export const deleteReview = async (req, res) => {
    const { courseId, reviewId } = req.params;
    console.log(`Deleting reviewId: ${reviewId} for courseId: ${courseId}`);

    try {
        const review = await Review.findById(reviewId);
        console.log('Found review:', review);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.courseId.toString() !== courseId) {
            return res.status(404).json({ message: 'Review does not belong to this course' });
        }

        review.deleted = true;
        await review.save();

        res.json({ message: 'Review marked as deleted successfully' });
    } catch (error) {
        console.error('Error marking review as deleted:', error);
        res.status(500).json({ message: error.message });
    }
};
