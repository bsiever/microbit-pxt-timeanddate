{
//  State variables and utility functions
let days = 0
let hours = 0
let minutes = 0

function clearCounters() {
    days = 0
    hours = 0
    minutes = 0
}

function assert(where: string, expected: any, actual: any) {
    if(expected==actual) {
      serial.writeLine(where + " : Passed")
    } else {
      serial.writeLine(where + " : FAILED\t Expected: " + expected + ' got: ' + actual)
    }
}


// Setup tests for callbacks (to modify state variables)
timeanddate.onMinuteChanged(function () {
    minutes += 1
})
timeanddate.onDayChanged(function () {
    days += 1
})
timeanddate.onHourChanged(function () {
    hours += 1
})


// **************** Begin testing ************//
basic.pause(1100)
// Time should now be at 1s
assert("TSR", 1, timeanddate.secondsSinceReset())


// ************* Testing Timestamp, time, and date formats


// Test 1:  Set time to 11:30am on Jan 20, 2020
// Also tests set AM to an AM time
timeanddate.setTime(11, 30, 0, timeanddate.MornNight.AM)
timeanddate.setDate(1, 20, 2020)

assert("dT1", "2020-01-20 11:30.00", timeanddate.dateTime())
assert("date1a", "1/20", timeanddate.date(timeanddate.DateFormat.MD))
assert("date1b", "1/20/2020", timeanddate.date(timeanddate.DateFormat.MDY))
assert("date1c", "2020-01-20", timeanddate.date(timeanddate.DateFormat.YYYY_MM_DD))
assert("time1a", "11:30", timeanddate.time(timeanddate.TimeFormat.HHMM24hr))
assert("time1b", "11:30.00", timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
assert("time1c", "11:30", timeanddate.time(timeanddate.TimeFormat.HMM))
assert("time1d", "11:30am", timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
assert("time1e", "11:30.00am", timeanddate.time(timeanddate.TimeFormat.HMMSSAMPM))

// Test 2:  Set time to 12:00pm on Dec 20, 2020
// Also tests set AM to 12pm / 1200 hrs and minutes that are <10
timeanddate.setTime(12, 0, 0, timeanddate.MornNight.PM)
timeanddate.setDate(12, 20, 2020)

assert("dT2", "2020-12-20 12:00.00", timeanddate.dateTime())
assert("date2a", "12/20", timeanddate.date(timeanddate.DateFormat.MD))
assert("date2b", "12/20/2020", timeanddate.date(timeanddate.DateFormat.MDY))
assert("date2c", "2020-12-20", timeanddate.date(timeanddate.DateFormat.YYYY_MM_DD))
assert("time2a", "12:00", timeanddate.time(timeanddate.TimeFormat.HHMM24hr))
assert("time2b", "12:00.00", timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
assert("time2c", "12:00", timeanddate.time(timeanddate.TimeFormat.HMM))
assert("time2d", "12:00pm", timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
assert("time2e", "12:00.00pm", timeanddate.time(timeanddate.TimeFormat.HMMSSAMPM))

// Test 3:  Set time to 12:01.02am on June 5, 2020
// Also tests set AM to 12am / 00:00 hrs and minutes that are <10
//  and seconds that are >0 <10;  Day less than 10
timeanddate.setTime(12, 1, 2, timeanddate.MornNight.AM)
timeanddate.setDate(6, 5, 2020)

assert("dT3", "2020-06-05 00:01.02", timeanddate.dateTime())
assert("date3a", "6/5", timeanddate.date(timeanddate.DateFormat.MD))
assert("date3b", "6/5/2020", timeanddate.date(timeanddate.DateFormat.MDY))
assert("date3c", "2020-06-05", timeanddate.date(timeanddate.DateFormat.YYYY_MM_DD))
assert("time3a", "00:01", timeanddate.time(timeanddate.TimeFormat.HHMM24hr))
assert("time3b", "00:01.02", timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
assert("time3c", "12:01", timeanddate.time(timeanddate.TimeFormat.HMM))
assert("time3d", "12:01am", timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
assert("time3e", "12:01.02am", timeanddate.time(timeanddate.TimeFormat.HMMSSAMPM))



// Test 1:  Set time to 11:30am on Jan 20, 2020
// Also tests set AM to an AM time
timeanddate.setTime(11, 30, 0, timeanddate.MornNight.AM)
timeanddate.setDate(1, 20, 2020)

assert("dT1", "2020-01-20 11:30.00", timeanddate.dateTime())
assert("date1a", "1/20", timeanddate.date(timeanddate.DateFormat.MD))
assert("date1b", "1/20/2020", timeanddate.date(timeanddate.DateFormat.MDY))
assert("date1c", "2020-01-20", timeanddate.date(timeanddate.DateFormat.YYYY_MM_DD))
assert("time1a", "11:30", timeanddate.time(timeanddate.TimeFormat.HHMM24hr))
assert("time1b", "11:30.00", timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
assert("time1c", "11:30", timeanddate.time(timeanddate.TimeFormat.HMM))
assert("time1d", "11:30am", timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
assert("time1e", "11:30.00am", timeanddate.time(timeanddate.TimeFormat.HMMSSAMPM))

// Test 2:  Set time to 12:00pm on Dec 20, 2020
// Also tests set AM to 12pm / 1200 hrs and minutes that are <10
timeanddate.setTime(12, 0, 0, timeanddate.MornNight.PM)
timeanddate.setDate(12, 20, 2020)

assert("dT2", "2020-12-20 12:00.00", timeanddate.dateTime())
assert("date2a", "12/20", timeanddate.date(timeanddate.DateFormat.MD))
assert("date2b", "12/20/2020", timeanddate.date(timeanddate.DateFormat.MDY))
assert("date2c", "2020-12-20", timeanddate.date(timeanddate.DateFormat.YYYY_MM_DD))
assert("time2a", "12:00", timeanddate.time(timeanddate.TimeFormat.HHMM24hr))
assert("time2b", "12:00.00", timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
assert("time2c", "12:00", timeanddate.time(timeanddate.TimeFormat.HMM))
assert("time2d", "12:00pm", timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
assert("time2e", "12:00.00pm", timeanddate.time(timeanddate.TimeFormat.HMMSSAMPM))

// Test 4:  Set time to 1:59.59am on April 15, 21
timeanddate.setTime(1, 59, 59, timeanddate.MornNight.AM)
timeanddate.setDate(4, 15, 21)

assert("dT4", "0021-04-15 01:59.59", timeanddate.dateTime())
assert("date4a", "4/15", timeanddate.date(timeanddate.DateFormat.MD))
assert("date4b", "4/15/21", timeanddate.date(timeanddate.DateFormat.MDY))
assert("date4c", "0021-04-15", timeanddate.date(timeanddate.DateFormat.YYYY_MM_DD))
assert("time4a", "01:59", timeanddate.time(timeanddate.TimeFormat.HHMM24hr))
assert("time4b", "01:59.59", timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
assert("time4c", "1:59", timeanddate.time(timeanddate.TimeFormat.HMM))
assert("time4d", "1:59am", timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
assert("time4e", "1:59.59am", timeanddate.time(timeanddate.TimeFormat.HMMSSAMPM))



// Test Date Formats




/*
TODO:  Functions to test
Callbacks, and :
timeanddate.advanceBy(0, timeanddate.TimeUnit.Milliseconds)
timeanddate.set24HourTime(13, 30, 0)
timeanddate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
	
})
    

*/
}