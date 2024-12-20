// src/components/layout/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/features/auth/authSlice'; // Adjust the path as needed
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useSelector(selectToken);

  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
