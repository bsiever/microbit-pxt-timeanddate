
// Tested on https://makecode.com/playground



enum MornNight {
    //% block="am"
    AM,
    //% block="pm"
    PM
}

enum TimeUnit {
    //% block="ms"
    Milliseconds,
    //% block="Seconds"
    Seconds,
    //% block="Minutes"
    Minutes,
    //% block="Hours"
    Hours,
    //% block="Days"
    Days
}

enum TimeFormat {
    //% block="with am / pm"
    AMPM,
    //% block="as 24-hr"
    HHMM24hr
}

enum DateFormat {
    //% block="as Day/Month"
    DM,
    //% block="as Day/Month/Year"
    DMYYYY,
    //% block="as YEAR-MONTH-DAY"
    YYYY_MM_DD
}

// Fontawesome Unicode maybe: "&#xf017;"
//% color="#AA278D"  icon="\u23f0" 
namespace timeAndDate {
    interface DateTime {
      month: number  // 1-12 Month of year
      day:   number  // 1-31 / Day of month
      year:  number  // Assumed to be 2020 or later
      hour:  number  // 0-23 / 24-hour format  
      minute: number // 0-59 
      second: number // 0-59
      dayOfYear: number // 1-366
    }


    let year = 0
    let timeToSetpoint = 0
    let cpuTimeAtSetpoint = 0

    const cdoy = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]

    function isLeapYear(y: number) : boolean {
        return (y % 400 == 0 || (y % 100 != 0 && y % 4 == 0))
    }

    function dateToDayOfYear(m: number, d: number, y: number) {
        // Assumes a valid date
        let dayOfYear = cdoy[m] + d
        // Handle after Feb in leap years:
        if(m>2 && isLeapYear(y)) {
            dayOfYear += 1
        }
        return dayOfYear
    }

    // Returns a DateTime with just Month/Year
    function dayOfYearToMonthAndDay(d: number, y: number): DateTime {
        // If it's after Feb in a leap year, adjust
        if(isLeapYear(y)) { 
            if(d==60) {
                return {month: 2, day: 29, year:0, hour:0, minute: 0, second: 0, dayOfYear:0}
            } else if(d>60) {
                d -= 1  // Adjust for leap day
            }
        }
        for (let i = 1; i < cdoy.length; i++) {  // Adjust for 1- based index
            // If the day lands in (not through) this month, return it
            if(d<=cdoy[i + 1]) {
                return { month: i, day: d - cdoy[i], year: 0, hour: 0, minute: 0, second: 0, dayOfYear: 0 }
                
            }
        }
        return { month: -1, day: -1, year: 0, hour: 0, minute: 0, second: 0, dayOfYear: 0 }
    }

    function secondsSoFarForYear(m: number, d: number, y: number, hh: number, mm: number, ss:number): number {
        // ((((Complete Days * 24hrs/ day)+complete hours)*60min/ hr)+complete minutes)* 60s/ min + complete seconds
        return (((dateToDayOfYear(m, d, y) - 1) * 24 + hh) * 60 + mm) * 60 + ss
    }

    function timeFor(cpuTime: number): DateTime {
        const deltaTime = cpuTime - cpuTimeAtSetpoint
        let sSinceStartOfYear = timeToSetpoint + deltaTime
        // Find elapsed years by counting up from start year and subtracting off complete years
        let y = year
        let leap = isLeapYear(y)
        while ((!leap && sSinceStartOfYear > 365 * 24 * 60 * 60) || (sSinceStartOfYear > 366 * 24 * 60 * 60)) {
            if(leap) {
                sSinceStartOfYear -= 366 * 24 * 60 * 60 
            } else {
                sSinceStartOfYear -= 365 * 24 * 60 * 60
            }
            y += 1
            leap = isLeapYear(y)
        }

        // sSinceStartOfYear and leap are now for "y", not "year"
        // Find elapsed days
        const daysFromStartOfYear = Math.floor(sSinceStartOfYear/(24*60*60))+1  // Offset for 1/1 being day 1
        const secondsSinceStartOfDay = sSinceStartOfYear % (24 * 60 * 60)

        // Find elapsed hours
        const hoursFromStartOfDay = Math.floor(secondsSinceStartOfDay/(60*60))
        const secondsSinceStartOfHour = secondsSinceStartOfDay % (60 * 60)

        // Find elapsed minutes
        const minutesFromStartOfHour = Math.floor(secondsSinceStartOfHour/(60))
        // Find elapsed seconds
        const secondsSinceStartOfMinute = secondsSinceStartOfHour % (60)

        // Convert days to dd/ mm
        const ddmm = dayOfYearToMonthAndDay(daysFromStartOfYear, y) // current year, y, not start year
        return {month: ddmm.month, day: ddmm.day, year: y, hour: hoursFromStartOfDay, minute: minutesFromStartOfHour, second: secondsSinceStartOfMinute, dayOfYear: daysFromStartOfYear}
    }

    function timeInSeconds() : number {
        return Math.floor(input.runningTime()/1000)
    }

    //% block="set time from 24-hour time |  %hour | : %minute | . %second"
    //% hour.min=0 hour.max=23
    //% minute.min=0 minute.max=59
    //% second.min=0 second.max=59
    export function set24HourTime(hour: number, minute: number, second: number) {
        const cpuTime = timeInSeconds()
        const t = timeFor(cpuTime)
        cpuTimeAtSetpoint = cpuTime
        timeToSetpoint = secondsSoFarForYear(t.month, t.day, t.year, hour, minute, second)
    }


