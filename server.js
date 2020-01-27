const  express = require('express');
const path = require('path');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server, {transport: ['websocket']});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('trust proxy', true);

const web_clients_connection = io.of("/web-client");
web_clients_connection.on('connection', (socket) => {
    console.log("Get connection from web client");

    socket.on('disconnect', function(){
        console.log('got disconnected');
    });

    socket.on('client_character_in', function(data){
        console.log("client wrote a character");
        let character = data.userInput;
        console.log("client wrote " + character);
        unity_client_connection.emit("unity_character_in", character);
    });
    //TODO: Have response for character formed
});

const unity_client_connection = io.of("/unity-client");
unity_client_connection.on('connection', (socket) => {
    console.log("Get connection from unity client");

    socket.on('unity_character_formed', function () {
        console.log("Character formed in unity side");
        web_clients_connection.emit("character_formed");
    });
});

app.get('/', function(req, res) {
    res.render('index.html');
});

server.listen(process.env.PORT || 8000, function() {
    console.log('Server is running on', server.address().port);
});

function sendWaitingPage(){
    web_clients_connection.emit("waiting_page");
}
