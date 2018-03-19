
var options = {};

JitsiMeetJS.init();

var connection = new JitsiMeetJS.JitsiConnection(null, null, options);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

connection.connect();


function onConnectionSuccess() {
    console.log('Connected to the meet - tag');
}
function onConnectionFailed() {
    console.log('Failed Connection to the meet - tag');
}
function disconnect() {
    console.log('Disconnected from meet - tag');
}