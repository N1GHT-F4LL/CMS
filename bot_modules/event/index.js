const fs = require('fs');
const path = require('path');

class EventManager {
  constructor() {
    this.eventsFilePath = path.join(__dirname, 'events.json');
    this.eventsData = this.loadEventsData();
  }

  loadEventsData() {
    let eventsData = [];
    if (fs.existsSync(this.eventsFilePath)) {
      const eventsJson = fs.readFileSync(this.eventsFilePath);
      eventsData = JSON.parse(eventsJson);
    }
    return eventsData;
  }

  saveEventsData() {
    fs.writeFileSync(this.eventsFilePath, JSON.stringify(this.eventsData, null, 2));
  }

  addEvent(url, startDate, startTime, endDate, endTime, isCTFd = false) {
    const start = new Date(`${startDate}T${startTime}:00Z`);
    const end = new Date(`${endDate}T${endTime}:00Z`);
    const newEvent = {
      url,
      start,
      end,
      isCTFd,
      dateAdded: new Date().toISOString(),
    };
    this.eventsData.push(newEvent);
    this.saveEventsData();
    return newEvent;
  }

  listEvents() {
    return this.eventsData;
  }
}

module.exports = EventManager;
