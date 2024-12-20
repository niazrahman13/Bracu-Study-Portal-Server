import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Card, message } from 'antd';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/auth/authSlice'; // Import your Redux action
import './Login.css'; // Import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Access dispatch
  const [loaded, setLoaded] = useState(false);

  const fade = useSpring({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(50px)',
    from: { opacity: 0, transform: 'translateY(50px)' },
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(); // Get the Firebase token

      // Dispatch the token and user info to Redux
      dispatch(setUser({
        token,
        user: {
          email: result.user.email,
          displayName: result.user.displayName,
        }
      }));

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Redirect to home
      navigate('/'); 
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleNavigateHome = () => {
    navigate('/'); // Navigate to home page
  };

  const handleEmailPasswordLogin = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        email: values.email,
        password: values.password,
      });
  
      // Extract token from response
      const { token, user } = response.data;
  
      // Save token to localStorage
      localStorage.setItem('token', token);
  
      // Dispatch token and user info to Redux
      dispatch(setUser({
        token,
        user
      }));
  
      // Handle successful login
      message.success('Login successful!');
  
      // Redirect to the user dashboard or home
      navigate('/'); // Replace with your dashboard route if needed
    } catch (error) {
      console.error('Error logging in with email and password:', error);
      message.error('Login failed!');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirect to Register page
  };

  const handleForgotPassword = () => {
    navigate('/forgetPassword'); // Redirect to Forgot Password page
  };

  return (
    <div className="login-background">
      <animated.div className="login-container" style={fade}>
        <Card className="login-card" hoverable>
          <h2 className="login-title">Login</h2>
          <Form
            layout="vertical"
            onFinish={handleEmailPasswordLogin}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
            >
              <Input className="login-input" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password className="login-input" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                Login
              </Button>
              <Button type="default" onClick={handleRegisterRedirect} className="login-button">
                Register
              </Button>
            </Form.Item>
          </Form>
          {/* <Button onClick={handleGoogleSignIn} className="login-google-button" type="primary">
            Sign in with Google
          </Button> */}
          <div style={{ marginTop: 10 }}>
            <Button onClick={handleForgotPassword} className="login-link">
              Forgot Password?
            </Button>
          </div>
          <div style={{ marginTop: 20 }}>
            <Button onClick={handleNavigateHome} className="login-home-button" type="default">
              Go to Home
            </Button>
          </div>
        </Card>
      </animated.div>
    </div>
  );
};

export default Login;
