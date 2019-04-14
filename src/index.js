const express = require("express");
require("./db/mongoose");
// import Routes
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();

const port = process.env.PORT || 3000;

// Middleware
// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   next();
// });

// app.use((req, res, next) => {
//   res.status(503).send("Server is under maintaince");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is running on port:" + port);
});
