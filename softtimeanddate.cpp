/**
 * Bill Siever
 * 
 * This code is released under the [MIT License](http://opensource.org/licenses/MIT).
 * Please review the LICENSE.md file included with this example. If you have any questions
 * or concerns with licensing, please contact techsupport@sparkfun.com.
 * Distributed as-is; no warranty is given.
 */

#include "pxt.h"

using namespace pxt;

//#define DEBUG 1

#ifdef DEBUG
    /**
     * 
     */
// https://www.forward.com.au/pfod/microbit/gettingStarted.html
    void loopUntilSent(ManagedString str) {
    int rtn = uBit.serial.send(str);
    while(rtn == MICROBIT_SERIAL_IN_USE) {
       uBit.sleep(0); // let other tasks run
       rtn = uBit.serial.send(str); 
    }
}
void loopUntilSent(int str) {
    int rtn = uBit.serial.send(str);
    while(rtn == MICROBIT_SERIAL_IN_USE) {
       uBit.sleep(0); // let other tasks run
       rtn = uBit.serial.send(str); 
    }
}
#endif 




namespace timeAndDate
{
    /* 
       Return the current system CPU time in s 
       Must be called every 2^35/1000000 s (~=<35min) or more frequently to 
       ensure proper time keeping 
    */
    //%
    uint32_t cpuTimeInSeconds() {
        static uint32_t lastUs = 0;
        static uint64_t totalUs = 0;
        uint32_t currentUs = us_ticker_read();

        uint32_t newUs = currentUs - lastUs;
        if(!(newUs & 0x80000000)) {
            // Only add if it's positive / valid...
            totalUs += newUs; 
        }
#ifdef DEBUG
        else {
            uBit.serial.send("Oops\nCurrent=");
            uBit.serial.send((int)currentUs);
            uBit.serial.send("\nlast=");
            uBit.serial.send((int)lastUs);
            uBit.serial.send("\n");
        }
#endif


//         if(newUs>4294000000u) {
// // This can probably be simplified to just checking the 
// // high order bit:  newUs & 0x80000000
// #ifdef DEBUG
//             uBit.serial.send("Oops\nCurrent=");
//             uBit.serial.send((int)currentUs);
//             uBit.serial.send("\nlast=");
//             uBit.serial.send((int)lastUs);
//             uBit.serial.send("\n");
// #endif
//         } else {
//             // Only add if it's positive...
//             totalUs += newUs;
//         }
        lastUs = currentUs;

        return totalUs / 1000000;
    }
} // namespace timeAndDate


/*
Example Failure Cases for further review:


0000-01-01 00:01.07
Oops
Current=67175591
last=67239935
0000-01-01 00:01.08

currentUs - lastUs => -64344


0000-01-01 00:01.22
Oops
Current=82576484
last=82640895
0000-01-01 00:01.23

currentUs - lastUs => -64411

One Hypothesis:  This is splitting a read of a 4 byte value before a roll-over???
I.e. non-atomic read that leads to inconsistent result. That would 
explain why it's always off in the ballpark of 65k (~2^16)
 If so, this "filter" may actually avoid the errors.

Hmmm: https://github.com/ARMmbed/mbed-os/issues/4026
Seems somewhat likely (need to review further)
*/
