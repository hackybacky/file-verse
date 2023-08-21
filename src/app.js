const express = require('express');
const multer = require('multer'); 
const {  GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const { ObjectId } = require('mongodb'); 
const connectDB = require('../db');
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('uploadFile'), async (req, res) => {
  const uploadedFile = req.file;
  const db = await connectDB();

  if (!uploadedFile) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const bucket = new GridFSBucket(db);

    const uploadStream = bucket.openUploadStream(uploadedFile.originalname);
    const buffer = uploadedFile.buffer;
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error while uploading:', error);
      res.status(500).send('Error uploading file.');
    });

    uploadStream.on('finish', () => {
      console.log('File uploaded successfully to MongoDB.');
      const fileId = uploadStream.id; 
      const size = uploadedFile.size;
      const timestamp = new Date().toISOString();
      res.status(200).json({ fileId, size, timestamp });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the file.');
  }
});

app.get('/file/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
  
    try {
      const db = await connectDB();
      const bucket = new GridFSBucket(db);
  
      const fileStream = bucket.openDownloadStream(new ObjectId(fileId));
  
      fileStream.on('error', (error) => {
        console.error('Error while fetching file:', error);
        res.status(500).send('Error fetching file.');
      });
      fileStream.pipe(res);
  
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred while fetching the file.');
    }
  });
  
module.exports = app;