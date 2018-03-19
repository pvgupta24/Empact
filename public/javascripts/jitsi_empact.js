var startRoom = function () {
    var domain = "meet.jit.si";
    var options = {
        roomName: "empact-"+"room1",
        width: 500,
        height: 500,
        parentNode: document.querySelector('#meet'),
        interfaceConfigOverwrite: {filmStripOnly: false},
        onload : onload
    };
    var api = new JitsiMeetExternalAPI(domain, options);
    var onload = function () {
        console.log('Meet Started');
    };
};

startRoom();