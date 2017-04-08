const EventEmitter = require("events");

class Stoper extends EventEmitter {
  constructor(timeToEnd) {
    super();
    this.timeToEnd = timeToEnd || 0;
    this.time = 0;
  }

  timeStart() {
    this.timeFunction = setInterval(
      () => {
        this.time += 1;
        if (this.timeToEnd > 0) {
          if (this.timeToEnd === this.time) {
            this.emit("timeIsEnd");
          }
        }
      },
      1000
    );
  }

  addToTime(Seconds) {
    return (this.time += Seconds);
  }

  tiemEnd() {
    this.tiem = 0;
    clearInterval(this.timeFunction);
  }

  getTime() {
    return this.time;
  }

  restart() {
    this.tiemEnd();
    this.timeStart();
  }
}

module.exports = Stoper;
