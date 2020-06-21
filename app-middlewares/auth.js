const express = require('express');
const randtoken = require('rand-token');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Cryptr = require('cryptr');

const connection = require('../helpers/connection');
const query = require('../helpers/query');
const dbConfig = require('../dbConfig');

const cryptr = new Cryptr('Kyc-ch41N-H1tw0H0D-9rOj3(T');

const refreshTokens = {};
const SECRET = 'Kyc-ch41N-H1tw0H0D-9rOj3(T';
const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

const router = express.Router();

passport.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
  const expirationDate = new Date(jwtPayload.exp * 1000);
  if (expirationDate < new Date()) {
    return done(null, false);
  }
  done(null, jwtPayload);
}));

passport.serializeUser(function (user, done) {
  done(null, user.username)
});

router.post('/login', async (req, res) => {

  try {
    const conn = await connection(dbConfig).catch(e => {});
    const email = req.body.email;
    const password = req.body.password;
    const kycId = req.body.kycId;

    const refreshToken = randtoken.uid(256);
    const self_signedDecrypt = new Cryptr(kycId);

    const results = await query(conn, `SELECT * FROM auth_table WHERE email = '${email}'`).catch(console.log);
    if (results.length > 0) {
      try {
        console.log('kychain - ' + Date() + '> --------------|Decrypting data ...|---------------');

        _tempPass = cryptr.decrypt(results[0].password);
        _tempPasstwo = self_signedDecrypt.decrypt(_tempPass);

        if ((_tempPasstwo == password) && (cryptr.decrypt(results[0].kycId) == kycId)) {
          const user = {
            'recordId': kycId,
            'recordHash': results[0].kycId
          };

          const token = jwt.sign(user, SECRET, {
            expiresIn: 10000
          });

          refreshTokens[refreshToken] = email;

          res.status(201).json({
            'statusCode': 201,
            'message': 'success',
            'responseBody': {
              'kycId': kycId,
              'jwt': token,
              'refreshToken': refreshToken
            }
          });
          res.end();
        } else {

          res.status(403).send({
            'statusCode': 403,
            'message': 'Incorrect Credentials',
          });
          res.end();
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({
          'statusCode': 500,
          'message': 'Server error',
        });
        res.end();
      }

    } else {
      console.log('kychain - ' + Date() + '> --------------|Login Failed:: Bad Credentials...|---------------');
      res.status(200).send({
        'statusCode': 200,
        'message': 'failed',
        'responseBody': {
          'reason': 'User not found exist'
        }
      });
    }

    res.end();
  } catch (error) {
    console.log('kychain - ' + Date() + '> --------------|Missing Fields...|---------------');
    console.log(error);
    res.status(200).send({
      'statusCode': 200,
      'message': 'failed',
      'responseBody': {
        'reason': 'Unexpected system malfunction occured'
      }
    });
  }
});

router.post('/logout', function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken];
  }
  res.sendStatus(204);
});


router.post('/refresh', function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) {
    const user = {
      'kycId': refreshTokens[refreshToken],
    }
    const token = jwt.sign(user, SECRET, {
      expiresIn: 6000
    });
    res.json({
      jwt: token
    })
  } else {
    res.sendStatus(401);
  }
});

router.get('/random', passport.authenticate('jwt'), function (req, res) {
  res.json({
    value: Math.floor(Math.random() * 100)
  });
});

module.exports = router;