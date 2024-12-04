const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

const DB_URL = process.env.DATABASE_URL;
const DB_NAME = process.env.DATABASE_NAME;

beforeAll(async () => {
  await mongoose.connect(DB_URL + DB_NAME);
});

afterAll(async () => {
  await mongoose.connection.close();
});

function getRandomIntStr() {
  return Math.floor(Math.random() * 1000).toString();
}

const testEmail = "test" + getRandomIntStr() + "@example.com";
console.log("Test email: ", testEmail);

let accessToken;

describe("Public routes", () => {
  describe("GET /", () => {
    it("should return the TODO API description", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(
        "This is the TODO API, a RESTful API that allows users to manage their to-do lists."
      );
    });
  });

  describe("POST /api/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({
          email: testEmail,
          password: "password123",
        })
        .expect(201);

      expect(response.body.message).toBe("User created successfully.");
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("email is required");
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({
          email: testEmail,
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("password is required");
    });
  });

  describe("POST /api/login", () => {
    it("should login a user and return an access token", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          email: testEmail,
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("You are successfully logged in.");
      expect(response.body).toHaveProperty("token");
      accessToken = response.body.token;
    });

    it("should return 404 if email is invalid", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          email: "invalid@example.com",
          password: "password123",
        })
        .expect(404);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("User not found.");
    });

    it("should return 401 if password is invalid", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          email: testEmail,
          password: "invalidpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Password incorrect.");
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("email is required");
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          email: testEmail,
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("password is required");
    });
  });
});

const testTODO = {
  description: "Clean the apartment",
  deadline: "2023-05-14T00:00:00.000Z",
};

describe("Private routes", () => {
  describe("POST /api/TODO/create", () => {
    it("should create a new TODO item", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send(testTODO)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.message).toEqual("TODO created successfully.");
    });

    it("should create a new TODO item already closed", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Math homework",
          deadline: "2023-04-10",
          statusconclusion: true,
        })
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.message).toEqual("TODO created successfully.");
    });

    it("should return 409 if description is not unique", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send(testTODO)
        .expect("Content-Type", /json/)
        .expect(409);

      expect(response.body.error).toEqual("The description must be unique.");
    });

    it("should return 400 if deadline is missing", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Math homework",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("deadline is required");
    });

    it("should return 400 if description is missing", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          deadline: "2023-05-29",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("description is required");
    });

    it("should return 400 if description is empty", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "",
          deadline: "2023-05-29",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual(
        "description is not allowed to be empty"
      );
    });

    it("should return 400 if deadline is a text string", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Homework",
          deadline: "test",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual(
        "deadline must be in ISO 8601 date format"
      );
    });

    it("should return 400 if deadline is an integer", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Homework",
          deadline: 123,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("deadline must be a valid date");
    });

    it("should return 401 if token is invalid or null", async () => {
      const response = await request(app)
        .post("/api/TODO/create")
        .set("Authorization", "Bearer " + accessToken + "asdf")
        .send({
          description: "Math homework",
        })
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.error).toEqual(
        "Access denied. Token missing or invalid."
      );
    });
  });

  describe("PUT /api/TODO/edit", () => {
    it("should edit the description and deadline of the TODO item", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
          newDescription: "Clean the basement",
          newDeadline: "2023-11-24",
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.message).toEqual("TODO item updated successfully.");
    });

    it("should edit only the description of the TODO item", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the basement",
          newDescription: "Clean the apartment",
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.message).toEqual("TODO item updated successfully.");
    });

    it("should edit only the deadline of the TODO item", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
          newDeadline: "2023-06-01",
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.message).toEqual("TODO item updated successfully.");
    });

    it("should return 400 if new description and new deadline are missing", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("There is no change to be made.");
    });

    it("should return 400 if description is missing", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          newDescription: "Clean the bedroom",
          newDeadline: "2023-06-01",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("description is required");
    });

    it("should return 400 if description is missing", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          newDescription: "Clean the bedroom",
          newDeadline: "2023-06-01",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("description is required");
    });

    it("should return 409 if new description is not unique", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
          newDescription: "Math homework",
        })
        .expect("Content-Type", /json/)
        .expect(409);

      expect(response.body.error).toEqual(
        "The new description must be unique."
      );
    });

    it("should return 409 if the TODO item is closed", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Math homework",
          newDescription: "Physics homework",
        })
        .expect("Content-Type", /json/)
        .expect(409);

      expect(response.body.error).toEqual("TODO item already closed.");
    });

    it("should return 400 if the new description is not a string", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
          newDescription: 1234,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("newDescription must be a string");
    });

    it("should return 400 if the new deadline is an integer", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
          newDeadline: 123,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("newDeadline must be a valid date");
    });

    it("should return 400 if the new deadline is an invalid string", async () => {
      const response = await request(app)
        .put("/api/TODO/edit")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
          newDeadline: "123",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual(
        "newDeadline must be in ISO 8601 date format"
      );
    });
  });

  describe("PUT /api/TODO/close", () => {
    it("should close an open TODO item", async () => {
      const response = await request(app)
        .put("/api/TODO/close")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Clean the apartment",
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.message).toEqual("TODO item closed successfully.");
    });

    it("should return 409 if the TODO item is already closed", async () => {
      const response = await request(app)
        .put("/api/TODO/close")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "Math homework",
        })
        .expect("Content-Type", /json/)
        .expect(409);

      expect(response.body.error).toEqual("TODO item already closed.");
    });

    it("should return 400 if the description is empty", async () => {
      const response = await request(app)
        .put("/api/TODO/close")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: "",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual(
        "description is not allowed to be empty"
      );
    });

    it("should return 400 if the description is an integer", async () => {
      const response = await request(app)
        .put("/api/TODO/close")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          description: 123,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.error).toEqual("description must be a string");
    });
  });

  describe("GET /api/TODO", () => {
    it("should return the user's TODOs", async () => {
      const response = await request(app)
        .get("/api/TODO")
        .set("Authorization", "Bearer " + accessToken)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.TODOs[0].description).toEqual("Clean the apartment");
      expect(response.body.TODOs[0].statusconclusion).toEqual(true);
      expect(response.body.TODOs[1].description).toEqual("Math homework");
      expect(Object.keys(response.body.TODOs).length).toEqual(2);
    });

    it("should return if any user's TODO is late", async () => {
      const response = await request(app)
        .get("/api/TODO")
        .set("Authorization", "Bearer " + accessToken)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.TODOs[1].isPastDeadline).toEqual(true);
    });

    it("should return 401 if the token is missing", async () => {
      const response = await request(app)
        .get("/api/TODO")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.error).toEqual(
        "Access denied. Token missing or invalid."
      );
    });

    it("should return 401 if the token is invalid", async () => {
      const response = await request(app)
        .get("/api/TODO")
        .set("Authorization", "Bearer " + accessToken + "abcd")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.error).toEqual(
        "Access denied. Token missing or invalid."
      );
    });
  });
});
