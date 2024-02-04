const express = require('express');
const app = express();
const pageRouter = require("../routes/page.routes");
const userRouter = require("../routes/user.routes");

app.use(express.json());

app.use("/user", userRouter);
app.use("/page",pageRouter);

app.get("/", (req,res)=>{
    res.send("<h1>This is just for testing</h1>");
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})