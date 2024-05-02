# React TypeScript App - Development Setup

This guide provides instructions to set up and run a React TypeScript application in development mode.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)

## Project Setup

1. **Clone the Repository**

   - If you haven't already, clone the repository to your local machine:

     ```bash
     git clone git@github.com:asraf3101aa/ASP.NET-Blog.git
     ```

2. **Install Dependencies**

   - Navigate to the project folder, and checkout to `feat/blog-app` branch and install the required dependencies:

     ```bash
     cd ASP.NET-Blog
     git checkout feat/blog-app
     npm install
     ```

3. **Set Environment Variables**

   - Create a `.env` file in the project root and copy the contents from `env.example` into it.
   - Adjust the environment variables if necessary for your setup.

4. **Run the Application in Development Mode**

   - Start the development server:

     ```bash
     npm run dev
     ```

   - This will launch the app on a local development server `http://localhost:3000`.
