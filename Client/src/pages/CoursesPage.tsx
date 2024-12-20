import { Card, Col, Row, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { courses } from './CourseData'; // Import courses

const { Title } = Typography;

const CoursesPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Available Courses
      </Title>
      <Row gutter={[24, 24]} justify="center">
        {courses.map((course :any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={course.courseName}
                  src={course.image}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              }
              actions={[
                <Link to={`/course/${course.id}`} key="view">
                  <Button type="primary" block>
                    View Course
                  </Button>
                </Link>,
              ]}
              style={{ borderRadius: '8px', overflow: 'hidden' }}
            >
              <Card.Meta
                title={`${course.courseCode} - ${course.courseName}`}
                description={course.description}
                style={{ textAlign: 'center' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CoursesPage;
