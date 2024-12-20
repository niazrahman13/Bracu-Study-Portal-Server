import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, message, Input, Empty, Modal, List } from 'antd';
import axios from 'axios';
import { selectUser } from '../../redux/features/auth/authSlice'; // Adjust the path as needed

interface Comment {
  _id: string;
  userName: string;
  commentText: string;
}

interface Issue {
  _id: string;
  courseName: string;
  description: string;
  resolved: boolean;
  createdBy: {
    userName: string;
    userId: string;
  };
  comments: Comment[];
}

const Forum: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<{ [issueId: string]: Comment[] }>({});
  const [commentText, setCommentText] = useState<{ [issueId: string]: string }>({});
  const [editingComment, setEditingComment] = useState<{ [commentId: string]: string }>({});
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchIssues(); // Fetch issues when the component mounts
  }, []);

  // Fetch all issues from the backend
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/issues');
      setIssues(response.data);

      // Fetch comments for each issue
      const commentsData: { [issueId: string]: Comment[] } = {};
      for (const issue of response.data) {
        const commentsResponse = await axios.get(`http://localhost:3000/api/v1/comments/${issue._id}`);
        commentsData[issue._id] = commentsResponse.data;
      }
      setComments(commentsData);
    } catch (err) {
      message.error('Failed to fetch issues or comments');
    } finally {
      setLoading(false);
    }
  };

  // Handle comment input change
  const handleCommentChange = (issueId: string, value: string) => {
    setCommentText((prevComments) => ({ ...prevComments, [issueId]: value }));
  };

  // Post a comment to an issue
  const postComment = async (issueId: string) => {
    if (!user || !user.email || !user.name) {
      message.error('User information is missing');
      return;
    }

    const commentTextValue = commentText[issueId]?.trim();
    if (!commentTextValue) {
      message.error('Comment cannot be empty');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/v1/comments', {
        issueId,
        userId: user.email,
        userName: user.name,
        commentText: commentTextValue,
      });

      setCommentText((prevComments) => ({ ...prevComments, [issueId]: '' }));
      message.success('Comment posted successfully');
      fetchIssues(); // Refresh issues and comments to show the new comment
    } catch (error) {
      message.error('Failed to post comment');
    }
  };

  // Edit a comment
  const editComment = async (commentId: string, issueId: string) => {
    const newCommentText = editingComment[commentId];
    if (!newCommentText) {
      message.error('Comment text cannot be empty');
      return;
    }
  
    try {
      // Send PUT request to update comment
      await axios.post('http://localhost:3000/api/v1/comments/edit', {
        commentId,
        newCommentText,
      });
      message.success('Comment updated successfully');
      setEditingComment((prev) => ({ ...prev, [commentId]: '' }));
      fetchIssues(); // Refresh issues and comments
    } catch (error) {
      console.error('Failed to update comment:', error); // Log error for debugging
      message.error('Failed to update comment');
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action will delete the comment.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/api/v1/comments/delete/${commentId}`); // Pass commentId in URL
          message.success('Comment deleted successfully');
          fetchIssues(); // Refresh issues and comments
        } catch (error) {
          message.error('Failed to delete comment');
        }
      },
    });
  };

  // Resolve an issue
  const resolveIssue = async (issueId: string) => {
    if (!user) {
      message.error('User not logged in');
      return;
    }

    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action will mark the issue as resolved.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.post('http://localhost:3000/api/v1/issues/resolve', {
            issueId,
            userId: user.email,
          });
          message.success('Issue resolved');
          fetchIssues(); // Refresh issues after resolving
        } catch (error) {
          message.error('Failed to resolve issue');
        }
      },
    });
  };

  if (loading) {
    return <p>Loading issues...</p>;
  }

  return (
    <div style={{ padding: '20px', background: '#f0f2f5' }}>
      <h2>Forum</h2>
      {issues.length > 0 ? (
        issues.map((issue) => (
          <Card
            key={issue._id}
            title={<span style={{ fontWeight: 'bold', fontSize: '18px' }}>Course: {issue.courseName}</span>}
            style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            {/* Problem Description Section */}
            <div style={{ marginBottom: '20px' }}>
              <h3>Problem Description</h3>
              <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#555' }}>
                {issue.description}
              </p>
            </div>

            {/* Comments Section */}
            <div>
              <h3>Comments</h3>
              {comments[issue._id] && comments[issue._id].length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={comments[issue._id]}
                  renderItem={comment => (
                    <List.Item
                      actions={
                        comment.userName === user.name ? [
                          <Button
                            type="link"
                            onClick={() => setEditingComment((prev) => ({ ...prev, [comment._id]: comment.commentText }))}
                          >
                            Edit
                          </Button>,
                          <Button
                            type="link"
                            danger
                            onClick={() => deleteComment(comment._id)}
                          >
                            Delete
                          </Button>,
                        ] : []
                      }
                    >
                      {editingComment[comment._id] ? (
                        <>
                          <Input.TextArea
                            rows={2}
                            defaultValue={comment.commentText}
                            onChange={(e) => setEditingComment((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                          />
                          <Button
                            onClick={() => editComment(comment._id, issue._id)}
                            type="primary"
                            style={{ marginTop: '5px' }}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <List.Item.Meta
                          title={<strong>{comment.userName}</strong>}
                          description={comment.commentText}
                        />
                      )}
                    </List.Item>
                  )}
                />
              ) : (
                <p>No comments yet</p>
              )}

              <Input.TextArea
                rows={3}
                value={commentText[issue._id] || ''}
                onChange={(e) => handleCommentChange(issue._id, e.target.value)}
                placeholder="Add your comment"
              />
              <Button
                onClick={() => postComment(issue._id)}
                type="primary"
                style={{ marginTop: '10px' }}
              >
                Comment
              </Button>
            </div>

            {/* Resolve Button */}
            {!issue.resolved && issue.createdBy.userId === user.email && (
              <Button
                type="danger"
                style={{ marginTop: '10px' }}
                onClick={() => resolveIssue(issue._id)}
              >
                Mark as Resolved
              </Button>
            )}
          </Card>
        ))
      ) : (
        <Empty description="No issues available" />
      )}
    </div>
  );
};

export default Forum;
