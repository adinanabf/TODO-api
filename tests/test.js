const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;
const DB_NAME = process.env.DATABASE_NAME;

beforeAll(async () => {
    await mongoose.connect(DB_URL+DB_NAME, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
});
  
afterAll(async () => {
    await mongoose.connection.close();
});

function getRandomIntStr() {
    return Math.floor(Math.random() * 1000).toString();
};

const testEmail = 'test'+getRandomIntStr()+'@example.com';
console.log('Test email: ', testEmail);

let accessToken;

describe('Public routes', () => {

    describe('GET /', () => {
        it('should return the TODO API description', async () => {
        const response = await request(app).get('/');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('This is the TODO API, a RESTful API that allows users to manage their to-do lists.');
        });
    });

    describe('POST /api/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    email: testEmail,
                    password: 'password123'
                })
                .expect(201);

            expect(response.body.message).toBe('User created successfully.');
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    password: 'password123'
                })
                .expect(400);
      
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('email is required');
        });

        it('should return 400 if password is missing', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    email: testEmail
                })
                .expect(400);
      
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('password is required');
        });
    });

    describe('POST /api/login', () => {
        it('should login a user and return an access token', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                email: testEmail,
                password: 'password123'
                })
                .expect(200);
                
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('You are successfully logged in.');
            expect(response.body).toHaveProperty('token');
            accessToken = response.body.token;
        });

        it('should return 404 if email is invalid', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'invalid@example.com',
                    password: 'password123'
                })
                .expect(404);
    
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('User not found.');
        });

        it('should return 401 if password is invalid', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: testEmail,
                    password: 'invalidpassword',
                })
                .expect(401);
    
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Password incorrect.');
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    password: 'password123',
                })
                .expect(400);
      
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('email is required');
        });

        it('should return 400 if password is missing', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: testEmail,
                })
                .expect(400);
      
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('password is required');
        });
    });
});

const testTODO = {
    description: "Clean the apartment",
    deadline: "2023-05-14T00:00:00.000Z"
};

describe('Private routes', () => {

    describe('POST /api/TODO/create', () => {

        it('should create a new TODO item', async () => {
            const response = await request(app)
                .post('/api/TODO/create')
                .set('Authorization', 'Bearer ' + accessToken)
                .send(testTODO)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body.message).toEqual('TODO created successfully.');
          });
    });

    // describe('PUT /api/TODO/close', () => {
    // });

    // describe('PUT /api/TODO/edit', () => {
    // });

    // describe('GET /api/TODO', () => {
    // });
});