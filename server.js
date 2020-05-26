const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const uploadRouter = require('./app-middlewares/upload');
const registration = require('./app-middlewares/register');
const authRouter = require('./app-middlewares/auth');
const hyperledgerRouter = require('./app-middlewares/hyperledger');

const app = express();
const port = 3000;

app.use(bodyParser.json({
  limit: '2000mb',
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: '2000mb',
  extended: true
}));
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => res.send('Welcome to KYCHAIN'));
app.use('/api/kychain/upload', uploadRouter);
app.use('/api/kychain/kyc', registration);
app.use('/api/auth', authRouter);
app.use('/api/kychain/hyperledger', hyperledgerRouter);

app.listen(port, () => console.log(`KYCHAIN App Listening On Port ${port}!`));