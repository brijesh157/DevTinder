const express = require("express");
const app = express();



app.use(express.json());
app.get("/",(req,res)=>{
    res.send("Hello from the server");
})

app.post("/user",(req,res)=>{
    console.log(req.body);
    res.send("Data created successfully");
})



app.listen(3000,()=>{
    console.log("Listening on port 3000");
})