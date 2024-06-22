const express = require('express')
const path = require('path')
const http = require('http')
const sokcetio = require('socket.io')
const database = require('./data/database')


const app = express();

const server = http.createServer(app)


app.use(express.static(path.join(__dirname , 'public')))

io = sokcetio(server)

io.on("connection", async (socket) => {

    database.getAllGames().then(res => socket.emit("allGames" , res))   

    

     socket.on("newGame", (players) => {
     database.createGame(players)
     .then(res => 
        database.getAllGames().then(res => io.emit("allGames" , res))   

    );  
    });
    
    socket.on("updateGame" , (data)=>{
        database.updateGame(data.id , data.isfinished)
        .then(res => 
            database.getAllGames().then(res => io.emit("allGames" , res))   

        );
    })
    
    socket.on("deleteGame" , (id)=> {
        database.deleteGame(id)
        .then(res => 
            database.getAllGames()
            .then(res => io.emit("allGames" , res))   
        );
    })

    socket.on("chatMessage", (msg) => {
     
        io.emit("message",  msg);
      });
  
     socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
  

 

const PORT = 3000 || process.env.PORT ;
server.listen(PORT,()=>{
    console.log("server running in port"+PORT)
} )