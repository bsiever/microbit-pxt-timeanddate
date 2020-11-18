/**
 * Bill Siever
 * 
 * This code is released under the [MIT License](http://opensource.org/licenses/MIT).
 * Please review the LICENSE file.
 */

// Enable debugging or not:
//#define DEBUG 1
#define V2 1

#ifdef V2
#include "MicroBitSystemTimer.h"
#else
using namespace pxt;
#include "pxt.h"

//From: https://github.com/ARMmbed/nrf51-sdk/blob/master/source/nordic_sdk/components/drivers_nrf/delay/nrf_delay.h
static void __INLINE nrf_delay_us(uint32_t volatile number_of_us) __attribute__((always_inline));
static void __INLINE nrf_delay_us(uint32_t volatile number_of_us)
{
register uint32_t delay __ASM ("r0") = number_of_us;
__ASM volatile (
    ".syntax unified\n"
    "1:\n"
    " SUBS %0, %0, #1\n"
    " NOP\n"
    " NOP\n"
    " NOP\n"
    " NOP\n"
    " NOP\n"
    " NOP\n"   
    " NOP\n"  
    " NOP\n"
    " NOP\n"
    " NOP\n"
    " NOP\n"
    " NOP\n"
    " BNE 1b\n"
    ".syntax divided\n"
    : "+r" (delay));
}
#endif 

namespace timeanddate
{
    /* 
       Return the current system CPU time in s 
       Must be called 2x+ every 2^32/1000000 s (~=<15min) or more frequently to 
       ensure proper time keeping 
    */
    //%
    uint32_t cpuTimeInSeconds() {
#ifdef V2
        return system_timer_current_time_us() / 1000000;

#else
        static uint32_t lastUs = 0;
        static uint64_t totalUs = 0;
#ifdef DEBUG
        uint32_t retries = 0;
        static uint32_t lastLastUs = 0;
#endif
        uint32_t currentUs;
        // Continue to get ticker values until they are valid
        while(true) {
            // Try a read 
            currentUs = us_ticker_read();
            // If it was near the end of the phase, read again 
            // (avoid non-atomic access / race condition error)
            while((currentUs & 0x0000FFFF) > 0x0000FFC0) {  
                // Ensure timer before last 64uS of cycle (uS ticker should be about 5uS? Check!)
                nrf_delay_us(100);
                currentUs = us_ticker_read();
            }
            uint32_t newUs = currentUs - lastUs;

            // Sanity check: only proceed if it's NOT negative  
            if(!(newUs & 0x80000000)) {
                // Only add if it's positive (time increased) / valid NOT if the high bit is set)...
                totalUs += newUs; 
#ifdef DEBUG    
                lastLastUs = lastUs;
#endif
                lastUs = currentUs;
                break;  // Leave the loop on valid update
            }
            else {
                // The read isn't valid.  Try again soon.
                fiber_sleep(0);
#ifdef DEBUG
                retries++;
                // Additional debugging info:
                uBit.serial.send("\nError");
                uBit.serial.send("\nlastLastUs=");
                uBit.serial.send((int)lastLastUs);
                uBit.serial.send("\nlastUs=");
                uBit.serial.send((int)lastUs);
                uBit.serial.send("\ncurrentUs=");
                uBit.serial.send((int)currentUs);
                uBit.serial.send("\n");
#endif
            }
        }
#ifdef DEBUG
        if(retries!=0) {
            uBit.serial.send("Retries=");
            uBit.serial.send((int)retries);
            uBit.serial.send("\nFinal\nlastUs=");
            uBit.serial.send((int)lastUs);
            uBit.serial.send("\ncurrentUs=");
            uBit.serial.send((int)currentUs);
            uBit.serial.send("\nlastLastUs=");
            uBit.serial.send((int)lastLastUs);
            uBit.serial.send("\n");
        }
#endif

        return totalUs / 1000000;
#endif
    }
} // namespace timeanddate

/*

Here's the us_ticker_read():
https://github.com/lancaster-university/mbed-classic/blob/427f56863c9f9a9132a213ec583469dfc61c6244/targets/hal/TARGET_NORDIC/TARGET_MCU_NRF51822/us_ticker.c

Returns: 
  TMR1_UNITS_TO_MICROSECONDS(tmr1_getCounter64());
  Which expands to:
    tmr1_getCounter64()  (Yeah, that's dumb / unnesc)

And tmr1_getCounter64() is an inline that returns:
    return (((uint64_t)(overflowCount)) << 16) | (NRF_TIMER1->CC[2] & MAX_TMR1_COUNTER_VAL);

NOTE THE 16-bit BOUNDARY!!!! 

This is a non-atomic read problem.   Just reject reads if NRF_TIMER1->CC[2] & MAX_TMR1_COUNTER_VAL is close to the
boundary (and of the phase / wrap around).  
*/