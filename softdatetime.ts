
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

// Fontawesome Unicode maybe: "&#xf017;"   icon="\u23f0" 
//% color="#AA278D"  
namespace timeAndDate {


    //% block="set time from 24-hour time |  %hour | : %minute | . %second"
    //% hour.min=0 hour.max=23
    //% minute.min=0 minute.max=59
    //% second.min=0 second.max=59
    export function set24HourTime(hour: number, minute: number, second: number) {

    }
    //% block="set time to |  %hour | : %minute | . %second | %ampm"
    //% hour.min=0 hour.max=23
    //% minute.min=0 minute.max=59
    //% second.min=0 second.max=59
    //% inlineInputMode=inline
    export function setTime(hour: number, minute: number, second: number, ampm: MornNight) {

    }


    //% block="set date to | Day %day | / Month %month | / Year %year"
    //% day.min=0 day.max=31
    //% month.min=1 month.max=12
    //% year.min=2020 year.max=2050
    export function setDate(day: number, month: number, year: number) {

    }

    // //% block="time in %tformat format | and date in %dformat format"
    // export function timeAndDate(tformat: TimeFormat, dformat: DateFormat) : String {
    //    return ""
    // }

    // // Format:  "YYYY-MM-DD HH:MM" in 24-hour format
    // //% block="time stamp"
    // export function timestamp() : String {
    //    return ""
    // }


    // This can cause overflow or underflow (adding 1 minute could change the hour)
    // Add or subtract time with the given unit. 
    //% block="advance time/date by | %amount | %unit "
    export function advanceBy(amount: number, unit: TimeUnit) {

    }


    //% block="current time as numbers $hour:$minute.$second on $weekday, $day/$month/$year, $dayOfYear" advanced=true
    //% draggableParameters=variable
    //% handlerStatement=1
    export function numericTime(handler: (hour: number, minute: number, second: number, weekday: number, day: number, month: number, year: number, dayOfYear: number) => void) {

    }


    //% block="current time $format"
    export function time(format: TimeFormat): string {
        return ""
    }

    //% block="current date formatted $format"
    export function date(format: DateFormat): string {
        return ""
    }

    //% block="date and time"
    export function dateTime(): string {
        return ""
    }
    // //% block="current time formatted with $tformat | date formatted like $dformat"
    // //% draggableParameters=variable
    // //% handlerStatement=1
    // export function stringTime(tformat: TimeFormat, weekday: string, dformat: DateFormat, handler: (time: string, date: string, weekday: string) => void) {

    // }


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


    //  Advanced: 

    // Get time;  time->day/month/year/hours(24)/hours/amPM string / minutes/seconds/weekday/ daystring w/format  / year string w/format
}