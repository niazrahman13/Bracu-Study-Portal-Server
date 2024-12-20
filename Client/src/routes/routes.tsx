import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import ForgetPassword from '../pages/Auth/ForgetPassword';
import Course from '../pages/Course';
import Playlist from '../pages/PlayList';
import Thesis from '../pages/Thesis';
import CoursesPage from '../pages/CoursesPage';
import ToDoList from '../pages/User/ToDoList';
import Calendar from '../pages/User/Calendar';
import CompleteProfile from '../pages/CompleteProfile';
import UserDashboard from '../pages/User/UserDashboard';
import UserProfile from '../pages/User/UserProfile';

import PostIssues from '../pages/Forum/PostIssues';
import CourseReview from '../pages/Review/CourseReview';
import CourseReviewDetails from '../pages/Review/CourseReviewDetails';
import Forum from '../pages/Forum/Forum';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'course/:id', element: <Course /> },
      { path: 'playlist/:playlistUrl', element: <Playlist /> },
      { path: 'thesis', element: <Thesis/> },
      { path: 'forum', element: <Forum/> },
      { path: 'review', element: <CourseReview/> },
      { path: 'review/:courseId',element: <CourseReviewDetails /> },
      {
        path: 'user',
        element: <UserDashboard />,
        children: [
          { path: 'profile', element: <UserProfile /> },
          { path: 'todo', element: <ToDoList /> },
          { path: 'calendar', element: <Calendar /> },
          { path: 'postIssues', element: <PostIssues/> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgetPassword',
    element: <ForgetPassword />,
  },
  {
    path: '/complete-profile',
    element: <CompleteProfile />,
  },
]);

export default router;
