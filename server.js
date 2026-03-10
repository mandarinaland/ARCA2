import express from "express"
import fetch from "node-fetch"
import dotenv from "dotenv"
import path from "path"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.post("/arca", async (req,res)=>{

 const userMessage=req.body.message

 const response=await fetch("https://api.openai.com/v1/chat/completions",{
  method:"POST",
  headers:{
   "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   model:"gpt-4.1-mini",
   messages:[
    {
     role:"system",
     content:"Ets ARCA, la veu poètica i espiritual de Piath. Inspires sense imposar i sempre proposes una microacció."
    },
    {
     role:"user",
     content:userMessage
    }
   ]
  })
 })

 const data=await response.json()

 res.json({
  reply:data.choices[0].message.content
 })

})

app.listen(3000,()=>{
 console.log("ARCA viu a http://localhost:3000")
})
