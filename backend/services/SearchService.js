// slot dates are stored as strings so SlotDateAdapter is used for date range filtering
// https://www.w3schools.com/js/js_dates.asp

const Doctor = require("../models/Doctor"); // importing doctor model https://www.w3schools.com/nodejs/nodejs_modules.asp
const Slot = require("../models/Slot"); // importing slot model https://www.w3schools.com/nodejs/nodejs_modules.asp
const SlotDateAdapter = require("../adapters/SlotDateAdapter"); // adapter converts slot string dates into Date objects

class SearchService { // class keeps search logic together https://www.w3schools.com/js/js_classes.asp
  // searches doctors by specialization and availability
  static async searchDoctors({ specialization, availableOnly }) { // static async method https://www.w3schools.com/js/js_class_static.asp
    const query = {};
    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" }; // regex allows partial and case insensitive search https://www.w3schools.com/js/js_regexp.asp
    }
    if (availableOnly === "true" || availableOnly === true) {
      query.isAvailable = true; // only returns available doctors when requested
    }
    return await Doctor.find(query);
  }

  // searches slots by doctor date range and availability
  // adapter is used here because normal string date comparison is not reliable
  static async searchSlots({ doctorId, from, to, availableOnly }) {
    const query = {};
    if (doctorId) query.doctor = doctorId;
    if (availableOnly === "true" || availableOnly === true) query.isBooked = false;

    const slots = await Slot.find(query).populate(
      "doctor",
      "name specialization email phone"
    );

    // if no date range is selected then return basic filtered results
    if (!from && !to) return slots;

    // each slot is wrapped in adapter before checking date range
    return slots.filter((slot) => { // filter keeps only slots that match the range https://www.w3schools.com/jsref/jsref_filter.asp
      try { // used because some slot dates may not parse properly https://www.w3schools.com/js/js_errors.asp
        const adapter = new SlotDateAdapter(slot);
        return adapter.isInRange(from, to);
      } catch (err) {
        // skip bad date instead of crashing whole search
        return false;
      }
    });
  }
}

module.exports = SearchService; // exporting service so routes can use it https://www.w3schools.com/nodejs/nodejs_modules.asp