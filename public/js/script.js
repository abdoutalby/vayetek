
const socket = io();

const gameForm = document.getElementById("add-game-form")
const gamesContainer = document.getElementById("games-container");
const gamenumber = document.getElementById("gamenumber");
const chatForm = document.getElementById("chat-form")
const chatMessages = document.getElementById("chat-messages")
const nicknameForm = document.getElementById("nickname-form")
const nickname = document.getElementById("nickname")
const saveusernamebtn = document.getElementById("saveusername")
let username = "unkown"
gameForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const players = e.target.elements.players.value

    socket.emit('newGame', players)
    e.target.elements.players.value = ''
})

socket.on("allGames", (data) => {
     gamesContainer.innerHTML = ''
    notFinishedItems = 0;

    data.forEach(element => {
        if (!element.isfinished) {
            notFinishedItems++;
        }
        gamesContainer.innerHTML += `<div class="partie-item" id="gameitem">
        <input ${element.isfinished ? "checked" : ''} type="checkbox" id="item-isfinished${element.id}" onchange="update(${element.id})" >
         ${element.isfinished ? "<del>" : '<p>'} ${element.players} ${element.isfinished ? "</del>" : '</p>'}
        
            <i class="fas fa-remove remove-btn" onclick="removeGame(${element.id})"></i>
         
    </div>`
    });
    gamenumber.innerHTML = notFinishedItems;

})
function update(id) {
    const isfinished = document.getElementById("item-isfinished" + id).checked;
    socket.emit("updateGame", { id: id, isfinished: isfinished })
}

function removeGame(id) {
    socket.emit("deleteGame", id)
}

socket.on('newGame', function (data) {
    gamesContainer.innerHTML += `<div class="partie-item" id="gameitem">
                <input type="checkbox">
                <p> ${data} </p>
                
                    <i class="fas fa-remove remove-btn"></i>
                 
            </div>`
})


socket.on('message', (message) => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

nicknameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    username = e.target.elements.user.value
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let msg = e.target.elements.msg.value;
    msg = msg.trim();

    if (!msg) {
        return false;
    }

    socket.emit('chatMessage', { username: username, text: msg });
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${new Date().toLocaleDateString()}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}