function DateTimeString(t: DateTime) : string {
    return t.month + "/" + t.day + "/" + t.year + " " + t.hour + ":" + t.minute + "." + t.second + "  " + t.dayOfYear
}

    //% block="set date to | Month %month | / Day %day | / Year %tyear"
    //% month.min=1 month.max=12
    //% day.min=0 day.max=31
    //% tyear.min=0 tyear.max=2050
    export function setDate(month: number, day: number, tyear: number) {
        const cpuTime = timeInSeconds()
        const t = timeFor(cpuTime)
        year = tyear
        cpuTimeAtSetpoint = cpuTime
        timeToSetpoint = secondsSoFarForYear(month, day, year, t.hour, t.minute, t.second)
    }

    //% block="set time to |  %hour | : %minute | . %second | %ampm"
    //% hour.min=0 hour.max=23
    //% minute.min=0 minute.max=59
    //% second.min=0 second.max=59
    //% inlineInputMode=inline
    export function setTime(hour: number, minute: number, second: number, ampm: MornNight) {
        // Adjust to 24-hour time format
        if (ampm == MornNight.AM && hour == 12) {  // 12am -> 0 hundred hours
            hour = 0;
        } else if (hour < 12) {        // PMs other than 12 get shifted after 12:00 hours
            hour = hour + 12;
        }
        set24HourTime(hour, minute, second);     
    }

    // This can cause overflow or underflow (adding 1 minute could change the hour)
    // Add or subtract time with the given unit. 
    //% block="advance time/date by | %amount | %unit "
    export function advanceBy(amount: number, unit: TimeUnit) {
        const units = [1, 60 * 1, 60 * 60 * 1, 24 * 60 * 60 * 1]
        cpuTimeAtSetpoint -= amount * units[unit]
    }





    //% block="current time as numbers $hour:$minute.$second on $weekday, $day/$month/$year, $dayOfYear" advanced=true
    //% draggableParameters=variable
    //% handlerStatement=1
    export function numericTime(handler: (hour: number, minute: number, second: number, weekday: number, day: number, month: number, year: number, dayOfYear: number) => void) {

    }

    function leftZeroPadTo(inp: number, digits: number) {
        let value = inp + ""
        while(value.length<digits) {
            value = "0"+value
        }
        return value
    }


    //% block="current time $format"
    export function time(format: TimeFormat): string {
        const cpuTime = timeInSeconds()
        const t = timeFor(cpuTime)
        switch(format) {
            case TimeFormat.HHMM24hr:
                return leftZeroPadTo(t.hour,2) + ":" + leftZeroPadTo(t.minute, 2) + "." + leftZeroPadTo(t.second,2)
                break
            case TimeFormat.AMPM:
                let hour = t.hour
                let ap = t.hour<12 ? "am" : "pm"
                if(t.hour==0) {
                    hour = 12  // am
                } else if(hour>12) {
                    hour = t.hour-12
                }
                return hour + ":" + leftZeroPadTo(t.minute, 2) + "." + leftZeroPadTo(t.second, 2) + ap
            break
        }
    }

    //% block="current date formatted $format"
    export function date(format: DateFormat): string {
        const cpuTime = timeInSeconds()
        const t = timeFor(cpuTime)
        // TODO
        return ""
    }

    //% block="date and time stamp"
    export function dateTime(): string {
        const cpuTime = timeInSeconds()
        const t = timeFor(cpuTime)
        return leftZeroPadTo(t.year, 4) + "-" + leftZeroPadTo(t.month, 2) + "-" + leftZeroPadTo(t.day, 2) + " " +
            leftZeroPadTo(t.hour, 2) + ":" + leftZeroPadTo(t.minute, 2) + "." + leftZeroPadTo(t.second, 2)
    }

    //% block="minute changed" advanced=true
    export function onMinuteChanged(handler: () => void) {

    }

    // //% block="second changed" advanced=true
    // export function onSecondChanged(handler: () => void) {

    // }
    //% block="hour changed" advanced=true
    export function onHourChanged(handler: () => void) {

    }
    //% block="day changed" advanced=true
    export function onDayChanged(handler: () => void) {

    }

    /**
     * 
def dayOfWeek(m, d, y):
    # f = k + [(13*m-1)/5] + D + [D/4] + [C/4] - 2*C.
    # Zeller's Rule from http://mathforum.org/dr.math/faq/faq.calendar.html
    D = y%100
    C = y//100
    # Use integer division
    return d + (13*m-1)//5 + D + D//4 + C//4 - 2*C


     */

}