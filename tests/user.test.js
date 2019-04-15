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
  await request(app)
    .post("/users")
    .send({
      name: "Tijmen",
      email: "tijmen76@gmail.com",
      password: "mYpaLLOWord1"
    })
    .expect(201);
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
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
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
});

test("Should not delete an account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});