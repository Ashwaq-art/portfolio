require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const resume = require('./resume.json');
const Contact = require('./models/Contact');

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI not set in environment');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    // Seed resume into 'resumes' collection (replace existing)
    const coll = mongoose.connection.collection('resumes');
    await coll.deleteMany({});
    await coll.insertOne(resume);
    console.log('Seeded resume.json into collection `resumes`');

    // Add a sample contact
    await Contact.deleteMany({ email: 'seed@example.com' });
    const sample = new Contact({ name: 'Seed User', email: 'seed@example.com', phone: '000', message: 'This is a seeded contact.' });
    await sample.save();
    console.log('Inserted sample contact');

    await mongoose.disconnect();
    console.log('Seeding complete. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

run();
