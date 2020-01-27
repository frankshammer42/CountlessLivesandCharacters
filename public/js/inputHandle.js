let socket = io('/web-client');

function textInputSubmit() {
    let userData = document.getElementById("characterInput").value;
    let data = {"userInput": userData};
    socket.emit("client_character_in", data);
    document.getElementById("demo").innerHTML = userData;
}
