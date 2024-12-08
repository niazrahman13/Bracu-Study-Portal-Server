import express from 'express';
import { register, login, firebaseLogin, getAllUsers, getAllLoggedInUsers } from '../modules/User/User.Controller'; // Adjust path as needed
import { deleteComment, editComment, getComments, getIssues, postComment, postIssue, resolveIssue } from '../modules/Forum/Forum.controller';
import { addCourse, deleteCourse, getCourseById, getCourses, getReviewsByCourseId, postReview, editReview, deleteReview } from '../modules/Course/CourseController';
import { addReviewComment, deleteReviewComment, editReviewComment, getCommentsByReview } from '../modules/Course/reviewComment.controller';


const router = express.Router();

// User routes
router.post('/register', register);
router.post('/login', login);
router.post('/firebase', firebaseLogin);
router.get('/users', getAllUsers);  // Fetch all users
router.get('/loggedInUsers', getAllLoggedInUsers);  // Fetch all logged in users

// Issue routes
router.post('/issues', postIssue);  // Post a new issue
router.get('/issues', getIssues);  // Get all issues
router.post('/issues/resolve', resolveIssue);  // Resolve an issue
router.post('/comments', postComment);  // Post a new comment
router.get('/comments/:issueId', getComments);  // Get comments for a specific issue
router.post('/comments/edit', editComment);  // Edit a comment
router.delete('/comments/delete/:commentId', deleteComment);

// Course related routes
router.get('/courses', getCourses);  // Get all courses
router.get('/courses/:id', getCourseById);  // Get a single course by ID
router.post('/addCourses', addCourse);  // Add a new course (optional)
router.delete('/deleteCourses/:id', deleteCourse);  // Delete a course by ID (optional)
router.get('/courses/:courseId/reviews', getReviewsByCourseId); // Get reviews for a specific course
router.post('/courses/:courseId/reviews', postReview);  // Post a review for a specific course

// New routes for editing and deleting reviews
router.put('/courses/:courseId/reviews/:reviewId', editReview);  // Edit a review
router.delete('/courses/:courseId/reviews/:reviewId', deleteReview);

router.get('/reviews/:reviewId/comments', getCommentsByReview);

router.post('/reviews/:reviewId/comments', addReviewComment);

router.put('/comments/:commentId', editReviewComment); // Edit a comment
router.delete('/comments/:commentId', deleteReviewComment);


export default router;
