import mongoose from 'mongoose';
import PicByServiceMan from './Database/picByServiceManModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campaign-software')
  .then(() => {
    console.log('Connected to MongoDB');
    testDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

async function testDatabase() {
  try {
    // Get all records
    const allRecords = await PicByServiceMan.find({});
    console.log('Total records in PicByServiceMan collection:', allRecords.length);
    
    if (allRecords.length > 0) {
      console.log('Sample records:');
      allRecords.forEach((record, index) => {
        console.log(`Record ${index + 1}:`);
        console.log('  Campaign Name:', record.campaignName);
        console.log('  Service Man Email:', record.serviceManEmail);
        console.log('  Live Location:', record.liveLocation);
        console.log('  City:', record.city);
        console.log('  Created At:', record.createdAt);
        console.log('  Is Verified:', record.isVerified);
        console.log('---');
      });
      
      // Test specific email search
      const testEmail = 'ahmad@gmail.com';
      console.log(`\nSearching for records with email: ${testEmail}`);
      const emailRecords = await PicByServiceMan.find({ serviceManEmail: testEmail });
      console.log('Found records:', emailRecords.length);
      
      // Test case insensitive search
      const testEmailUpper = 'AHMAD@GMAIL.COM';
      console.log(`\nSearching for records with email (uppercase): ${testEmailUpper}`);
      const emailRecordsUpper = await PicByServiceMan.find({ serviceManEmail: testEmailUpper });
      console.log('Found records (uppercase):', emailRecordsUpper.length);
    } else {
      console.log('No records found in the database');
    }
    
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    mongoose.connection.close();
  }
}