const express = require('express');
const connection = require('../helpers/connection');
const query = require('../helpers/query');
const router = express.Router();
const dbConfig = require('../dbConfig');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('Kyc-ch41N-H1tw0H0D-9rOj3(T');

router.post('/verify', async (req, res) => {
    const conn = await connection(dbConfig).catch(e => {});
    const idNumber = req.body.idNumber;
    const firstName = req.body.firstName;
    const surname = req.body.surname;
    const gender = req.body.gender;
    const dob = req.body.dob;

    console.log(idNumber + firstName + '-'+surname + '-'+dob + '-'+gender)

    const verifyUser = await query(conn, `SELECT * FROM registrar WHERE id_number = '${idNumber}' AND first_name='${firstName}' AND surname ='${surname}' AND gender='${gender}' AND dob='${dob}' AND status=1`);
    if (verifyUser.length == 0) {
        console.log('kychain - ' + Date() + '> --------------|Details Not Verifed|---------------');
        res.status(200).send({
            'statusCode': 404,
            'message': 'failed',
            'responseBody': {
                'reason': 'Could not match the provided details with the registrar datas'
            }
        });
    } else {
        console.log('kychain - ' + Date() + '> --------------|Details Verified|---------------');
        res.status(200).send({
            'statusCode': 200,
            'message': 'success',
            'responseBody':{}
        });
    }
    res.end();
});

router.post('/register', async (req, res) => {

    // Auto generate KYC IDs used to uniquely identify the kycDet

    const conn = await connection(dbConfig).catch(e => {});
    const idNumber = req.body.idNumber;
    const firstName = req.body.firstName;
    const surname = req.body.surname;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const email = req.body.emailAddress;
    const phoneNumber = req.body.phoneNumber
    var _tempKycId = 'AutoGenId';

    // Hyperledger Initiation
    // try {
    //     console.log('kychain - ' + Date() + '> --------------|Initializing hyperledger|---------------');
    //     axios.post('http://localhost:4000/api/nmb/email/send', {
    //         "emailAddress": emailAddress,
    //         "messageBody": message
    //     }).then(async function (response) {
    //         console.log(response);
    //         res.status(201).send({
    //             'statusCode': 201,
    //             'message': 'Success',
    //             'responseBody': {
    //                 'schoolId': schoolId,
    //                 'password': initialPassword
    //             }
    //         });
    //     });

    // } catch (error) {
    //     console.log('kychain - ' + Date() + '> --------------|Initializing hyperledger Failed |---------------');
    //     // break;
    // }

    try {
        // Self endorsed record encryption
        const dblEncrypt = new Cryptr(_tempKycId);
        const _kycId = cryptr.encrypt(_tempKycId);
        const _passtwo = dblEncrypt.encrypt(req.body.password);
        const  _password = cryptr.encrypt(_passtwo);
        
        const _pofImageUpdLink = dblEncrypt.encrypt(req.body.pofImgLink);
        const _idImgLink = dblEncrypt.encrypt(req.body.idImgLink);
        const _faceImgLink = dblEncrypt.encrypt(req.body.faceImgLink);

        const _cred = await query(conn, `INSERT INTO auth_table(kycId, email, password, status) VALUES ('${_kycId}','${email}','${_password}',1)`);
        const _files = await query(conn, `INSERT INTO kyc_files(kycId, face_file, proof_or_res, id_file) VALUES ('${_kycId}','${_faceImgLink}','${_pofImageUpdLink}','${_idImgLink}')`);

        if ((_cred != undefined) && (_files != undefined)) {
            // Send email to customer
            console.log('kychain - ' + Date() + '> --------------|Files Saved|---------------');
            res.status(201).send({
                'statusCode': 201,
                'message': 'Success',
                'responseBody': {
                    'kycId': _tempKycId
                }
            });
        } else {
            res.status(500).send({
                'statusCode': 500,
                'message': 'failed',
                'responseBody': {
                    'reason': 'Account created but failed to return kyc Id'
                }
            });
        }
    } catch (error) {
        console.log('kychain - ' + Date() + '> --------------|Failed to initiate db call|---------------');
        console.log(error)
        res.status(500).send({
            'statusCode': 500,
            'message': 'failed',
            'responseBody': {
                'reason': 'Failed to save details',

            }
        });
    }
    res.end();
});

module.exports = router;