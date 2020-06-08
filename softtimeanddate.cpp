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


namespace timeAndDate {
    /* 
       Return the current system CPU time in s 
    */
    //%
    uint32_t cpuTimeInSeconds() {
        static uint32_t upperTimeUS = 0;    
        static uint32_t lastTimeUS = 0;
        uint32_t thisTimeUS = us_ticker_read();
        
        // Check for rollover
        if(thisTimeUS<lastTimeUS) {
            upperTimeUS++;
        }
        lastTimeUS = thisTimeUS;

        uint64_t timeUS = ((uint64_t)upperTimeUS)<<32 | ((uint64_t)thisTimeUS);
        return (uint32)(timeUS/1000000000);
    }
}