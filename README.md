# TODO API

The TODO API is a RESTful API that allows users to manage their to-do lists. It provides endpoints for user registration and login, visualization, creation, modification, and closure of TODO items.

The user information is stored in a MongoDB database and is encrypted with bcrypt. Tokens are used for authorization of access to the TODO features. The API uses the Joi library for validation of the request bodies, and the jsonwebtoken library for token creation and verification.

## Authentication Middleware

The API uses a middleware function to authenticate requests that require authentication. The middleware function extracts the JWT from the request headers and verifies it using a secret key stored in the environment variables. If the JWT is valid, the request is passed to the next middleware function or route handler. If the JWT is invalid, the function returns a 401 status code and an error message.

Authentication is required to use this API. Requests must include an access token in the `Authorization` header to access all routes except registration and login routes.

## Environment Variables (.env)

Create a `.env` file in the root directory and add the following variables:

```ini
# MongoDB connection
DATABASE_URL="your_mongodb_database_url"
DATABASE_NAME="your_mongodb_database_name"

# JWT Token Secret
TOKEN_SECRET="your_jwt_token_secret"

# PostgreSQL connection
POSTGRES_DATABASE_URL="your_postgres_database_url"
```

**Important:** Add `.env` to your `.gitignore` file to keep sensitive data secure.

### How to get a secret token?
You can generate a JWT secret at [jwtsecret.com](https://jwtsecret.com/generate).

### How to get a MongoDB database? 
Sign up and create a database at [MongoDB Atlas](https://cloud.mongodb.com/).

### How to set up a PostgreSQL database using Podman?
Ensure you have [Podman installed](https://podman.io/getting-started/installation).  
Then, run the following command:

```sh
podman run -d \
  --name my_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  docker.io/library/postgres:latest
```

This will:
- Start a PostgreSQL container named `my_postgres`
- Use `postgres` as the default user, password, and database
- Expose the database on port `5432`
- Persist data in a named volume (`postgres_data`) to avoid losing data when restarting the container

To stop and remove the database container later:

```sh
podman stop my_postgres
podman rm my_postgres
podman volume rm postgres_data
```
### Viewing PostgreSQL Data with pgAdmin  

To easily manage and explore your PostgreSQL database, you can use **pgAdmin**, a graphical tool.  

#### **Installation**  
- **Windows & macOS**: Download from [pgAdmin.org](https://www.pgadmin.org/download/).  
- **Linux (Ubuntu/Debian)**: Install via APT:  
  ```sh
  sudo apt update && sudo apt install pgadmin4
  ```
- **Linux (Fedora/RHEL)**: Install via DNF:  
  ```sh
  sudo dnf install pgadmin4
  ```

#### **Connect to Your PostgreSQL Database**  
1. Open **pgAdmin** and click **Add New Server**.  
2. Under the **General** tab, set a name (e.g., "Postgres DB").  
3. In the **Connection** tab:  
   - **Host**: `localhost`  
   - **Port**: `5432`  
   - **Username**: `postgres`  
   - **Password**: `postgres` (or your custom password)  
4. Click **Save**, then navigate to your database to explore tables, run queries, and manage data visually!  

**Tip**: If pgAdmin fails to connect, ensure your PostgreSQL container is running.


## API Endpoints

### `POST /api/register`

Creates a new user and saves it to the database.

#### Body Parameters

- `email` (required): An unique e-mail with minimum of 6 and maximum of 255 characters.
- `password` (required): String with minimum of 6 and maximum of 255 characters.

#### Response

The endpoint returns a 201 status code with a message if the user is successfully registered.

The endpoint returns an error message if the email is invalid or if it has already been used, or if there was an error on the server.

```json
{
  "message": "User created successfully."
}
```

### `POST /api/login`

Verifies user credentials and returns a JWT token for authorization.

#### Body Parameters

- `email` (required): An unique e-mail with minimum of 6 and maximum of 255 characters.
- `password` (required): String with minimum of 6 and maximum of 255 characters.

#### Response

The endpoint returns a 200 status code, a message of request succeeded and the JSON Web Token (JWT) that can be used to authenticate further requests.

If any error occur, such as incorrect password or non-existent user, an error message will be returned.

```json
{
  "message": "You are successfully logged in.",
  "token": "user_token"
}
```

### `POST /api/TODO/create`

Creates a new TODO item.

#### Body Parameters

- `description` (required): Unique and not null string.
- `deadline` (required): Valid date in ISO format.
- `statusconclusion` (optional): Boolean.

#### Response

The endpoint returns a 201 status code if the TODO item is successfully created, or an error message if the description is not unique, the deadline is not a valid date, or if there is a server error.

```json
{
  "message": "TODO created successfully."
}
```

### `PUT /api/TODO/edit`

Modifies a not closed TODO item.

#### Body Parameters

- `todoId` (required): Unique and not null string, must match the one of an existing TODO item.
- `newDescription` (optional): Unique and not null string.
- `newDeadline` (optional): Boolean.

#### Response

The endpoint updates the item's description and/or deadline fields and returns a 200 status code if the item is successfully updated.

The endpoint returns an error message if the TODO is not found, the TODO is closed, the new description and/or new deadline are not valid, or if there is a server error.

```json
{
  "message": "TODO created successfully."
}
```

### `PUT /api/TODO/close`

Closes a TODO item.

#### Body Parameters

- `description` (required): Unique and not null string, must match the one of an existing and open TODO item.

#### Response

The endpoint updates the item's statusconclusion to true and returns a 200 status code if the item is successfully closed, or an error message if the item is not found, the item is already closed, or if there is a server error.

```json
{
  "message": "TODO item closed successfully."
}
```

### `GET /api/TODO`

This route retrieves a list of all TODOs. No parameters are required. Authentication is achieved through the access token provided in the Authorization header of the requests.

#### Response

```json
{
  "TODOs": [
    {
      "description": "Math homework",
      "deadline": "2023-05-14T00:00:00.000Z",
      "statusconclusion": false,
      "isPastDeadline": false,
      "lastmodification": "2023-05-08T02:49:32.263Z"
    },
    {
      "description": "Clean the house",
      "deadline": "2023-05-07T00:00:00.000Z",
      "statusconclusion": true,
      "isPastDeadline": true,
      "lastmodification": "2023-05-08T02:49:53.586Z"
    }
  ]
}
