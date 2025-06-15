# Mohit Kedia & Associates Website

This is the official website for Mohit Kedia & Associates, featuring a blog system that automatically converts Word documents to web pages.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3001
MONGO_URL=your_mongodb_connection_string
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

3. Start the server:
```bash
node server.js
```

## Blog System

The blog system automatically converts Word documents (.docx) to web pages. To add a new blog post:

1. Place your .docx file in the `blog/documents/` folder
2. The system will automatically:
   - Convert it to markdown
   - Convert the markdown to HTML
   - Make it available on the blog page

## Directory Structure

- `blog/documents/`: Place your .docx files here
- `blog/markdown/`: Contains converted markdown files
- `blog/html/`: Contains the final HTML files
- `public/`: Contains static assets (CSS, images, etc.)

## Technologies Used

- Node.js
- Express
- MongoDB
- Mammoth (for docx to markdown conversion)
- Marked (for markdown to HTML conversion)
- Chokidar (for file watching) 