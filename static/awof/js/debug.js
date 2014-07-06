/* Author: Robert Chrzanowski */

/*jslint browser: true, devel: true, indent: 2 */

//***** object prototypes *****
//*** consoleLog util object
//create constructor

(function () {
  "use strict";

  var nmsp = AWOF;

  nmsp.ConsoleLog = function ConsoleLog() {
  };

  //create function that will be added to the class
  nmsp.console_log = function console_log(message) {
    if (typeof console !== 'undefined' && console !== null) {
      console.log(message);
    }
  };

  //add class/static function to class by assignment
  nmsp.ConsoleLog.log = nmsp.console_log;
  //*** end console log object
  //*** frameRateCounter  object prototype

  nmsp.FrameRateCounter = function FrameRateCounter() {
    var dateTemp;

    this.lastFrameCount = 0;
    dateTemp = new Date();
    this.frameLast = dateTemp.getTime();
    this.frameCtr = 0;
  };

  nmsp.FrameRateCounter.prototype.constructor = nmsp.FrameRateCounter;

  nmsp.FrameRateCounter.prototype.countFrames =
    function frameRateCounterCountFrames() {
      var dateTemp = new Date();

      this.frameCtr += 1;

      if (dateTemp.getTime() >= this.frameLast + 1000) {
        //ConsoleLog.log("frame event");
        this.lastFrameCount = this.frameCtr;
        this.frameLast = dateTemp.getTime();
        this.frameCtr = 0;
      }
    };

  nmsp.Debugger = function () {};

  nmsp.Debugger.log = function (message) {
    try {
      console.log(message);
    } catch (exception) {
      return;
    }
  };
}());
