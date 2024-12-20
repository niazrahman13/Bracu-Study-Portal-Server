// src/components/layout/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken, selectUser, logout } from '../../redux/features/auth/authSlice'; // Adjust path as needed
import { Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

const MainLayout = () => {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout()); // Clear token and user from Redux state
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleCoursesClick = () => {
    navigate('/courses');
  };

  const handleThesisClick = () => {
    navigate('/thesis');
  };

  const handleUserCLick = () => {
    navigate('/user');
  };

  const handleUserForum = () => {
    navigate('/forum');
  };

  const handleUserReview = () => {
    navigate('/review');
  };

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', label: <span onClick={handleHomeClick}>Home</span> },
            { key: '2', label: <span onClick={handleCoursesClick}>Courses</span> },
            { key: '3', label: <span onClick={handleThesisClick}>Thesis</span> },
            { key: '4', label: token ? <span onClick={handleUserCLick}>User Dashboard</span> : null },
            { key: '5', label: token ? <span onClick={handleUserForum}>Forum</span> : null },
            { key: '6', label: token ? <span onClick={handleUserReview}>Review</span> : null },
          ]}
        />
        <Button
          onClick={token ? handleLogout : handleLogin}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '0 16px',
            height: '32px',
          }}
        >
          {token ? 'Logout' : 'Login'}
        </Button>
      </Header>
      <Content style={{ marginTop: '64px', padding: '24px' }}>
        <div style={{ padding: 24, minHeight: '100vh' }}>
          <Outlet /> {/* Render nested route components here */}
        </div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
