var express = require('express');
var router = express.Router();
var path = require('path');
var base64Img = require('base64-img');

// var rawdata = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
// var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
// var type = matches[1];
// var buffer = new Buffer(matches[2], 'base64');
//
// blobsrv.createBlockBlobFromText('empactstoragecontainer','profile-pic-123.jpg', buffer, {contentType:type}, function(error, result, response) {
//     if (error) {
//         console.log(error);
//     }else{
//         console.log(result)
//     }
// });
// var azure = require('azure-storage');
// var blobsrv = azure.createBlobService(
//     '<storage_account>',
//     '<storage_key>'
// );
// blobsrv.getBlobToStream('<container>', '<blob>', res, function (error, result) {});
var i = 0;
/* Save image to public folder */
router.post('/', function(req, res, next) {

    // print the body in the request;
    console.log(req.body);

    // convert the base64 image to image and save in ./public/images directory
    base64Img.img(req.body.imgBase64, './public/images', i, function(err, filepath) {
        res.send("Image saved successfully + i");
        i++;
    });


});

module.exports = router;
