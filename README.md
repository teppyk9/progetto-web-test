# Artigianato Online Project

This project is a web application for an online marketplace for artisans.

## Setup

### Prerequisites

*   Node.js (version specified in `package.json` or latest LTS)
*   PostgreSQL

### Database Setup

1.  **Create a PostgreSQL database:**
    *   You'll need a running PostgreSQL server.
    *   Create a new database for this project (e.g., `artigianato_online_db`).

2.  **Create a `.env` file:**
    *   In the root directory of the project, create a new file named `.env`.
    *   This file will store your database connection credentials and other sensitive information.

3.  **Populate the `.env` file:**
    *   Add the following environment variables to your `.env` file, replacing the placeholder values with your actual database credentials:

    ```env
    # PostgreSQL Credentials
    DB_USER=your_db_user
    DB_HOST=localhost
    DB_DATABASE=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=5432

    # Application Port (Optional, defaults to 3000 if not set)
    # PORT=3000
    ```

    *   **`DB_USER`**: Your PostgreSQL username.
    *   **`DB_HOST`**: The hostname of your PostgreSQL server (usually `localhost`).
    *   **`DB_DATABASE`**: The name of the database you created in step 1.
    *   **`DB_PASSWORD`**: The password for your PostgreSQL user.
    *   **`DB_PORT`**: The port your PostgreSQL server is running on (default is `5432`).

4.  **Initialize the database schema:**
    *   Connect to your PostgreSQL database using a tool like `psql` or a GUI client.
    *   Run the SQL commands in the `schema.sql` file located in the project root to create the necessary tables.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3000` (or the port specified in your `.env` file).

## Project Structure (Overview)

*   **`.env`**: Stores environment variables (database credentials, etc.). **DO NOT COMMIT THIS FILE.**
*   **`config/db.js`**: Configures the database connection using Sequelize.
*   **`models/`**: Contains Sequelize models for database tables.
*   **`public/`**: Static assets (HTML, CSS, client-side JavaScript).
*   **`routes/`**: Defines API routes.
*   **`schema.sql`**: SQL script for creating the database schema.
*   **`server.js`**: The main entry point for the Node.js application.
*   **`package.json`**: Lists project dependencies and scripts.
*   **`README.md`**: This file.

## Contributing

(Add guidelines for contributing if this were an open project).

## License

(Specify a license if applicable).
