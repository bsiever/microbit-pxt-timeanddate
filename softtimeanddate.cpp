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

namespace timeAndDate
{
    /* 
       Return the current system CPU time in s 
    */
    //%
    uint32_t cpuTimeInSeconds() {
        static uint32_t lastTicks = 0;
        static uint64_t totalTicks = 0;
        uint32_t currentTicks =  NRF_RTC1->COUNTER; // *((uint32_t*)0x40011504L); 

        // Only update if it's not an overflow condition
        if(currentTicks != 0xFFFFF0) { blerg
            uint32_t newTicks;
            // An overflow occurred
            if(currentTicks<lastTicks) {
                newTicks = 0x1000000 - lastTicks + currentTicks;
            } else {
                newTicks = currentTicks - lastTicks;
            }
            totalTicks += newTicks;
            lastTicks = currentTicks;
        }
        // Convert ticks into seconds
        return totalTicks / 32768;
    }
} // namespace timeAndDate