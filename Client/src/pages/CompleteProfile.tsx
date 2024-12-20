import { Button, Input, Form, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      const email = localStorage.getItem('tempEmail');
      const name = values.name;
      
      // Send additional user data to backend
      const { data } = await axios.post('http://localhost:3000/api/v1/firebase', {
        email,
        name,
      });
      console.log(data)
      // Save token and user data in local storage or state
      localStorage.setItem('token', data.token);

      // Clean up local storage
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('tempName');

      // Navigate to the user dashboard or home page
      navigate('/');
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  };

  return (
    <div className="complete-profile-background">
      <Card className="complete-profile-card" hoverable>
        <h2 className="complete-profile-title">Complete Your Profile</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, type: 'string', message: 'Please input your Name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CompleteProfile;
