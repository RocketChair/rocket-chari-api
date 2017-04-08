let Stoper = require('../stoper');
const config = require('../config');
const alerts = require('../alerts')

class AlertAction {
  constructor(socket) {
    this.socket = socket;
    this.lastAlertStoper = new Stoper();
    this.lastAlertStoper.timeStart();

    this.sittingCunter = new Stoper();
    // this.sittingCunter.timeStart();

    this.notSittingCounter = new Stoper();
    // this.notSittingCounter.timeStart();
  }

  parseData({type, data, source}) {
      console.log(`type: ${type}`)
      console.log(`data: ${JSON.stringify(data)}`)
      console.log(`source: ${source}`)

      if(type === 'data' && source === 'iot') {
        // if(data.rocketChair && this.sittingTime().getTime() > config.MAX_SITTING_TIME ) {
        if(data.rocketChair) {
          console.log('lastAlertSToper ' + this.lastAlertStoper.getTime())
            if(this.lastAlertStoper.getTime() > config.ALERT_TIMEOUT) {
                console.log('Wykurwił alert')
                this.socket.send(JSON.stringify(alerts.GET_UP_FROM_CHAIR))
                this.lastAlertStoper.restart()
            } else {
                console.log('Nie wykurwił')

            }
        } else {
            //== Is not sitting
        }
      }
  }
}
module.exports = AlertAction;
