const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');

dotenv.config();

const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_KEYFILE,
});

const bucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME);

module.exports = bucket;
