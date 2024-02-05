const express = require("express");
const app = express();
const pageRouter = require("./routes/page.routes");
const userRouter = require("./routes/user.routes");
const jwtRouter = require("./routes/jwt.routes");
const client = require("./db/redis");
const dotenv = require("dotenv");
dotenv.config();

const connectMongoose = require("./db/mongoose");
const PORT = process.env.PORT || 3000;
connectMongoose();
app.use(express.json());
client.connect();
app.use("/user", userRouter);
app.use("/page", pageRouter);
app.use("/jwt", jwtRouter);

app.get("/", (req, res) => {
  res.send("<h1>This is just for testing</h1>");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
