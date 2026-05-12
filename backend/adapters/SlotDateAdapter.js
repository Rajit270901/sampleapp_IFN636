// adapter pattern used here because slot stores date and time as strings
// but the search feature needs proper javascript date objects
// https://www.w3schools.com/js/js_dates.asp

class SlotDateAdapter { // class used to wrap the slot object https://www.w3schools.com/js/js_classes.asp
  constructor(slot) { // constructor runs when adapter object is created https://www.w3schools.com/js/js_class_intro.asp
    this.slot = slot; // keeping the original slot document
  }

  // converts slot date string into a real Date object
  getDate() {
    // example "30 April 2026" becomes Date
    const parsed = new Date(this.slot.date); // creates date object from the slot date string https://www.w3schools.com/js/js_dates.asp
    if (isNaN(parsed.getTime())) { // checks if the date is invalid https://www.w3schools.com/jsref/jsref_isnan.asp
      throw new Error(`Invalid slot date format: "${this.slot.date}"`); // throws error if date cannot be parsed https://www.w3schools.com/js/js_errors.asp
    }
    return parsed;
  }

  // combines date and start time into one Date object
  getDateTime() {
    const date = this.getDate();
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(this.slot.startTime); // regex checks the time format https://www.w3schools.com/js/js_regexp.asp
    if (!match) {
      throw new Error(`Invalid slot time format: "${this.slot.startTime}"`);
    }
    let [, hours, minutes, ampm] = match; // destructuring values from regex result https://www.w3schools.com/js/js_destructuring.asp
    hours = parseInt(hours, 10); // converts hour string into number https://www.w3schools.com/jsref/jsref_parseint.asp
    minutes = parseInt(minutes, 10);
    if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12; // converts PM time to 24 hour format https://www.w3schools.com/jsref/jsref_touppercase.asp
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0); // sets the time on the date object https://www.w3schools.com/jsref/jsref_sethours.asp
    return date;
  }

  // checks if the slot date is inside the selected date range
  // from and to can be date objects or date strings
  isInRange(from, to) {
    const slotDate = this.getDate();
    const fromDate = from ? new Date(from) : null; // ternary keeps it null if no from date is given https://www.w3schools.com/js/js_comparisons.asp
    const toDate = to ? new Date(to) : null;

    if (fromDate && slotDate < fromDate) return false; // stops if slot is before range
    if (toDate && slotDate > toDate) return false; // stops if slot is after range
    return true;
  }

  // returns the original slot when needed
  unwrap() {
    return this.slot;
  }
}

module.exports = SlotDateAdapter; // exporting adapter so services can use it https://www.w3schools.com/nodejs/nodejs_modules.asp