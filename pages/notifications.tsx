import React, { useEffect, useState } from 'react';

interface Notification {
  title: string;
  message: string;
  status: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socket = new WebSocket('wss://swankify.onrender.com/');

    socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
    });

    socket.addEventListener('message', (event) => {
      // Handle incoming messages from the server
      const message = event.data;
      console.log('Received from server:', message);

      try {
        // Parse the received JSON string into a JavaScript object
        const parsedNotification = JSON.parse(message);

        setNotifications((prevNotifications) => {
          const existingNotification = prevNotifications.find(
            (notification) => notification.title === parsedNotification.title
          );

          if (existingNotification) {
            // If the notification exists, update its properties
            return prevNotifications.map((notification) =>
              notification.title === parsedNotification.title
                ? {
                    ...notification,
                    message: parsedNotification.message,
                    status: parsedNotification.status,
                  }
                : notification
            );
          } else {
            // If the notification doesn't exist, create a new notification object
            const newNotification: Notification = {
              title: parsedNotification.title,
              message: parsedNotification.message,
              status: parsedNotification.status,
            };

            // Add the new notification to the notifications list
            return [...prevNotifications, newNotification];
          }
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.close(); // Close the WebSocket connection when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <strong>{notification.title}</strong>
            <br />
            {notification.message}
            <br />
            <em>{notification.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
