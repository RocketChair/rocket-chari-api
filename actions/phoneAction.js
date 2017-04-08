let Stoper = require("../stoper");

class PhoneAction {
  constructor(socet) {
    this.isBreak = false;
    this.socet = socet;
    this.stoperLocal = new Stoper();
    this.errorTimeOut = () => {};
  }

  setState(state) {
    console.log("state", state);
    if (state) {
      this.sssss();
      this.killErrorTimeOut();
    } else {
      sendMessegToRun();
    }
  }

  sssss() {
    this.stoperGlobal = new Stoper(10);
    this.stoperGlobal.timeStart();
    this.stoperGlobal.on("timeIsEnd", () => {
      console.log("sssss - timeIsEnd - go to chair");
      this.socet.send({
        type: "message-phone",
        message: "go to chair"
      });
    });
  }

  killErrorTimeOut() {
    clearInterval(this.errorTimeOut);
    this.errorTimeOut = () => {};
  }

  sendMessegToRun() {
    this.errorTimeOut = setTimeout(() => {
      new Stoper(1).on("timeIsEnd", () => {
        console.log("sendMessegToRun - go go go");
        this.socet.send({
          type: "message-phone",
          message: "go go go"
        });
      });
    });
  }
}
module.exports = PhoneAction;
