require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const AWS = require('aws-sdk');
const UUID = require('uuid/v4');
const Busboy = require('busboy');

// INTIALIZE EXPRESS/ GLOBAL VARIABLES
const app = express();
const {
  SERVER_PORT,
  AWS_REGION,
  AWS_BUCKET,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY
} = process.env;

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY
});

const S3 = new AWS.S3();

// TOP LEVEL MIDDLEWARE
app.use(cors());
app.use(bodyParser.json({ limit: '200mb' }));

// GENERAL
app.post('/api/uploadObject', (req, res) => {
  let chunks = [],
    fname,
    ftype,
    fEncoding;

  console.log(req.headers);

  let busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log(
      'File [' +
        fieldname +
        ']: filename: ' +
        filename +
        ', encoding: ' +
        encoding +
        ', mimetype: ' +
        mimetype
    );

    fname = filename.replace(/ /g, '_');
    ftype = mimetype;
    fEncoding = encoding;
    file.on('data', function(data) {
      console.log(chunks);
      chunks.push(data);
    });
    file.on('end', function() {
      console.log('File [' + filename + '] Finished');
    });
  });
  busboy.on('finish', function() {
    const userId = UUID();
    const params = {
      Bucket: AWS_BUCKET, // your s3 bucket name
      Body: Buffer.concat(chunks), // concatinating all chunks
      Key: `${userId}-${fname}`,
      ContentType: ftype, // required
      ACL: 'public-read'
    };
    // we are sending buffer data to s3.
    S3.upload(params, (err, s3Response) => {
      if (err) {
        console.log(err);
        res.status(500).send({ err, status: 'error', msg: 'Upload Failed!' });
      } else {
        console.log(s3Response);
        res.status(200).send({
          data: s3Response,
          status: 'success',
          msg: 'Upload Successful!'
        });
      }
    });
  });
  req.pipe(busboy);
});

// LISTENING
app.listen(SERVER_PORT, () => console.log(`Listening to port ${SERVER_PORT}`));
