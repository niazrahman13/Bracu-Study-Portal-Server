import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Use 'useLocation' to track the current route
import { auth } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const { Sider, Content } = Layout;
const { SubMenu } = Menu; // Import SubMenu from Menu

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null); // State to store authenticated user
  const location = useLocation(); // Access current route location

  // Firebase authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user if authenticated, else null
    });
    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={256}
        theme="dark"
        style={{
          background: '#001529',
          height: '100vh',
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['/user/profile']}
          selectedKeys={[location.pathname]} // Dynamically select menu item based on current route
          style={{
            flex: 1,
            overflow: 'auto',
            background: '#001529',
            color: '#fff',
          }}
        >
          <Menu.Item key="/user/profile">
            <Link to="profile" style={{ color: '#fff' }}>User Profile</Link>
          </Menu.Item>
          <Menu.Item key="/user/todo">
            <Link to="todo" style={{ color: '#fff' }}>To-Do List</Link>
          </Menu.Item>
          <Menu.Item key="/user/calendar">
            <Link to="calendar" style={{ color: '#fff' }}>Calendar</Link>
          </Menu.Item>
          <Menu.Item key="/user/postIssues">
            <Link to="postIssues" style={{ color: '#fff' }}>Forum Post</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: '0 24px', minHeight: '100vh' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {/* Display current authenticated user */}
          {user && (
            <div style={{ marginBottom: '16px', color: '#fff' }}>
              Welcome, {user.email}
            </div>
          )}

          {/* Render the nested route components here */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;
