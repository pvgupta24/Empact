Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#my_camera');

var canvas = document.getElementById('viewport'),
    context = canvas.getContext('2d');
var subscriptionKey = "ffe41ed50f3d4d51aeb816350fa190ad";


var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";
// Request parameters.
var params = {
    "returnFaceId": "true",
    "returnFaceLandmarks": "false",
    "returnFaceAttributes": "age,gender,smile,emotion",
};

function getEmotions() {
    // take snapshot and get image data
    Webcam.snap(function(data_uri) {
        base_image = new Image();
        base_image.src = data_uri;
        base_image.onload = function() {
            context.drawImage(base_image, 0, 0, 320, 240);

            let data = canvas.toDataURL('image/jpeg');

            fetch(data)
                .then(res => res.blob())
                .then(blobData => {
                $.post({
                        url: uriBase+"?"+$.param(params),
                        contentType: "application/octet-stream",
                        headers: {
                            "Ocp-Apim-Subscription-Key": subscriptionKey
                        },
                        processData: false,
                        data: blobData
                 })
                .done(function(data) {
                     $("#results").text(JSON.stringify(data[0].faceAttributes));
                    //Send emotions JSON to server

                     var received=[{"faceId":"b851c7a8-9adb-4040-8585-03211d55764b","faceRectangle":{"top":124,"left":128,"width":88,"height":88},"faceAttributes":{"smile":1,"gender":"male","age":26.5,"emotion":{"anger":0,"contempt":0,"disgust":0,"fear":0,"happiness":1,"neutral":0,"sadness":0,"surprise":0}}}];
                     console.log("Sending"+JSON.stringify(data[0].faceAttributes));
                     sendEmotions(data[0]);
                })
                .fail(function(err) {
                    $("#results").text(JSON.stringify(err));
                });
        });
        };
    });
    var sendEmotions = function(data){
        // console.log("Sending"+JSON.stringify(data));
        $.post({
            url: "/emotions",
            contentType:"application/json",
            data:JSON.stringify(data)
        }).done(function(data) {
            //$("#results").text(JSON.stringify(data));
        })
            .fail(function(err) {
                // $("#results").text(JSON.stringify(err));
            });
    };
}

function allEmotions() {

    $.ajax({
        url:'/emotions',
        type:'GET',
        success: function (res) {
            console.log(res[0].emotions);

            // access any API through res[0].emotions[0].emotion
        }

    });
    //$("#allEmotionsresult").text(JSON.stringify(data));
};
