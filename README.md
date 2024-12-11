# File Management API

## Overview

This project is a File Management API built using Node.js, Express, MongoDB, and Redis. It provides functionality for user authentication, file management (uploading, retrieving, and managing files and folders), and background processing using Bull for tasks such as generating thumbnails for images and sending welcome emails to new users.

## Features

- User authentication with token-based sessions.
- File management including upload, retrieval, and folder management.
- Background processing for generating thumbnails for image files.
- Background processing for sending welcome emails to new users.
- RESTful API endpoints.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and file data.
- **Redis**: In-memory data structure store for session management and background job processing.
- **Bull**: Node library for handling background jobs.
- **Mongoose**: ODM for MongoDB.
- **SHA1**: Hashing algorithm for password storage.
- **Mime-types**: Library for determining MIME types.
- **Image-thumbnail**: Library for generating image thumbnails.

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables. Create a `.env` file in the root directory and add the following variables:
    ```
    PORT=5000
    MONGO_URI=<your-mongodb-uri>
    REDIS_HOST=<your-redis-host>
    REDIS_PORT=<your-redis-port>
    FOLDER_PATH=/tmp/files_manager
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### User Endpoints

- **POST /users**: Create a new user.
- **GET /connect**: Sign-in the user and generate an authentication token.
- **GET /disconnect**: Sign-out the user based on the token.
- **GET /users/me**: Retrieve the authenticated user's information.

### File Endpoints

- **POST /files**: Upload a new file or create a new folder.
- **GET /files/:id**: Retrieve a file document by ID.
- **GET /files**: Retrieve all user file documents for a specific parentId with pagination.
- **PUT /files/:id/publish**: Set a file document to public.
- **PUT /files/:id/unpublish**: Set a file document to private.
- **GET /files/:id/data**: Retrieve the content of a file by ID, with support for size query parameter for thumbnails.

### System Endpoints

- **GET /status**: Check the status of Redis and MongoDB.
- **GET /stats**: Get the number of users and files in the database.

## Background Processing

### Thumbnail Generation

When an image file is uploaded, a background job is created to generate thumbnails in three sizes: 500, 250, and 100 pixels wide. These thumbnails are saved in the same location as the original file.

### Welcome Emails

When a new user is created, a background job is created to send a welcome email to the user.

## Running Tests

1. To run tests, execute the following command:
    ```bash
    npm test
    ```

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

