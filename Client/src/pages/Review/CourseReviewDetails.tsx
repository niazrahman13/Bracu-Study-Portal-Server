import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Button, Form, Input, Modal, Popconfirm, Typography, List, message } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/auth/authSlice';

const { Title, Paragraph } = Typography;

const CourseReviewDetails = () => {
  const { courseId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingReview, setEditingReview] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [editingComment, setEditingComment] = useState({ reviewId: null, commentId: null, text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchReviewsAndCourse = async () => {
      setLoading(true);
      try {
        const [reviewsResponse, courseResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/v1/courses/${courseId}/reviews`),
          axios.get(`http://localhost:3000/api/v1/courses/${courseId}`),
        ]);

        const filteredReviews = reviewsResponse.data.filter(review => !review.deleted);
        setReviews(filteredReviews);
        setFilteredReviews(filteredReviews); // Initialize filtered reviews
        setCourseName(courseResponse.data.courseCode);

        const commentsData = await Promise.all(filteredReviews.map(async (review) => {
          const commentsResponse = await axios.get(`http://localhost:3000/api/v1/reviews/${review._id}/comments`);
          return { [review._id]: commentsResponse.data };
        }));
        const commentsObject = Object.assign({}, ...commentsData);
        setComments(commentsObject);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndCourse();
  }, [courseId]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = reviews.filter(review => review.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredReviews(filtered);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingReview) {
        await axios.put(`http://localhost:3000/api/v1/courses/${courseId}/reviews/${editingReview._id}`, values);
      } else {
        await axios.post(`http://localhost:3000/api/v1/courses/${courseId}/reviews`, {
          ...values,
          courseId,
        });
      }

      form.resetFields();
      const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}/reviews`);
      setReviews(response.data.filter(review => !review.deleted));
      setFilteredReviews(response.data.filter(review => !review.deleted)); // Update filtered reviews
      setIsModalVisible(false);
      setEditingReview(null);
    } catch (error) {
      console.error('Error adding/editing review:', error.response ? error.response.data : error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${courseId}/reviews/${reviewId}`);
      const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}/reviews`);
      setReviews(response.data.filter(review => !review.deleted));
      setFilteredReviews(response.data.filter(review => !review.deleted)); // Update filtered reviews
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const showModal = (review = null) => {
    if (review) {
      form.setFieldsValue(review);
      setEditingReview(review);
    } else {
      form.resetFields();
      setEditingReview(null);
    }
    setIsModalVisible(true);
  };

  const handleCommentChange = (reviewId, value) => {
    setCommentText(prevComments => ({ ...prevComments, [reviewId]: value }));
  };

  const postComment = async (reviewId) => {
    if (!user?.email || !user?.name) {
      message.error('User information is missing');
      return;
    }

    const commentTextValue = commentText[reviewId]?.trim();
    if (!commentTextValue) {
      message.error('Comment cannot be empty');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/v1/reviews/${reviewId}/comments`, {
        reviewId,
        userId: user.email,
        userName: user.name,
        commentText: commentTextValue,
      });

      setCommentText(prevComments => ({ ...prevComments, [reviewId]: '' }));
      message.success('Comment posted successfully');

      const commentsResponse = await axios.get(`http://localhost:3000/api/v1/reviews/${reviewId}/comments`);
      setComments(prev => ({ ...prev, [reviewId]: commentsResponse.data }));
    } catch (error) {
      message.error('Failed to post comment');
    }
  };

  const deleteComment = async (commentId, reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/comments/${commentId}`);
      message.success('Comment deleted successfully');

      const commentsResponse = await axios.get(`http://localhost:3000/api/v1/reviews/${reviewId}/comments`);
      setComments(prev => ({ ...prev, [reviewId]: commentsResponse.data }));
    } catch (error) {
      message.error('Failed to delete comment');
    }
  };

  const startEditingComment = (reviewId, comment) => {
    setEditingComment({ reviewId, commentId: comment._id, text: comment.commentText });
    setCommentText(prev => ({ ...prev, [reviewId]: comment.commentText }));
  };

  const submitCommentEdit = async (reviewId) => {
    if (!editingComment.text.trim()) {
      message.error('Comment cannot be empty');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/comments/${editingComment.commentId}`, {
        content: editingComment.text,
      });

      const updatedComments = comments[reviewId].map(comment =>
        comment._id === editingComment.commentId
          ? { ...comment, commentText: editingComment.text }
          : comment
      );
      setComments(prev => ({ ...prev, [reviewId]: updatedComments }));
      message.success('Comment updated successfully');
      setEditingComment({ reviewId: null, commentId: null, text: '' });
    } catch (error) {
      message.error('Failed to update comment');
    }
  };

  const cancelEdit = () => {
    setEditingComment({ reviewId: null, commentId: null, text: '' });
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Course: {courseName}</Title>
      <Input
        placeholder="Search by faculty initials"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <Row gutter={16}>
        {filteredReviews.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
            <Paragraph>No reviews yet. Be the first to review!</Paragraph>
          </Col>
        ) : (
          filteredReviews.map((review) => (
            <Col span={24} key={review._id} style={{ marginBottom: '16px' }}>
              <Card>
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                  <Button onClick={() => showModal(review)}>Edit Review</Button>
                  <Popconfirm
                    title="Are you sure you want to delete this review?"
                    onConfirm={() => handleDeleteReview(review._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="danger" style={{ marginLeft: '8px' }}>Delete Review</Button>
                  </Popconfirm>
                </div>

                <p><strong>Faculty:</strong> {review.title}</p>
                <p><strong>Why recommended:</strong> {review.description}</p>
                <p><strong>How to do well:</strong> {review.howToDoWell}</p>

                <div>
                  <h3>Comments</h3>
                  {comments[review._id] && comments[review._id].length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={comments[review._id]}
                      renderItem={comment => (
                        <List.Item
                          actions={
                            comment.userName === user.name ? [
                              <>
                                <Button type="link" onClick={() => startEditingComment(review._id, comment)}>Edit</Button>
                                <Popconfirm
                                  title="Are you sure you want to delete this comment?"
                                  onConfirm={() => deleteComment(comment._id, review._id)}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button type="link" danger>Delete</Button>
                                </Popconfirm>
                              </>
                            ] : []
                          }
                        >
                          <List.Item.Meta
                            title={comment.userName}
                            description={editingComment.commentId === comment._id ? (
                              <>
                                <Input.TextArea
                                  value={editingComment.text}
                                  onChange={(e) => setEditingComment(prev => ({ ...prev, text: e.target.value }))}
                                />
                                <Button type="primary" onClick={() => submitCommentEdit(review._id)}>Save</Button>
                                <Button type="link" onClick={cancelEdit}>Cancel</Button>
                              </>
                            ) : (
                              comment.commentText
                            )}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Paragraph>No comments yet.</Paragraph>
                  )}
                  <Input.TextArea
                    value={commentText[review._id] || ''}
                    onChange={(e) => handleCommentChange(review._id, e.target.value)}
                    placeholder="Write a comment..."
                    rows={4}
                    style={{ marginTop: '10px' }}
                  />
                  <Button type="primary" onClick={() => postComment(review._id)} style={{ marginTop: '10px' }}>Post Comment</Button>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Button type="primary" onClick={() => showModal()}>Add Review</Button>
      <Modal
        title={editingReview ? 'Edit Review' : 'Add Review'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="title" label="Faculty" rules={[{ required: true, message: 'Please input the faculty name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Why Recommended" rules={[{ required: true, message: 'Please input why this faculty is recommended!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="howToDoWell" label="How to Do Well" rules={[{ required: true, message: 'Please input how to do well!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{editingReview ? 'Update' : 'Submit'}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseReviewDetails;
