import { useParams, useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography, List } from 'antd'; // Import List from antd
import { courses } from './CourseData';

const { Title } = Typography;

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find(course => course.id == parseInt(id || ''));

  if (!course) return <div>Course not found</div>;

  return (
    <div style={{ padding: '24px' }}>
      {/* Show course details */}
      <Title level={2}>Course: {course.courseName}</Title>

      {/* Display playlist cards */}
      <Row gutter={16}>
        {course.playlistUrls.map((playlist) => (
          <Col 
            xs={24} 
            sm={12} 
            md={8} 
            lg={6} 
            xl={5} 
            key={playlist.url}
          >
            <Card
              hoverable
              cover={
                <img
                  alt="playlist"
                  style={{ width: '100%', height: 'auto' }}
                  src={`https://img.youtube.com/vi/${new URL(playlist.url).searchParams.get('list')}/default.jpg`}
                />
              }
              onClick={() => navigate(`/playlist/${encodeURIComponent(playlist.url)}`)}
            >
              <Card.Meta
                title={playlist.name}
                description="Click to view playlist"
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Display course materials */}
      <div style={{ marginTop: '24px' }}>
        <Title level={3}>Course Materials</Title>
        <List
          bordered
          dataSource={course.materials} // Use materials from course
          renderItem={item => (
            <List.Item>
              <a href={item} target="_blank" rel="">
                {item} {/* Display the URL or provide custom text */}
              </a>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Course;
