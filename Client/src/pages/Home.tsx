import { Typography } from 'antd';


const { Title } = Typography;

const Home = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '40px' }}>
        Welcome to the Study Portal
      </Title>
      <p style={{ textAlign: 'center', fontSize: '18px', marginBottom: '40px' }}>
        Discover a variety of courses and educational materials tailored for you.
      </p>

    </div>
  );
};

export default Home;
