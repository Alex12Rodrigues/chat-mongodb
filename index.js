/* Importando pacotes:
        -express
        -ejs
        -http
        -path
        -socket.io
*/

const express = require('express');
const ejs = require('ejs'); 
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { Socket } = require('dgram');

/* 
    Instancias:
        -express
        -server
        -socket.io
        */

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


    /* Define a localização da pasta estática: */

app.use(express.static(path.join(__dirname, "public")))


    /* Define o EJS como a engine de rendereização frontend: */
app.set("views", path.join(__dirname, "public"));
app.engine("html", ejs.renderFile)


    /* Rota raiz '/' para acessar o index.html da aplicação: */
app.use('/', (req, resp) => {
    resp.render("index.html")
})


/* 
    Início do código do chat 
    */

    /* Array que armazena as mensagens */
let messages = [];

    /*Cria a conexão com socket.io */
io.on('connection', socket =>{
    console.log("Novo usuário conectado! ID: " +socket.id)

    /* Recuperar e manter as mensagens do front para o back: */
    socket.emit('previousMessage', messages)

    /* Dispara ações quando recebe as mensagens do front*/
    socket.on('SendMessage', data => {

        /* Adiciona a nova mensagem no final do array Messages */
        messages.push(data);

        /* Propaga a mensagem para todos os usuários conectados no chat */
        socket.broadcast.emit('receivedMessage', data)
    })
});


/* 
    Fim do código do chat
    */

    /* criando servidor https: */

server.listen(3000, () =>{
    console.log("Servidor do web chat rodando em http://localhost:3000")
});


