
var callEmotion;
var username;
function takeSnap(user) {
    username = user;
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
                    if(data != undefined){
                     $("#results").text(JSON.stringify(data[0].faceAttributes));
                     sendEmotions(data[0]);
                    }
                    else
                        console.log("Could not receive emotions");
                })
                .fail(function(err) {
                    $("#results").text(JSON.stringify(err));
                });
        });
        };
    });
    var sendEmotions = function(data){
        console.log("Sending"+JSON.stringify(data));
        console.log(username);
        $.post({
            url: "/api/emotion",
            contentType:"application/json",
            data: JSON.stringify({
                "username": username,
                "payload": data
                })
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

    $.get({
        url: '/api/emotion',
        success: function (res) {
           console.log(res);
            for(var i =0 ;i <res.length;i++)
            {
                var emotionsGot = [];
                var emotionsJSON = new Array();
                var time = [];
                var username;
                //console.log(res[i].emotions);
                for(var j=0;j<res[i].emotions.length;j++)
                {
                    username = res[i].username;
                    emotionsGot[j]=res[i].emotions[j]["emotion"];
                    
                    emotionsGot[j]["time"]=j;
                    emotionsJSON.push(emotionsGot[j]);
                }
                plot(emotionsJSON,i, username);
            }
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

var plot = function(emotionsJSON, index, username){
    var element = "" + "#chart-line" + index;

    $("#mychart").append('<div class="chart-wrapper" id="chart-line'+ index +'"></div><br>');

    console.log('Plotting');
    $(element.toString()).empty();        
    var chart = makeLineChart(emotionsJSON, 'time', {
        'Anger': {column: 'anger'},
        'Contempt': {column: 'contempt'},
        'Disgust': {column: 'disgust'},
        'Fear': {column: 'fear'},
        'Happiness': {column: 'happiness'},
        'Neutral': {column: 'neutral'},
        'Sadness': {column: 'sadness'},
        'Surprise': {column: 'surprise'}
    }, {xAxis: 'Time frame', yAxis: 'Percentage', text: "Emotions"});
    console.log('Setting up line chart');    
    chart.bind(element.toString());
    console.log('Rendering the chart');  
    chart.render(username);
};