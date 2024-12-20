import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CourseReview = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Course Reviews</h1> 
      <Row gutter={[16, 16]} justify="center"> 
        {courses.map((course) => (
          <Col span={6} key={course._id}>
            <Card
              title={`${course.courseCode} - ${course.courseName}`}
              style={{ textAlign: 'center' }} 
            >
              <Link to={`/review/${course._id}`}>
                <Button 
                  type="primary"
                  style={{
                    marginTop: '10px',
                    borderRadius: '8px', 
                    width: '100%',
                  }}
                >
                  View Reviews
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CourseReview;
