const express = require('express');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');

// Initialize clients
const firestore = new Firestore();
const storage = new Storage();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Backend worker is running.');
});

// Processing endpoint (placeholder)
app.post('/process', async (req, res) => {
  console.log('Received job:', req.body);
  const { docId } = req.body;

  if (!docId) {
    return res.status(400).json({ ok: false, error: 'Missing docId in request body' });
  }

  try {
    // TODO:
    // 1. Get job details from Firestore using docId
    // 2. Download video from GCS
    // 3. Perform dummy/actual analysis
    // 4. Update job status in Firestore

    console.log(`Processing job for docId: ${docId}`);

    // Return success for now
    res.status(200).json({ ok: true, message: `Job ${docId} processed successfully (dummy).` });
  } catch (error) {
    console.error(`Failed to process job ${docId}:`, error);
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Backend worker listening on port ${port}`);
});