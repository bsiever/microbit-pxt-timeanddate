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

let errors = 0
let testsRun = 0
function assert(where: string, expected: any, actual: any) {
    if(expected==actual) {
      serial.writeLine(where + " : Passed")
      testsRun += 1
    } else {
      errors += 1
      serial.writeLine(where + " : FAILED\t Expected: " + expected + ' got: ' + actual)
    }
}

function testingDone() {
    if(errors==0) {
        serial.writeLine("All " + testsRun + " tests passed")
        basic.showIcon(IconNames.Happy)
    } else {
        serial.writeLine("Failed " + errors + " of " + testsRun)
        while (true) {
            basic.showIcon(IconNames.Sad)
            basic.showNumber(errors)
        }
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

// Setting time with AM/PM converts to 24HourTime, so it has been tested
// timeanddate.set24HourTime(13, 30, 0)


// Test Day Of Week
assert("dow1", 0, timeanddate.dayOfWeek(1, 20, 2020))
assert("dow2", 1, timeanddate.dayOfWeek(1, 21, 2020))
assert("dow3", 5, timeanddate.dayOfWeek(2, 29, 2020))
assert("dow4", 6, timeanddate.dayOfWeek(3, 1, 2020))
assert("dow5", 0, timeanddate.dayOfWeek(3, 1, 2021))
assert("dow6", 1, timeanddate.dayOfWeek(3, 1, 2022))
assert("dow7", 4, timeanddate.dayOfWeek(3, 1, 2024))

// Test Day Of Year
assert("doy1", 1, timeanddate.dateToDayOfYear(1, 1, 2020))
assert("doy2", 61, timeanddate.dateToDayOfYear(3, 1, 2020))
assert("doy3", 366, timeanddate.dateToDayOfYear(12, 31, 2020))
assert("doy4", 60, timeanddate.dateToDayOfYear(3, 1, 2021))
assert("doy5", 365, timeanddate.dateToDayOfYear(12, 31, 2021))


// Test callbacks & numeric values 

// Set date and let a minute pass to "set" old values
timeanddate.setDate(1, 1, 21)
timeanddate.set24HourTime(23, 59, 59)
basic.pause(2500)   // Rolls over to 0:00.00 on 1/2/21
timeanddate.set24HourTime(2, 22, 59)
basic.pause(2500)   // Rolls over to 2:23:02 on 1/2/21
// Day is 1, Hour is 2, minute is 22

clearCounters()  // Clear hours, minutes, days
timeanddate.setDate(4, 15, 21)
timeanddate.set24HourTime(23, 59, 59)
basic.pause(2500)   // + 1 to hours, minutes, days 0:00.02 on 4/16/20
assert("cb1", 1, hours)
assert("cb2", 1, minutes)
assert("cb3", 1, days)


timeanddate.set24HourTime(0, 26, 59)
basic.pause(2500)  // One more to minutes
assert("cb4", 1, hours)
assert("cb5", 2, minutes)
assert("cb6", 1, days)
timeanddate.set24HourTime(0, 59, 59)
basic.pause(2500)
assert("cb7", 2, hours)
assert("cb8", 3, minutes)
assert("cb9", 1, days)

// Test time advancing and numericTime 
timeanddate.setDate(4, 15, 21)
timeanddate.setTime(2, 5, 10, timeanddate.MornNight.AM)
timeanddate.advanceBy(10, timeanddate.TimeUnit.Seconds)  // a few seconds
timeanddate.numericTime(function (hour, minute, second, month, day, year) {
    assert("adv+nt1a", 20, second)
    assert("adv+nt1b", 2, hour)
    assert("adv+nt1c", 5, minute)
    assert("adv+nt1d", 4, month)
    assert("adv+nt1e", 15, day)
    assert("adv+nt1f", 21, year)
})

timeanddate.setDate(4, 15, 21)
timeanddate.setTime(2, 5, 10, timeanddate.MornNight.AM)
timeanddate.advanceBy(86405, timeanddate.TimeUnit.Seconds) // 1 day and 5 seconds
timeanddate.numericTime(function (hour, minute, second, month, day, year) {
    assert("adv+nt2a", 15, second)
    assert("adv+nt2b", 2, hour)
    assert("adv+nt2c", 5, minute)
    assert("adv+nt2d", 4, month)
    assert("adv+nt2e", 16, day)
    assert("adv+nt2f", 21, year)
})

timeanddate.setDate(4, 15, 21)
timeanddate.setTime(2, 5, 10, timeanddate.MornNight.AM)
timeanddate.advanceBy(45, timeanddate.TimeUnit.Days) // 45 days
timeanddate.numericTime(function (hour, minute, second, month, day, year) {
    assert("adv+nt3a", 5, month)
    assert("adv+nt3b", 30, day)
    assert("adv+nt3c", 21, year)
})

timeanddate.setDate(4, 15, 21)
timeanddate.setTime(2, 5, 10, timeanddate.MornNight.AM)
timeanddate.advanceBy(380, timeanddate.TimeUnit.Days) // 380 days
timeanddate.numericTime(function (hour, minute, second, month, day, year) {
    assert("adv+nt4a", 4, month)
    assert("adv+nt4b", 30, day)
    assert("adv+nt4c", 22, year)
})

testingDone()

}