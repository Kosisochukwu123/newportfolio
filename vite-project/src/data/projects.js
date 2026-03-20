export const projects = [
  {
    id: 1,
    title: "DevConnect",
    subtitle: "Social Platform for Developers",
    description:
      "A full-featured social network built for developers — create profiles, share posts, follow other devs, and connect in real time.",
    image: null, // replace with image path e.g. "/projects/devconnect.png"
    tags: ["React", "Node.js", "MongoDB", "Express", "Socket.io", "JWT"],
    live: "https://your-live-link.com",
    github: "https://github.com/yourusername/devconnect",
    year: "2024",
    faqs: [
      {
        q: "What authentication system does this use?",
        a: "JWT-based authentication with refresh token rotation. Passwords are hashed with bcrypt (12 rounds). Tokens are stored in httpOnly cookies to prevent XSS attacks.",
      },
      {
        q: "How is real-time messaging implemented?",
        a: "Socket.io handles bidirectional communication. Each user joins a personal room on connection, enabling direct messages and live notification delivery without polling.",
      },
      {
        q: "What's the database structure?",
        a: "MongoDB with Mongoose. Users, Posts, and Connections are separate collections. I used aggregation pipelines for the feed algorithm to prioritise posts from followed users.",
      },
      {
        q: "How is the app deployed?",
        a: "Frontend on Vercel with automatic CI/CD from GitHub. Backend on an AWS EC2 instance behind an Nginx reverse proxy with SSL via Let's Encrypt. Images stored in S3.",
      },
    ],
  },
  {
    id: 2,
    title: "ShopStack",
    subtitle: "E-Commerce Platform",
    description:
      "A production-ready e-commerce solution with product management, cart/checkout, Stripe payments, and an admin dashboard for order management.",
    image: null,
    tags: ["React", "Redux", "Node.js", "MongoDB", "Stripe API", "Cloudinary"],
    live: "https://your-live-link.com",
    github: "https://github.com/yourusername/shopstack",
    year: "2024",
    faqs: [
      {
        q: "How are payments processed?",
        a: "Stripe Checkout handles all payment flows. Payment intents are created server-side to keep the secret key secure. Webhooks verify payment completion before fulfilling orders.",
      },
      {
        q: "How does the admin dashboard work?",
        a: "A protected /admin route (role-based access via JWT claims) gives admins a real-time view of orders, inventory, and revenue charts built with Recharts.",
      },
      {
        q: "Where are product images stored?",
        a: "Images are uploaded to Cloudinary via a Node.js middleware that handles compression and format optimisation. Only the returned CDN URL is stored in MongoDB.",
      },
      {
        q: "How is cart state managed?",
        a: "Redux Toolkit manages cart state on the client. For authenticated users, cart is also persisted to the database so it survives page refreshes and cross-device access.",
      },
    ],
  },
  {
    id: 3,
    title: "TaskFlow",
    subtitle: "Project Management Tool",
    description:
      "A Trello-inspired project management app with drag-and-drop boards, team collaboration, deadline tracking, and role-based permissions.",
    image: null,
    tags: ["React", "DnD Kit", "Node.js", "MongoDB", "Express", "WebSockets"],
    live: "https://your-live-link.com",
    github: "https://github.com/yourusername/taskflow",
    year: "2023",
    faqs: [
      {
        q: "How does drag-and-drop work?",
        a: "@dnd-kit/core powers the drag-and-drop. Card positions are stored as fractional indices in MongoDB, allowing re-ordering without shifting the entire array in the database.",
      },
      {
        q: "How are team permissions handled?",
        a: "Projects have Owner, Admin, and Member roles. Middleware checks the requesting user's role against the project document before allowing destructive operations.",
      },
      {
        q: "Are updates reflected in real time for teammates?",
        a: "Yes — every board change broadcasts a Socket.io event to all connected users in that workspace room. The frontend merges incoming updates into the Redux state.",
      },
    ],
  },
];
