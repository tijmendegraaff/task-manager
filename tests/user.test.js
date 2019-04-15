const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
  name: "Merel",
  email: "merel88@gmail.com",
  password: "hELLO29Daa"
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
