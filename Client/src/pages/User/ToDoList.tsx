import React, { useState } from 'react';
import { Input, Button, List, Typography, Checkbox, Row, Col, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Title } = Typography;

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const generateId = () => `${Math.random().toString(36).substr(2, 9)}`;

const TodoList: React.FC = () => {
  const [task, setTask] = useState<string>('');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTask = () => {
    if (task.trim()) {
      setTodos([...todos, { id: generateId(), text: task, completed: false }]);
      setTask('');
      message.success('Task added!');
    } else {
      message.error('Please enter a task.');
    }
  };

  const deleteTask = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    message.success('Task deleted!');
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedTodos = [...todos];
    const [removed] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, removed);

    setTodos(reorderedTodos);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <Title level={3}>Fancy To-Do List</Title>
      <Row gutter={16}>
        <Col span={18}>
          <Input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Add a new task"
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={addTask} block>
            Add Task
          </Button>
        </Col>
      </Row>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todo-list">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ marginTop: '20px' }}
              bordered
              dataSource={todos}
              renderItem={(todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <List.Item
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{
                        ...provided.draggableProps.style,
                        background: todo.completed ? '#f6ffed' : 'white',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                      >
                        {todo.text}
                      </Checkbox>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteTask(todo.id)}
                      />
                    </List.Item>
                  )}
                </Draggable>
              )}
              footer={<div>{todos.length === 0 && 'No tasks added yet.'}</div>}
            >
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
