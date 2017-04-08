let Stoper = require("../stoper");

class PhoneAction {
  constructor(socet) {
    setTimeout(() => {
      new Stoper(10).on("timeIsEnd", () => {
        this.isBreak = true;
        console.log("sendMessegToRun 11 - go go go");
        this.socet.send(
          JSON.stringify({
            type: "message-phone",
            data: {
              message: "go go go"
            }
          })
        );
      });
    });

    this.isBreak = false;
    this.socet = socet;
    this.stoperLocal = new Stoper();
    this.errorTimeOut = () => {};
  }

  setState(state) {
    console.log("state------------->", state);
    if (this.isBreak === false) {
      false;
    }
    if (state) {
      this.killErrorTimeOut();
    } else {
      this.sendMessegToRun();
    }
  }

  sssss() {
    this.stoperGlobal = new Stoper(10);
    this.stoperGlobal.timeStart();
    this.stoperGlobal.on("timeIsEnd", () => {
      console.log("sssss - timeIsEnd - go to chair");
      this.socet.send(
        JSON.stringify({
          type: "message-phone",
          data: {
            message: "go to chair"
          }
        })
      );
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
        this.socet.send(
          JSON.stringify({
            type: "message-phone",
            data: {
              message: "go go go"
            }
          })
        );
      });
    });
  }

  gogogo() {}
}
module.exports = PhoneAction;
