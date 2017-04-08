let Stoper = require('../stoper');
const config = require('../config');
const alerts = require('../alerts')

class AlertAction {
  constructor(socket, wss, broadcast) {
    this.socket = socket;
    this.wss = wss;
    this.lastAlertStoper = new Stoper();
    this.lastAlertStoper.timeStart();


    this.sittingState = 0;

    this.sittingCounter = new Stoper();

    this.notSittingCounter = new Stoper();
    this.notSittingCounter.timeStart();
  }

  parseData({type, data, source}) {
      console.log(`type: ${type}`)
      console.log(`data: ${JSON.stringify(data)}`)
      console.log(`source: ${source}`)

      if(type === 'data' && source === 'iot') {
        // if(data.rocketChair && this.sittingTime().getTime() > config.MAX_SITTING_TIME ) {
        
        if(data.rocketChair) {
            //== Sitting
            if(!this.sittingState) {
                //== Not sitting before, start sitting
                this.sittingState = 1;
                this.sittingCounter.restart()
                this.notSittingCounter.restart()
            }



          console.log('lastAlertSToper ' + this.lastAlertStoper.getTime())
            if((this.sittingCounter.getTime() > config.MAX_SITTING_TIME) && (this.lastAlertStoper.getTime() > config.ALERT_TIMEOUT)) {
                console.log('Wykurwił alert')
                this.socket.send(JSON.stringify(alerts.GET_UP_FROM_CHAIR))
                this.broadcast(this.wss, JSON.stringify(alerts.GET_UP_FROM_CHAIR))
                this.lastAlertStoper.restart()
            }
        } else {
            //== Is not sitting
            if(this.sittingState) {
                //== Start not sitting
                this.sittingState = 0;
                this.notSittingCounter.restart();
                this.sittingCounter.restart()
            }

            if((this.notSittingCounter.getTime() > config.MAX_NOT_SITTING_TIME) && (this.lastAlertStoper.getTime() > config.ALERT_TIMEOUT)) {
                this.socket.send(JSON.stringify(alerts.GET_BACK_TO_WORK))
                this.broadcast(this.wss, JSON.stringify(alerts.GET_BACK_TO_WORK))
                this.lastAlertStoper.restart()
            }
        }
      }

      //=== LOGGGING
      console.log(`sitting: ${this.sittingCounter.getTime()}`)
      console.log(`notsitting: ${this.notSittingCounter.getTime()}`)
      console.log(`lastAlert: ${this.lastAlertStoper.getTime()}`)
      
  }
}
module.exports = AlertAction;
