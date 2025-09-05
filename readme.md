Blogingme Frontend
This is the user-facing application for the Blogingme platform. It's a dynamic single-page application (SPA) built with React, designed to provide a fast, responsive, and engaging experience for both readers and authors.

Technology Stack
The frontend is built with a modern component-based architecture:

React: The foundation of the user interface.

Vite: A lightning-fast build tool that provides a rapid development environment.

React Router: Manages navigation and client-side routing, making the app feel seamless.

TanStack Query: Handles all server-state management, caching, and data fetching, eliminating the need for complex state management for asynchronous data.

Clerk React: Provides pre-built components and hooks for handling user authentication and state.

Axios: The HTTP client used for all API requests to the backend.

Tailwind CSS: A utility-first CSS framework that allows for efficient and customizable styling.

Key Features
Single-Page Application (SPA): Enables smooth and fast transitions between pages without full browser reloads.

Dynamic Data Loading: Uses react-query to fetch and cache data from the backend, providing a responsive experience.

Author Profile Pages: Displays an author's posts, their bio, and, for logged-in users, the ability to subscribe to that author.

Post Analytics: The AuthorsPostAnalytics component provides insights into post performance for the author.

Social Sharing: Integrated components allow users to easily share posts on social media.

Responsive Design: The UI is designed to look great and be fully functional on a variety of devices, from desktops to mobile phones.

The components folder contains reusable UI building blocks that are likely used across different pages. This modular structure makes your code organized and easier to maintain.

AuthorsPostAnalytics.jsx: Displays analytics or statistics related to an author's posts.

Comments.jsx: Handles the display and submission of comments on a post.

DraftsDashboard.jsx: Manages a dashboard for viewing and editing draft blog posts.

Image.jsx: A component for handling image rendering, possibly with optimizations or lazy loading.

Postlists.jsx: Renders a collection of posts, likely used to display blog posts on various pages.

Sidemenu.jsx: The sidebar navigation menu, which might contain filters, search, or user options.

SocialShare.jsx: Provides buttons or links for sharing a post on social media.

Upload.jsx: A component for handling file uploads, likely for images as we discussed with ImageKit.

UserSubscribe.jsx: A component that allows users to subscribe to an author.

Pages Folder
The pages folder contains the main, top-level components that represent a full page or view in your application.  These are the components that your router uses to navigate to different URLs.

AuthorsPage.jsx: The profile page for an author, displaying their bio and posts.

Blogpage.jsx: The main blog page, likely showing a feed of all blog posts.

ContentWrite.jsx: A page where a user can create or edit new blog posts.

Homepage.jsx: The main landing page of your application.
LoginPage.jsx: This is the component for the user login page, likely containing a form for users to enter their credentials. It is part of the Clerk authentication flow.

PostlistsPage.jsx: This page probably displays a feed of multiple blog posts, allowing users to browse and discover content.

RegisterPage.jsx: The component for the user registration page, which allows new users to create an account. This is also part of your Clerk implementation.

Singlepost.jsx: This page is a dedicated view for a single, full-length blog post. It's where users read the complete content and interact with components like the comments section and social share buttons.

Wrappers
The wrappers folder contains components that are used to structure the layout or provide shared functionality across multiple pages.

Navbar.jsx: This component represents the navigation bar, which likely appears at the top of most, if not all, pages. It provides consistent navigation links, such as links to the homepage, user profile, or login/logout buttons. It acts as a wrapper for your page content, ensuring a consistent user experience.