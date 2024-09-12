// login elemenst 
const login = document.querySelector(".login")
const loginForm = document.querySelector(".login__form")
const loginInput = document.querySelector(".login__input")
// chat elemenst 
const chat = document.querySelector(".chat")
const chatForm = document.querySelector(".chat__form")
const chatInput = document.querySelector(".chat__input")
const chatMessage = document.querySelector(".chat__messages")


const user = {
    id: "", name: "", color: ""
}

let websocket 
const colors = [
    "cadetblue",
    "darkgoldenron",
    "cornflowerblue",
    "darkkhaki", 
    "gold", 
    "hotpink"
]

const createMassageSelfElement =(content) =>{
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content
    return div
}
const createMassageOtherElement =(content, sender, senderColor) =>{
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")
    span.classList.add("message--sender")

    span.style.color = senderColor
    div.appendChild(span)
    span.innerHTML = sender
    div.innerHTML += content
    return div
}

const processMessage = ({data}) => {
    const {userId, userName, userColor, content}  = JSON.parse(data)

    const message = userId == user.id ? createMassageSelfElement(content) : createMassageOtherElement(content,userName, userColor)

    const elemenst = createMassageOtherElement(content, userName, userColor)

    chatMessage.appendChild(message)
    scollScreen()
}
const getRandomColor = () =>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const handleLogin = (event) => {
    event.preventDefault()
    user.name = loginInput.value
    user.color = getRandomColor()
    user.id = crypto.randomUUID()
    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage
    // websocket.onopen = () => websocket.send(`usuario: ${user.name} entrou no chat`)
   
}
const sendMessage = (event) =>{
    event.preventDefault()
    const message = {
        userId : user.id,
        userName : user.name,
        userColor : user.color,
        content: chatInput.value
    }
    websocket.send(JSON.stringify(message))
    chatInput.value = ''
}
loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)

const scollScreen = () =>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}