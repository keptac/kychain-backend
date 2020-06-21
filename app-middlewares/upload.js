const express = require('express');
const router = express.Router();
const path = require('path');
var fs = require("fs");

var pathFolder = "../uploads"

//Upload document images
router.post("/kyc-files", (req, res) => {
    var idName = req.body.id.name;
    var idImg = req.body.id.image;
    var idrealFile = Buffer.from(idImg, "base64");
    var pofName = req.body.pof.name;
    var pofImg = req.body.pof.image;
    var pofrealFile = Buffer.from(pofImg, "base64");

    try {
        fs.writeFile(pathFolder, idrealFile, function (err) {
            if (err){
                console.log(err);
            }else{
                fs.writeFile(pathFolder, pofrealFile, function (err) {
                    if (err){
                        console.log(err);
                    }else{
                        console.log(pathFolder);
                    } 
                   
                });     
            }    
        });
    
        res.status(200).send({
            'statusCode': 200,
            'message': 'success',
            'responseBody': {
                "idImgLink": pathFolder + '\\' + idName,
                "pofImgLink": pathFolder + '\\' + pofName
            }
        });
        res.end();
        
    } catch (error) {
        console.log(error);
        res.status(200).send({
            'statusCode': 500,
            'message': 'failed',
            'responseBody': {
                'reason': 'An error occured. Please contact KYCHAIN'
            }
        });
    }

});

// Upload face Images
router.post("/face", (req, res) => {
    var faceImage = req.body.face.name;
    var faceImg = req.body.face.image;
    var faceRealFile = Buffer.from(faceImg, "base64");
    fs.writeFile(pathFolder, faceRealFile, function (err) {
        if (err)
            console.log(err);
    });
    res.status(200).send({
        'statusCode': 200,
        'message': 'success',
        'responseBody': {
            "faceImgLink": pathFolder + '\\' + faceImage,
        }
    });
});

// Update proof of residence
router.post("/update", (req, res) => {
    var pofImageName = req.body.pof.name;
    var pofImageUpd = req.body.pof.image;
    var pofRealFile = Buffer.from(pofImageUpd, "base64");
    fs.writeFile(pathFolder, pofRealFile, function (err) {
        if (err)
            console.log(err);
    });
    res.status(200).send({
        'statusCode': 200,
        'message': 'success',
        'responseBody': {
            "pofImageUpdLink": pathFolder + '\\' + pofImageName,
        }
    });
});

module.exports = router;
/*  TODO: 
    FIND A IMAGE COMPRESSION ALGORITHM. JUSTIFICATION: ITS NOT POSSIBLE TO STORE MULTIMEDIA DATA ONTO BLOCKCHAIN 
    BECAUSE OF SIZE SO I WILL USE A IMAGE COMPRESSION ALGORITHM AND CONVERT TO BASE64 THEN STORE IN HYPERLEDGER
*/