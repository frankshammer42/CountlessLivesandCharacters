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
    socket.on('client_erase_block', function () {
        console.log("client erase a block");
        unity_client_connection.emit("intro_block_erased");
    });

});

const unity_client_connection = io.of("/unity-client");
unity_client_connection.on('connection', (socket) => {
    console.log("Get connection from unity client");
    socket.on('start_intro_interaction', function () {
        console.log("Start Intro Interaction");
        progress = 1; //Change to cut interaction
        web_clients_connection.emit("intro_scene");
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
