/**
 * Kelvin Chelenje
 * keptac.flutter@gmail.com
 * 
 * Functions
 * 1. Request Access
 * 2. Grant Access 
 * 3. Verify KYC
 * 4. Approve KYC
 */

const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');
const router = express.Router();
const dbConfig = require('../dbConfig');

// Approve Customer KYC
router.put('/approve/:id', async (req, res) => {
    const id = req.params.id;
    const decision = req.body.decision;

    try {
        console.log('kychain - ' + Date() + '> --------------|Approve: Hyperledger connected |---------------');
        axios.post('http://localhost:4000/api/nmb/email/send', {
            "id": emailAddress,
            "decision": message
        }).then(async function (response) {
            console.log(response);
            res.status(201).send({
                'statusCode': 201,
                'message': 'Success',
                'responseBody': {
                    'schoolId': schoolId,
                    'password': initialPassword
                }
            });
        });

        // Send push notification.

    } catch (error) {
        console.log(error)
    }
    res.end();
});


// Get all kyc records unfiltered
router.get('/records', async (req, res) => {
    try {
        console.log('kychain - ' + Date() + '> --------------|Get All records: Hyperledger connected |---------------');

        axios.get('http://localhost:4000/api/nmb/email/send', {
         
            "emailAddress": emailAddress,
            "messageBody": message
        }).then(async function (response) {
            console.log(response);
            res.status(201).send({
                'statusCode': 201,
                'message': 'Success',
                'responseBody': {
                    'schoolId': schoolId,
                    'password': initialPassword
                }
            });
        });
    } catch (error) {
        console.log(error)
    }
    res.end();
});

// Get all kyc records for particular bank
router.get('/records/:bankId', async (req, res) => {
    try {
        console.log('kychain - ' + Date() + '> --------------|Get Bank Records: Hyperledger connected |---------------');

        axios.get('http://localhost:4000/api/nmb/email/send', {
         
            "emailAddress": emailAddress,
            "messageBody": message
        }).then(async function (response) {
            console.log(response);
            res.status(201).send({
                'statusCode': 201,
                'message': 'Success',
                'responseBody': {
                    'schoolId': schoolId,
                    'password': initialPassword
                }
            });
        });
    } catch (error) {
        console.log(error)
    }
    res.end();
});

// get a single kyc record
router.get('/records/:kycId', async (req, res) => {
    try {
        console.log('kychain - ' + Date() + '> --------------|Single KYC: Hyperledger connected |---------------');

        axios.get('http://localhost:4000/api/nmb/email/send', {
         
            "emailAddress": emailAddress,
            "messageBody": message
        }).then(async function (response) {
            console.log(response);
            res.status(201).send({
                'statusCode': 201,
                'message': 'Success',
                'responseBody': {
                    'schoolId': schoolId,
                    'password': initialPassword
                }
            });
        });
    } catch (error) {
        console.log(error)
    }
    res.end();
});

module.exports = router;