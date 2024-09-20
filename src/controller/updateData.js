import xlsx from 'xlsx';
import path from 'path';
import cron from 'node-cron';
import { googlesheet } from './googleSheetController.js';
import ConnectWithMeRepository from '../Repository/ConnectWithMerepostory.js';
import PersonalNewsLetterRepository from '../Repository/personalnewsLetterRepository.js';


const updateExcelFile = async () => {
    const filePath1 = path.join(path.resolve('transaction_emails.xlsx_1'));
    const filePath2 = path.join(path.resolve('transaction_emails.xlsx_2'));
    const workbook1 = xlsx.readFile(filePath1);
    const sheetName1 = workbook1.SheetNames[0];
    const workSheet1 = workbook1.Sheets[sheetName1];

    const workbook2 = xlsx.readFile(filePath2);
    const sheetName2 = workbook2.SheetNames[0];
    const workSheet2 = workbook2.Sheets[sheetName2];

    const data1 = xlsx.utils.sheet_to_json(workSheet1, { header: 1 });
    const header1 = data1[0];
    const daysRemainingIndex1 = header1.indexOf('Days Remaining');

    const data2 = xlsx.utils.sheet_to_json(workSheet2, { header: 1 });
    const header2 = data2[0];
    const daysRemainingIndex2 = header2.indexOf('Days Remaining');


    if (daysRemainingIndex1 !== -1) {
        for (let i = 1; i < data1.length; i++) {
            const currentValue = parseFloat(data1[i][daysRemainingIndex1]);
            data1[i][daysRemainingIndex1] = Math.max(currentValue - 1, 0);
        }

        const updatedWorkSheet = xlsx.utils.aoa_to_sheet(data1);

        // Update the worksheet in the workbook
        workbook1.Sheets[sheetName1] = updatedWorkSheet;

        xlsx.writeFile(workbook1, filePath1);

        console.log('Excel File Updated Successfully!');
    } else {
        console.error("Column 'Days Remaining' not found");
    }

    if (daysRemainingIndex2 !== -1) {
        for (let i = 1; i < data2.length; i++) {
            const currentValue = parseFloat(data2[i][daysRemainingIndex2]);
            data2[i][daysRemainingIndex2] = Math.max(currentValue - 1, 0);
        }

        const updatedWorkSheet = xlsx.utils.aoa_to_sheet(data2);

        // Update the worksheet in the workbook
        workbook2.Sheets[sheetName2] = updatedWorkSheet;

        xlsx.writeFile(workbook2, filePath2);

        console.log('Excel File Updated Successfully!');
    } else {
        console.error("Column 'Days Remaining' not found");
    }

    try {
        await googlesheet(1);
        await googlesheet(2);
        console.log('Google Sheet function executed successfully.');
      } catch (error) {
        console.error('Error executing Google Sheet function:', error);
      }
}

const connectWithMe = async() =>{
    try{
        const users = await ConnectWithMeRepository.getUser();
        for(let i =0;  i< users.length; i++){
            const storedEndDate = new Date(users[i].endDate);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if(storedEndDate < currentDate){
                await ConnectWithMeRepository.deleteUser(users[i]._id);
            }else{
                console.log("User is valid");
                
            }
        }
    }catch(err){
        console.log(err);
        
    }

}
const personalNewsletter = async() =>{
    try{
        const users = await PersonalNewsLetterRepository.getUser();
        for(let i =0;  i< users.length; i++){
            const storedEndDate = new Date(users[i].endDate);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if(storedEndDate < currentDate){
                await PersonalNewsLetterRepository.deleteUser(users[i]._id);
            }else{
                console.log("User is valid");
                
            }
        }
    }catch(err){
        console.log(err);
        
    }

}


cron.schedule('0 0 * * *',() =>{
    updateExcelFile();
    connectWithMe();
    personalNewsletter();
});