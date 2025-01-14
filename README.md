Here is the frontend documentation for your GitHub `README.md`:

---

# EventEase Platform - Frontend

## Overview

EventEase is a platform for managing events and attendees, featuring user authentication, event management, and real-time updates. The frontend of the platform is built using **Next.js** and **Tailwind CSS** for styling, providing a responsive, user-friendly experience for interacting with events.

The platform allows users to register for events, view event details, and receive real-time notifications when there are updates to the events they are interested in.

## Features

- **User Authentication**:
  - User registration and login pages built using Next.js.
  - Persistent user session and personalized content based on the authenticated user.

- **Event Dashboard**:
  - A page displaying a list of events with a form for creating and registering for events.

- **Real-Time Notifications**:
  - Real-time updates when a new attendee registers for an event or when an event reaches its maximum capacity.

- **Responsive Design**:
  - Tailwind CSS is used to ensure that the frontend is responsive across different devices.

## Deployment

The frontend is deployed and available at:

- **Live URL**: [https://event-ease-next.vercel.app/](https://event-ease-next.vercel.app/)

You can view the platform live, interact with the events, and sign up or log in as a user.

## Prerequisites

Before running this project locally, ensure that you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/eventease-next.git
   cd eventease-next
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:

   ```env
   NEXT_PUBLIC_API_URL=<your-backend-api-url>
   ```

   Replace `<your-backend-api-url>` with the backend API URL (e.g., `https://event-ease-backend-nroz.onrender.com`).

4. To run the development server:

   ```bash
   npm run dev
   ```

   The server will start at [http://localhost:3000](http://localhost:3000).

## Pages and Components

### 1. **Login Page**
   - **URL**: `/login`
   - **Purpose**: Allows users to log in using their email and password.
   - **Components**:
     - Login form with fields for email and password.
     - Submit button to trigger the login action.
   - **Real-Time Updates**: After login, the user is redirected to the Event Dashboard page if authentication is successful.

### 2. **Signup Page**
   - **URL**: `/signup`
   - **Purpose**: Allows users to register a new account.
   - **Components**:
     - Signup form with fields for email, password, and password confirmation.
     - Submit button to trigger the signup action.
   - **Real-Time Updates**: After successful registration, users are redirected to the login page to sign in.

### 3. **Event Dashboard**
   - **URL**: `/dashboard`
   - **Purpose**: Displays a list of events and allows authenticated users to create new events and register for existing events.
   - **Components**:
     - List of events with details like name, date, location, and number of attendees.
     - Form to create new events, including fields for name, date, location, and max attendees.
     - Registration buttons for each event to allow users to register if they are authenticated.
   - **Real-Time Updates**: Displays updates when:
     - A new attendee registers for an event.
     - An event reaches its maximum capacity.

### 4. **Event Registration**
   - **URL**: `/register/:id`
   - **Purpose**: Allows users to register for a specific event.
   - **Components**:
     - Registration button to confirm user attendance.
     - Event details like name, date, and location.

### 5. **Real-Time Notifications**
   - Real-time notifications are displayed in the UI whenever there is an update on the event, such as:
     - A new attendee registers.
     - An event reaches its full capacity or its details are updated.

   - **Implementation**: Socket.IO is used to listen for real-time updates and show notifications dynamically.

---

## Components Overview

### **EventCard Component**
   - **Purpose**: Displays an individual event with its details (name, date, location, attendees).
   - **Usage**: Used in the event list on the Dashboard page to display all events.
   - **Props**:
     - `event`: An object containing event details (name, date, location, max attendees, etc.).

### **EventForm Component**
   - **Purpose**: A form for creating a new event.
   - **Usage**: Located in the Dashboard page to allow users to create events.
   - **Props**:
     - `onSubmit`: A function to handle the form submission and event creation.

### **AuthContext**
   - **Purpose**: Manages the user authentication state across the application.
   - **Usage**: Provides methods to log in, log out, and store the user session.

---

## Real-Time Notifications with Socket.IO

The frontend uses **Socket.IO** to listen for real-time updates from the backend. The following events are broadcasted and displayed:

- **attendee-registered**: This event is triggered when a new attendee registers for an event.
- **event-full**: This event is triggered when an event reaches its maximum capacity.
- **event-updated**: This event is triggered when an event’s details are updated.

```js
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL);

socket.on('attendee-registered', (data) => {
  // Handle real-time update when a new attendee registers.
});

socket.on('event-full', (data) => {
  // Handle real-time update when an event is full.
});

socket.on('event-updated', (data) => {
  // Handle real-time update when event details are updated.
});
```

---

## Running Tests

To run tests for the frontend:

1. Install testing dependencies:

   ```bash
   npm install --save-dev jest @testing-library/react
   ```

2. Run tests:

   ```bash
   npm run test
   ```

---

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Open a pull request with a clear description of your changes.

---

## License

MIT License. See [LICENSE](./LICENSE) for more details.

---

## Acknowledgments

- **Next.js** for building the frontend.
- **Tailwind CSS** for styling.
- **Socket.IO** for real-time communication.

---

This README includes the live URL for the deployed frontend, setup instructions, feature descriptions, and details on the components and real-time functionality.