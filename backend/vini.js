const express = require("express")
const app = express()
const mongoose =require("mongoose");
app.use(express.json())
const conectdb =async()=>{
    try{
        const connect = await mongoose.connect("mongodb+srv://vinithbusipalli:vinith12378.@cluster0.sf6qdv6.mongodb.net/");
            console.log("database connected")
    }
    catch(error){
        throw error
    }
}

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.post('/dust', (req, res) => {
  res.send('Hello World')
})
app.put('/',(req,res)=>{
    res.send("hello")
})
app.listen(5000,()=>{
    console.log("i am listening at localhost 4000")
    conectdb();
})