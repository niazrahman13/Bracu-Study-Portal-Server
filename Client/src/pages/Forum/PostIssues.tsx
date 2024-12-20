import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectUser } from '../../redux/features/auth/authSlice'; 

const PostIssues: React.FC = () => {
  const [courseName, setCourseName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Get user from Redux
  const user = useSelector((state: RootState) => selectUser(state));

  // Form submission function
  const onSubmit = async () => {
    if (!user) {
      message.error('You need to be logged in to post an issue.');
      return;
    }

    // Check if userName exists and handle missing displayName case
    const userName = user.displayName || "Anonymous";  // Provide a fallback for userName

    try {
      const response = await axios.post('http://localhost:3000/api/v1/issues', {
        courseName,
        description,
        userId: user.email,  // Assuming email is the user ID
        userName: userName,  // Use userName or fallback to "Anonymous"
      });

      message.success(response.data.message);
      setCourseName('');
      setDescription('');
    } catch (err) {
      // Log the error details for debugging
      console.error('Error posting issue:', err.response?.data || err);
      message.error('Failed to post the issue. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Post Your Issue</h2>
      <Form
        onFinish={onSubmit}  // Use Ant Design's onFinish to handle form submit
      >
        <Form.Item
          label="Course Name"
          name="courseName"  // Add the name attribute for proper validation
          rules={[{ required: true, message: 'Please enter the course name' }]}
        >
          <Input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
          />
        </Form.Item>

        <Form.Item
          label="Issue Description"
          name="description"  // Add the name attribute for validation
          rules={[{ required: true, message: 'Please describe the issue' }]}
        >
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue"
            rows={4}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PostIssues;
