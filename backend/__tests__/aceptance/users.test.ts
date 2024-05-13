import app from "../../src/app";
import { port } from "../../src/config";
import { AppDataSource } from "../../src/data-source";
import * as request from "supertest";

let connection, server;

const testUser = {
    firstName: "Test",
    lastName: "new",
    age: 27
};

beforeEach(async () => {
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
    server = app.listen(port);
});

afterEach(() => {
    connection.close();
    server.close();
});

it('should be no users initially', async () => {
    const response = await request(app).get('/users');
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
});

it('should create users', async () => {
    const response = await request(app)
        .post('/users') // Specify the correct URL here
        .send(testUser); // Send the user data as the request body
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ...testUser, id: 1 }); // Assuming the response contains the created user with an added ID
});


it('should not create a user if no firstName is given', async() => {
    const response = await request(app).post('/users').send({ lastName: 'Doe', age: 21 });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).not.toBeNull();
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0]).toEqual({
        type: 'field',
        msg: 'Invalid value',
        path: 'firstName',
        location: 'body'
      });
  });
  

  it('should not create a user if age is less than 10', async() => {
    const response = await request(app).post('/users').send({firstName:'alan', lastName: 'Doe', age: 9 });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).not.toBeNull();
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0]).toEqual( {
        type: 'field',
        value: 9,
        msg: 'Age must be above 10',
        path: 'age',
        location: 'body'
      });
  });
  