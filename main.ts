// keyestudio ServoCar for microbit
// (receiver module+remote controller)
// author: jieliang mo
// github:https://github.com/mworkfun
// Write the date: 2020-5-25

/**
 * use for control motor
 */
enum DIR {
    run_forward = 0,
    run_back = 1,
    Turn_Left = 2,
    Turn_Right = 3
}
enum MOTOR {
    A = 0,
    B = 1
}
enum MotorState {
    stop = 0,
    brake = 1
}

//% color="#ff6800" icon="\uf1b9"
//% groups="['Motor', 'RGB-led', 'Neo-pixel', 'Sensor', 'Tone']"
namespace ServoCar {
    /**
     * Ultrasonic sensor
     */
    const TRIG_PIN = DigitalPin.P1;
    const ECHO_PIN = DigitalPin.P2;
    let lastTime = 0;
    /////////////////////////////////////////////////////
    /**
     * car run diretion
     */
    //% block="car $direction speed: $speed \\%"
    //% speed.min=0 speed.max=100
    //% group="Motor" weight=99
    export function run(direction: DIR, speed: number) {

    }

    //% block="Run $M speed: $speed \\%"
    //% speed.min=-100 speed.max=100
    //% group="servo" weight=98
    export function Run(M: MOTOR, speed: number) {
        //send trig pulse
        pins.setPull(TRIG_PIN, PinPullMode.PullNone);
        pins.digitalWritePin(TRIG_PIN, 0)
        control.waitMicros(2);
        pins.digitalWritePin(TRIG_PIN, 1)
        control.waitMicros(10);
        pins.digitalWritePin(TRIG_PIN, 0)

        // read echo pulse  max distance : 6m(35000us)  
        let t = pins.pulseIn(ECHO_PIN, PulseValue.High, 35000);
        let ret = t;

        //Eliminate the occasional bad data
        if (ret == 0 && lastTime != 0) {
            ret = lastTime;
        }
        lastTime = t;

        return Math.round(ret / 58);
    }
}
