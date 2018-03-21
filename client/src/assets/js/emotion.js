
var callEmotion;

function takeSnap() {
    callEmotion = setInterval(getEmotions, 3000);
}

function setWebCam(){
     Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach('#my_camera');
}

function getEmotions() {   
    
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

                     //var received=[{"faceId":"b851c7a8-9adb-4040-8585-03211d55764b","faceRectangle":{"top":124,"left":128,"width":88,"height":88},"faceAttributes":{"smile":1,"gender":"male","age":26.5,"emotion":{"anger":0,"contempt":0,"disgust":0,"fear":0,"happiness":1,"neutral":0,"sadness":0,"surprise":0}}}];
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
            url: "/api/emotion",
            contentType:"application/json",
            data:JSON.stringify(data)
        }).done(function(data) {
            //$("#results").text(JSON.stringify(data));
            console.log(data);
        })
            .fail(function(err) {
                // $("#results").text(JSON.stringify(err));
            });
    };
}



// function to get all the Last Emotions
function allEmotions() {

    var emotionsGot = [];
    var emotionsJSON = new Array();
    var time = [];
    $.ajax({
        url: '/api/emotion',
        type: 'GET',
        success: function (res) {
           console.log(res);
            for(var i =0 ;i <res.length;i++)
            {

                emotionsGot[i]=res[i].emotions;
                emotionsGot[i][0].emotion["time"] = i;
                time[i] = emotionsGot[i][0].time;                
                console.log(emotionsGot[i][0].emotion["time"]);
                emotionsJSON.push(emotionsGot[i][0].emotion);
            }
            plot(emotionsJSON);
        },
        async: false

    });
    //console.log(emotionsJSON);
};

// function to get the Last Emotion
// function getLastEmotion() {
//     console.log("Last Emotion");

//     var emotionsGot = [];
//     var emotionsJSON = new Array();
//     var time = [];
//     $.ajax({
//         url:'/api/emotion',
//         type:'GET',
//         success: function (res) {
//            // console.log(res);
//             for(var i=0 ;i<res.length;i++)
//             {
//                 console.log("Entered " + i);
//                 if(Date.now() - emotionsGot[i][0].time <= 10)
//                 {
//                     emotionsGot[i]=res[i].emotions;
//                     emotionsGot[i][0].emotion["time"] = i;
//                     time[i] = emotionsGot[i][0].time;
//                     console.log(emotionsGot[i][0].emotion);
//                     emotionsJSON.push(emotionsGot[i][0].emotion);
//                 }
//             }
//         },
//         async: false
//     });
//     console.log("Get Last Emotion, display it")
//     console.log(emotionsJSON);
// };

var plot = function(emotionsJSON){
    console.log('Plotting');
    $("#chart-line1").empty();        
    var chart = makeLineChart(emotionsJSON, 'time', {
        'Anger': {column: 'anger'},
        'Contempt': {column: 'contempt'},
        'Disgust': {column: 'disgust'},
        'Fear': {column: 'fear'},
        'Happiness': {column: 'happiness'},
        'Neutral': {column: 'neutral'},
        'Sadness': {column: 'sadness'},
        'Surprise': {column: 'surprise'}
    }, {xAxis: 'Time frame', yAxis: 'Percentage'});
    console.log('Setting up line chart');    
    chart.bind("#chart-line1");
    console.log('Rendering the chart');  
    chart.render();
};