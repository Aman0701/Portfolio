export default class DateModel {
    /**
     * Returns a formatted date string from a given timestamp.
     */
    static getDate(timestamp) {
      const dateObject = new Date(timestamp);
      const year = dateObject.getFullYear();
      const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObject.getDate().toString().padStart(2, '0');
      const dateStringCustom = `${day}/${month}/${year}`;
  
      return dateStringCustom;
    }
  
    /**
     * Returns a formatted time string from a given timestamp.
     */
    static getTime(timestamp) {
      const dateObject = new Date(timestamp);
  
      // Step 3: Extract the time in 12-hour format
      let hours = dateObject.getHours();
      const minutes = dateObject.getMinutes().toString().padStart(2, '0');
      const seconds = dateObject.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM'
      
      // Convert hours to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // The hour '0' should be '12'
      hours = hours.toString().padStart(2, '0');
      
      const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
  
      return timeString;
    }
  }