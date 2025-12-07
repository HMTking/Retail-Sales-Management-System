import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Sales from '../models/Sales.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect to database
connectDB();

const importData = async () => {
  try {
    const csvFilePath = path.join(__dirname, '../../../truestate_assignment_dataset.csv');
    
    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error('\n❌ CSV file not found!');
      console.log('\nPlease download the dataset and place it in the project root:');
      console.log('  Expected location: truestate_assignment_dataset.csv');
      console.log('\nDataset link: https://drive.google.com/file/d/1tzbyuxBmrBwMSXbL22r33FUMtO0V_lxb/view?usp=sharing');
      process.exit(1);
    }

    console.log('Starting data import from CSV...');
    
    // Clear existing data
    const existingCount = await Sales.countDocuments();
    if (existingCount > 0) {
      console.log(`Deleting ${existingCount} existing records...`);
      await Sales.deleteMany({});
      console.log('Database cleared successfully.');
    }

    const salesData = [];
    let rowCount = 0;
    const MAX_RECORDS = 1000;

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Only process first 1000 records
        if (rowCount >= MAX_RECORDS) {
          return;
        }

        rowCount++;
        
        // Parse tags (assuming comma-separated in the CSV)
        const tags = row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [];

        const sale = {
          transactionId: parseInt(row['Transaction ID']),
          date: new Date(row['Date']),
          customerId: row['Customer ID'],
          customerName: row['Customer Name'],
          phoneNumber: row['Phone Number'],
          gender: row['Gender'],
          age: parseInt(row['Age']),
          customerRegion: row['Customer Region'],
          customerType: row['Customer Type'],
          productId: row['Product ID'],
          productName: row['Product Name'],
          brand: row['Brand'],
          productCategory: row['Product Category'],
          tags: tags,
          quantity: parseInt(row['Quantity']),
          pricePerUnit: parseFloat(row['Price per Unit']),
          discountPercentage: parseFloat(row['Discount Percentage']),
          totalAmount: parseFloat(row['Total Amount']),
          finalAmount: parseFloat(row['Final Amount']),
          paymentMethod: row['Payment Method'],
          orderStatus: row['Order Status'],
          deliveryType: row['Delivery Type'],
          storeId: row['Store ID'],
          storeLocation: row['Store Location'],
          salespersonId: row['Salesperson ID'],
          employeeName: row['Employee Name'],
        };

        salesData.push(sale);
      })
      .on('end', async () => {
        // Insert all collected data (max 1000 records)
        if (salesData.length > 0) {
          await Sales.insertMany(salesData);
        }

        console.log(`\n✓ Successfully imported ${salesData.length} sales records!`);
        console.log('Data import completed.');
        process.exit(0);
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run import
importData();
