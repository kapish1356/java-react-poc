# Java + React POC: Employee Management

A small proof-of-concept project with a **React (Vite) frontend** and a **Java Spring Boot REST API**. The UI supports listing, searching, adding, editing, and deleting employees.

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ and npm

## Project structure
```text
java-react-poc/
├── backend/                 # Java 17, Spring Boot, REST API, H2 database
│   ├── pom.xml
│   └── src/main/java/com/example/poc/
└── frontend/                # React + Vite
    ├── package.json
    ├── index.html
    └── src/
```

## Run the backend
Open a terminal in `backend/`:

```bash
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.
- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`

H2 is in-memory, so demo data resets when the application restarts. The H2 console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:pocdb`, username: `sa`, password is blank).

## Run the frontend
Open a second terminal in `frontend/`:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

The frontend calls the backend at `http://localhost:8080`. Start the backend first.

## Notes
- This is a POC, not production-hardened.
- Validation and error messages are intentionally lightweight.
- CORS is enabled for the local Vite development server.
