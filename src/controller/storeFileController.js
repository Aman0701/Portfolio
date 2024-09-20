import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { googlesheet } from './googleSheetController.js';

// Path to your Excel file

let filePath;
// Function to add a successful transaction email
export const addTransactionEmail = async (name, email, contact, daysRemaining,transactionId,sheetNumber) => {
  let workbook;
  let worksheet;
  if(sheetNumber == 1){
    filePath = path.resolve('transaction_emails_1.xlsx');
  }else{
    filePath = path.resolve('transaction_emails_2.xlsx');
  }
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Read the existing Excel file
    workbook = xlsx.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    // Create a new workbook and worksheet
    workbook = xlsx.utils.book_new();
    const header = ['Name', 'Email', 'Contact', 'Days Remaining','TransactionId'];
    worksheet = xlsx.utils.aoa_to_sheet([header]); // Header row
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    //Convert worksheet to JSON to manipulate it easily

  }

  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const header = data[0];
  const emailIndex = header.indexOf('Email');
  let daysUpdated = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][emailIndex] === email) {
      const daysIndex = header.indexOf('Days Remaining');
      const transactionIndex = header.indexOf('TransactionId');
      data[i][daysIndex] = data[i][daysIndex] + daysRemaining;
      let currentTransactions = data[i][transactionIndex];
      if (typeof currentTransactions === 'string') {
        try {
          currentTransactions = JSON.parse(currentTransactions); // Try parsing if it's stored as a JSON string
        } catch (error) {
          currentTransactions = [currentTransactions]; // Convert to array if it's a single string
        }
      }

      if (Array.isArray(currentTransactions)) {
        currentTransactions.push(transactionId); // Push the new transaction ID into the array
      } else {
        currentTransactions = [currentTransactions, transactionId]; // Handle edge case where it's not an array
      }

      // Convert the transactions array to a JSON string
      data[i][transactionIndex] = JSON.stringify(currentTransactions);
      console.log(currentTransactions);
      
      const updatedWorkSheet = xlsx.utils.aoa_to_sheet(data);


      // Update the worksheet in the workbook
      workbook.Sheets[workbook.SheetNames[0]] = updatedWorkSheet;

      await xlsx.writeFile(workbook, filePath);
      daysUpdated = true;
      console.log(`Email ${email} updated to transaction_emails.xlsx`);
      break;
    }
  }

  if (daysUpdated === false) {
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Append new data (email and current date)
    const newRow = [name, email, contact, daysRemaining,JSON.stringify([transactionId])];
    data.push(newRow);

    // Convert JSON back to worksheet
    const newWorksheet = xlsx.utils.aoa_to_sheet(data);

    // Replace the old worksheet with the new one
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;

    // Write the updated workbook to the file
    await xlsx.writeFile(workbook, filePath);

    console.log(`Email ${email} added to transaction_emails.xlsx`);
  }

  try {
    await googlesheet(sheetNumber);
    console.log('Google Sheet function executed successfully.');
  } catch (error) {
    console.error('Error executing Google Sheet function:', error);
  }
};