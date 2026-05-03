// adapters/SlotDateAdapter.js
//
// Adapter Pattern: bridges the legacy string-based date format
// stored in the Slot model with the modern Date-based interface
// needed by the new search/filter feature.
//
// The Slot model stores:
//   date:      "30 April 2026"   (string)
//   startTime: "10:00 AM"        (string)
//
// The new SearchService needs to compare slots against date ranges
// (e.g. "find all slots between May 1 and May 15"). String comparison
// fails for date ranges, so we need real Date objects.
//
// SlotDateAdapter wraps a Slot and exposes:
//   getDate()             → JS Date object
//   getDateTime()         → JS Date including start time
//   isInRange(from, to)   → boolean
//
// Mirrors Tutorial 7's LegacySecurityAdapter example: the legacy
// system isn't modified, the adapter just translates its interface.

class SlotDateAdapter {
  constructor(slot) {
    this.slot = slot; // the legacy Slot document
  }

  // Adapter method: parse the string date into a JS Date object
  getDate() {
    // "30 April 2026" → Date
    const parsed = new Date(this.slot.date);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid slot date format: "${this.slot.date}"`);
    }
    return parsed;
  }

  // Adapter method: combine date + startTime into a single Date
  getDateTime() {
    const date = this.getDate();
    // "10:00 AM" → 10, 0
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(this.slot.startTime);
    if (!match) {
      throw new Error(`Invalid slot time format: "${this.slot.startTime}"`);
    }
    let [, hours, minutes, ampm] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Adapter method: test whether the slot falls within a date range.
  // `from` and `to` may be Date objects or ISO strings (e.g. "2026-05-01").
  isInRange(from, to) {
    const slotDate = this.getDate();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    if (fromDate && slotDate < fromDate) return false;
    if (toDate && slotDate > toDate) return false;
    return true;
  }

  // Pass-through: expose the underlying slot when needed
  unwrap() {
    return this.slot;
  }
}

module.exports = SlotDateAdapter;