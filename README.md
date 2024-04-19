# Store management

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Docker
- Node.js >=18
- pnpm or npm

<br>

### Installation

1. Run the following command to start the Docker containers:

   ```
   docker-compose up -d --build
   ```
   This command will build and start the project's Docker containers in detached mode.

2. Start the development server using pnpm:
  
    ```
      pnpm start:dev
    ```
   This command will start the development server for the project.


<br>

### Api Doc
for api documentation visit <strong>http://localhost:3000/api</strong>

<br>
After following the installation steps, you can access the project api at <strong>http://localhost:3000/api/v1</strong>. Use the following credentials to log in as the default admin user:

- <strong>Email</strong>: admin@gmail.com
- <strong>Password</strong>: 123456