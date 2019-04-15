const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Merel",
  email: "merel88@gmail.com",
  password: "hELLO29Daa",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }]
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Tijmen",
      email: "tijmen76@gmail.com",
      password: "mYpaLLOWord1"
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Tijmen",
      email: "tijmen76@gmail.com"
    },
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe("mYpaLLOWord1");
});

test("Should not signup a new user with invalid email", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Tijmen",
      email: "invalid@email",
      password: "randompassword"
    })
    .expect(400);
});

test("Should login exsisting user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexsistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "nonexsisting@email.com",
      password: "nonExsisting"
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete an account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Jess"
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Jess");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Amsterdam"
    })
    .expect(400);
});
