/**
 * Control micro servos
 */
//% color="#ff6800" icon="\uf1b9" 
//% groups='["Car", "Servo", "Configuration"]'
namespace ServoCar {

    //% fixedInstances
    export class Servo {
        private _minAngle: number;
        private _maxAngle: number;
        private _stopOnNeutral: boolean;

        constructor() {
            this._minAngle = 0;
            this._maxAngle = 180;
            this._stopOnNeutral = false;
        }

        private clampDegrees(degrees: number): number {
            degrees = degrees | 0;
            degrees = Math.clamp(this._minAngle, this._maxAngle, degrees);
            return degrees;
        }

        /**
         * Set the servo angle
         */
        //% weight=100 help=servos/set-angle
        //% blockId=servoservosetangle block="set %servo angle to %degrees=protractorPicker °"
        //% degrees.defl=90
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        //% group="Servo"
        setAngle(degrees: number) {
            degrees = this.clampDegrees(degrees);
            this.internalSetAngle(degrees);
        }

        protected internalSetAngle(angle: number): void {

        }

        /**
         * Stop sending commands to the servo so that its rotation will stop at the current position.
         */
        // On a normal servo this will stop the servo where it is, rather than return it to neutral position.
        // It will also not provide any holding force.
        //% weight=10 help=servos/stop
        //% blockId=servoservostop block="stop %servo"
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        //% group="Servo"
        stop() {
            this.internalStop();
        }
        protected internalStop() { }

        /**
         * Gets the minimum angle for the servo
         */
        public get minAngle() {
            return this._minAngle;
        }

        /**
         * Gets the maximum angle for the servo
         */
        public get maxAngle() {
            return this._maxAngle;
        }

    }

    export class PinServo extends Servo {
        private _pin: PwmOnlyPin;

        constructor(pin: PwmOnlyPin) {
            super();
            this._pin = pin;
        }

        protected internalSetAngle(angle: number): void {
            this._pin.servoWrite(angle);
        }

        protected internalSetPulse(micros: number): void {
            this._pin.servoSetPulse(micros);
        }

        protected internalStop() {
            this._pin.digitalWrite(false);
        }

        InternalSetAngle(angle: number): void {
            this._pin.servoWrite(angle);
        }
    }

    let leftWheel = new PinServo(pins.P0);
    let rightWheel = new PinServo(pins.P1);
    let shovel = new PinServo(pins.P2);

    /**
     * Set the car speed
     * angle can control speed
     */
    //% block="Car %directe speed: %Speed"
    //% Speed.min=0 Speed.max=100
    //% group="Car"
    export function Run(directe: DIR, Speed: number) {
        let CW = Math.map(Speed, 0, 100, 90, 180);
        let CCW = Math.map(Speed, 0, 100, 90, 0);
        if (directe == 0) {
            leftWheel.InternalSetAngle(CW);
            rightWheel.InternalSetAngle(CCW);
        }
        if (directe == 1) {
            leftWheel.InternalSetAngle(CCW);
            rightWheel.InternalSetAngle(CW);
        }
        if (directe == 2) {
            leftWheel.InternalSetAngle(CW);
            rightWheel.InternalSetAngle(CW);
        }
        if (directe == 3) {
            leftWheel.InternalSetAngle(CCW);
            rightWheel.InternalSetAngle(CCW);
        }
    }
    /**
     * Car stop
     */
    //% block="Car Stop"
    //% group="Car"
    export function Stop() {
        leftWheel.InternalSetAngle(90);
        rightWheel.InternalSetAngle(90);
    }

    /**
     * car's shovel
     */
    //% block="Angle of Car's shovel: %angle °"
    //% angle.min=0 angle.max=90
    //% group="Car"
    export function Shovel(angle: number) {
        shovel.InternalSetAngle(angle);
    }
}

enum DIR {
    runForward = 0,
    runBack = 1,
    turnLeft = 2,
    turnRight = 3
}


