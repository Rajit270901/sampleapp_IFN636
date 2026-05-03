// services/SearchService.js
//
// Search service for the new Search & Filter feature.
// Uses the SlotDateAdapter (Adapter pattern) to perform date-range
// filtering on string-based slot dates.

const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");
const SlotDateAdapter = require("../adapters/SlotDateAdapter");

class SearchService {
  // Filter doctors by specialization keyword (case-insensitive partial match)
  // and optionally by availability.
  static async searchDoctors({ specialization, availableOnly }) {
    const query = {};
    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }
    if (availableOnly === "true" || availableOnly === true) {
      query.isAvailable = true;
    }
    return await Doctor.find(query);
  }

  // Filter slots by doctor, date range, and availability.
  // Uses the Adapter to perform the date-range comparison.
  static async searchSlots({ doctorId, from, to, availableOnly }) {
    const query = {};
    if (doctorId) query.doctor = doctorId;
    if (availableOnly === "true" || availableOnly === true) query.isBooked = false;

    const slots = await Slot.find(query).populate(
      "doctor",
      "name specialization email phone"
    );

    // If no date range supplied, return everything matching the basic query.
    if (!from && !to) return slots;

    // Wrap each slot in the adapter and filter by range.
    return slots.filter((slot) => {
      try {
        const adapter = new SlotDateAdapter(slot);
        return adapter.isInRange(from, to);
      } catch (err) {
        // Malformed date — skip rather than crash the whole search
        return false;
      }
    });
  }
}

module.exports = SearchService;