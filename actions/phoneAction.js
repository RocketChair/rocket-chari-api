let Stoper = require("../stoper");

class PhoneAction {
  constructor(socet) {
    this.isBreak = false;
    this.socet = socet;
    this.stoperLocal = new Stoper();
  }

  setState(state) {
    if (state) {
      this.sssss();
    } else {
      sendMessegToRun();
    }
  }

  sssss() {
    this.stoperGlobal = new Stoper(10);
    this.stoperGlobal.timeStart();
    this.stoperGlobal.on("timeIsEnd", () => {
      this.socet.send({
        type: "message",
        message: "go to chair"
      });
    });
  }

  sendMessegToRun() {
    setTimeout(() => {
      new Stoper(1).on("timeIsEnd", () => {
        this.socet.send({
          type: "message",
          message: "go go go"
        });
      });
    });
  }
}
module.exports = PhoneAction;
