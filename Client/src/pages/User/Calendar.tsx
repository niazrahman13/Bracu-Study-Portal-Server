// src/pages/Calendar.tsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Calendar styles
import { Button, Modal, Input, List } from 'antd';
import moment from 'moment';
import './Calendar.css'; // Custom styles for events

interface Event {
  date: Date;
  description: string;
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newEventDescription, setNewEventDescription] = useState<string>('');

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleAddEvent = () => {
    if (newEventDescription.trim()) {
      setEvents([
        ...events,
        { date, description: newEventDescription },
      ]);
      setNewEventDescription('');
      setIsModalVisible(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const filteredEvents = events.filter(event =>
    moment(event.date).isSame(date, 'day')
  );

  return (
    <div style={{ padding: '24px' }}>
      <h1>Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const hasEvent = events.some(event =>
              moment(event.date).isSame(date, 'day')
            );
            return hasEvent ? 'has-event' : '';
          }
          return '';
        }}
      />

      <Button
        type="primary"
        style={{ marginTop: '16px' }}
        onClick={handleOpenModal}
      >
        Add Event
      </Button>

      <div style={{ marginTop: '24px' }}>
        <h2>Events on {moment(date).format('MMMM D, YYYY')}</h2>
        <List
          bordered
          dataSource={filteredEvents}
          renderItem={item => (
            <List.Item>
              {item.description}
            </List.Item>
          )}
        />
      </div>

      <Modal
        title="Add Event"
        visible={isModalVisible}
        onOk={handleAddEvent}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Event description"
          value={newEventDescription}
          onChange={(e) => setNewEventDescription(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default CalendarPage;
