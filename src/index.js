const express = require("express");
require("./db/mongoose");
// import Routes
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is running on port:" + port);
});
