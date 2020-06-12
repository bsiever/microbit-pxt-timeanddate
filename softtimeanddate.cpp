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

// Enable debugging or not:
// #define DEBUG 1


namespace timeanddate
{
    /* 
       Return the current system CPU time in s 
       Must be called 2x+ every 2^32/1000000 s (~=<15min) or more frequently to 
       ensure proper time keeping 
    */
    //%
    uint32_t cpuTimeInSeconds() {
        static uint32_t lastUs = 0;
        static uint64_t totalUs = 0;
#ifdef DEBUG
        uint32_t retries = 0;
#endif
        // Continue to get ticker values until they are valid
        while(true) {
            uint32_t currentUs = us_ticker_read();

            uint32_t newUs = currentUs - lastUs;
            // Note: There appears to be a race-condition.  I think it's related to atomic access to the ticker value 
            // and occasionally results in ticker values decreasing (Perhaps related to https://github.com/ARMmbed/mbed-os/issues/4026)
            // Following "normal" rollover of the ticker counter values also decrease, so we can't simply check if currentUs>lastUs (it won't be on rollover).
            // Instead we check the magnitude of the result.  If it represents a large number then we discard it and don't update the total count. 
            // The update period needs to ensure that there will be multiple attempts again before a high-magnitude value would be valid.
            // See notes / comment at the bottom of this file
            // Prior attempt:
            //  if(newUs<4294000000u) {
            if(!(newUs & 0x80000000)) {
                // Only add if it's positive / valid...
                totalUs += newUs; 
                lastUs = currentUs;
                break;  // Leave the loop
            }
#ifdef DEBUG
            else {
                retries++;
                // TODO: Should there be a fiber_sleep(1) here?
                // I'm assuming that a nearly immediate re-try will not
                // be a problem...but not sure.   Yup...That was wrong. Trying the fiber thingy. 
                fiber_sleep(0);
                // uBit.serial.send("Error\ncurrentUs=");
                // uBit.serial.send((int)currentUs);
                // uBit.serial.send("\nlastUs=");
                // uBit.serial.send((int)lastUs);
                // uBit.serial.send("\n");
            }
#endif

        }
#ifdef DEBUG
        if(retries!=0) {
            uBit.serial.send("Retries=");
            uBit.serial.send((int)retries);
        }
#endif

        return totalUs / 1000000;
    }
} // namespace timeanddate



/*
The hypothesis is that failures happens by non-atomic access to a counter that rolls 
over at a 16-bit boundary (because the examples below were all off by ~65k off)


Example Failure Cases for further review are below.  These were caught by specifically looking for "large" failures via an if-statement.  
Other small failures may have been missed.  These show the values of the last timestamp before the error, currentUs, lastUs, the timestamp 
after the error, and the difference between currentUs and lastUs (which whould be positive and ~65k uS / 2s at the sample rate being used)

0000-01-01 00:01.07
Error
currentUs=67175591
lastUs=67239935
0000-01-01 00:01.08
currentUs - lastUs => -64344


0000-01-01 00:01.22
Error
currentUs=82576484
lastUs=82640895
0000-01-01 00:01.23
currentUs - lastUs => -64411

The negative value could be caused by a rollover from one byte to the next being accessed non-atomically. For example, consider two successive
reads of a mult-byte piece of data that is divided into two halves, a HIGH and a LOW:
   HIGH   LOW
Imagine they are read and then approximately 65k uS later (2s or 65k counts) they are read again. 
If the "LOW" has rolled over from a high value (0xFF...) to a low value (0x00...) but the carry has not 
yet been added to HIGH when the read occurs, then the value of the second read would be lower than the 
value of the first read, leading to an inconsistent result.  The difference in values would be negative
rather than a modest positive value. 

This may be related to: https://github.com/ARMmbed/mbed-os/issues/4026




Consider:

Sequence of 2-part reads
95  50
96  00    <- Invalid read.  Read as 95 00
96  50
97  00


last = 95 50
current = 95 00     <- Error detected;  No update to overall timer
                       (should have added 50)

last = 95 00  
current = 96 50     <-  Valid --- Adds 150   (should be up a net of 100, not 150)


If instead
last = 95 50 
current = 96 50    <- Adds 100 (correct)



O.k....The 24-bit counter will overflow every 512s, so checks need to be done at least that often.
Reading the counter is done in: https://github.com/ARMmbed/mbed-hal-nrf51822-mcu/blob/master/source/us_ticker.c 's rtc1_getCounter64() 
(it was called by us_ticker_read()).  That clearly has a race or atomicity error. It checks overflow then gets the count (while the counter is 
still running!!!!)

So, errors can happen every 512s (8.5min).  They are due to a small atomicity problem.  The error will occur in the lower 24-bits returned from rtc1_getCounter64()
being inconsistent (the total value won't appear to increase monotonically due to the non-atomic access at rollover.  The Carry won't be added
to the upper bits yet while the counter will have rolled over)

The problem would always exhibit as non-monotonic counts (a sample being lower than its predecessor), which is being detected / filtered out. 
It's taking ~7ms to resolve (I think based on counts when fiber_sleep(1) is used). Which is a weird number.  
*/
