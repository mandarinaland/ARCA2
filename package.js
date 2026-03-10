const button=document.createElement("div")
button.innerHTML="✦"
button.id="arca-btn"

const box=document.createElement("div")
box.id="arca-box"

box.innerHTML=`
<div id="arca-header">ARCA</div>
<div id="arca-chat"></div>
<div id="arca-input">
<input id="arca-msg" placeholder="Escriu a ARCA...">
<button id="arca-send">Enviar</button>
</div>
`

document.body.appendChild(button)
document.body.appendChild(box)

button.onclick=()=>{
 box.style.display=box.style.display==="flex"?"none":"flex"
}

document.getElementById("arca-send").onclick=async()=>{

 const input=document.getElementById("arca-msg")
 const msg=input.value

 if(!msg) return

 const chat=document.getElementById("arca-chat")

 chat.innerHTML+=`<div><b>Tu:</b> ${msg}</div>`

 input.value=""

 const res=await fetch("/arca",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({message:msg})
 })

 const data=await res.json()

 chat.innerHTML+=`<div><b>ARCA:</b> ${data.reply}</div>`

 chat.scrollTop=chat.scrollHeight
}
