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
        static uint32_t lastUs = 0;
        static uint64_t totalUs = 0;
        uint32_t currentUs = us_ticker_read();

        uint32_t newUs = currentUs - lastUs;
        totalUs += newUs;
        lastUs = currentUs;
        // An overflow occurred
        // if(currentUs<0x7FFFFFFF && lastUs>0x7FFFFFFF) {
        //     newUs = 0xFFFFFFFF - lastUs + 1 + currentUs;
        // } else {
        //     newUs = currentUs - lastUs;
        // }
        //  newUs = currentUs - lastUs;
        // // If an error occurred skip this update.  (Should we update lastUs in either case???)
        // // if(newUs < 100*1000000) {
        //      totalUs += newUs;
        //      lastUs = currentUs;
        // // }
        // // Convert uS into seconds
        // // return totalUs / 1000000;
        return totalUs / 1000000;
    }
} // namespace timeAndDate