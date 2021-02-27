# time-and-date


This extension allows the micro:bit to track the time and date.  It can also be used for primitive 
[stopwatch](#stopwatch-behavior)-like capabilities.

It's importantant to be aware that:
- This extension uses a counter that may only be accurate to about 10 parts per million, which is approximately 0.864 seconds per day.  The accuracy may change based on the environment (heat/cold) and from micro:bit to micro:bit. If accuracy is important, you can use the stopwatch experiment described [below](#measuring-accuracy-and-calibrating) to estimate the accuracy of your micro:bit where you plan to use it. 
- The time needs to be set each time the micro:bit is reprogrammed or restarts.  

## Setting the Time #setting-the-time

There are three common approaches to setting the time:

1. [Synchronize at startup](#1-synchronize-at-startup) (easiest, but requires updating the program)
2. [Time advancing / rewinding](#2-time-advancing-rewinding)
3. [Digits count up / count down](#3-digits-count-up-count-down)

Using a reasonable "startup value", as described in [Synchronize at startup](#1-synchronize-at-startup), will make the last two approaches easier.

### 1. Synchronize at startup #1-synchronize-at-startup

Synchronizing the time at startup is the easiest approach, but it requires re-programming the micro:bit everytime the time needs to be set (like whenever it is restarted).  The start up process just needs to include setting the time, like:

```block
timeanddate.setDate(1, 20, 2020)
timeanddate.set24HourTime(13, 30, 0)
```

### ~hint

#### Date is Optional!

If you just care about time and not the date, you don't have to set the date.

### ~

Once you're ready to program the micro:bit:
1. Update the time/date being used so the time is approximately 1 minute in the future.  
2. Program the micro:bit 
3. Watch the real time carefully. 
4. About 1-2 seconds before the programmed time press the reset button on the back of the micro:bit. 
   * The micro:bit takes about 1-2 seconds to restart. This causes the "set" to run at the correct time.
   
For the example above, the micro:bit would be reset at 13:29.58s on Jan. 20, 2020.  It would set the date and time at almost exactly the time indicated in the set block. 

### 2. Time advancing / rewinding #2-time-advancing-rewinding

This is the approach used by mechanical clocks, where time is set by moving the minute hand forward (or, possibly, backwards). Moving the minutes forward may cause the hours to change too. And as hours change the date could change, etc.
 
This is  a tedious way to set dates and should probably only be used when the date will never be needed and just the time needs to be set. 

#### 2.1 Simplest Approach

Here's the simplest approach, where the buttons are dedicated to setting the time :

```block
input.onButtonPressed(Button.A, function () {
    timeanddate.advanceBy(1, timeanddate.TimeUnit.Minutes)
})

input.onButtonPressed(Button.B, function () {
    timeanddate.advanceBy(-1, timeanddate.TimeUnit.Minutes)
})
```

The buttons change the time one minute at a time (forward or backward).  Advancing the minutes beyond 59 or before 0 will cause the hour to change.

#### 2.2 Alternate Approach: Setting at startup 

Here's an alternate approach that can be used to set the time at startup by advancing hours and minutes.  
1. Hold "A" until the correct hour is shown.  
2. Hold "B" until the message says "min:". 
3. Hold "A" until the correct minute is shown.  
4. Hold "B" again.

```blocks
input.onButtonPressed(Button.A, function () {
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
})
basic.showString("hr:")
while (!(input.buttonIsPressed(Button.B))) {
    if (input.buttonIsPressed(Button.A)) {
        timeanddate.advanceBy(1, timeanddate.TimeUnit.Hours)
    }
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
}
basic.showString("min:")
while (!(input.buttonIsPressed(Button.B))) {
    if (input.buttonIsPressed(Button.A)) {
        timeanddate.advanceBy(1, timeanddate.TimeUnit.Minutes)
    }
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
}
```

If setting the date this way it's best to use the ``[timeanddate.setDate()]`` to select a year near the current year.

**This may not work correctly when the total time is before the year specified in ``[timeanddate.setDate()]``.   That is, if ``[timeanddate.setDate(1, 20, 2024)]`` specifies 2024, then negative values should not "rollback" before Jan 1, 2024.**

### 3. Digits count up / count down #3-digits-count-up-count-down

This approach should be done on each digits of the time (minutes, hours, and if the date is important too, day, month, and year).  

#### 3.1 Simplest Approach Example

Here's an example that focuses on just the minutes (additional code is needed for hours, etc.):

```block
input.onButtonPressed(Button.B, function () {
    timeanddate.numericTime(function (hour, minute, second,  month, day, year) {
        timeanddate.set24HourTime(hour, minute + -1, second)
    })
})

input.onButtonPressed(Button.A, function () {
    timeanddate.numericTime(function (hour, minute, second,  month, day, year) {
        timeanddate.set24HourTime(hour, minute + 1, second)
    })
})
```

Since the time setting commands use modular arithmetic, adding and subtracting to the prior value will "rollover" in the expected way and will not impact the hours, like the advancing approach would. 

#### 3.2 Alternate Approach: Setting Hour/Minute at Start

The following can be used to set the time at startup.  It will scroll the time continuously until you are done setting it.  

1. Set the Hour by holding "A" to advance it or "B" to decrease it. 
2. Hold "A+B" until it says "Set Min".
3. Then repeat the process for the minute.  
4. When done hold "A+B" until the message stops scrolling.  

Once the time has been set the additional code that displays the time when "A" is pressed.

```block
input.onButtonPressed(Button.A, function () {
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
})
timeanddate.setTime(11, 30, 0, timeanddate.MornNight.AM)
basic.showString("Set Hour")
while (!(input.buttonIsPressed(Button.AB))) {
    timeanddate.numericTime(function (hour, minute, second, month, day, year) {
        if (input.buttonIsPressed(Button.A)) {
            timeanddate.set24HourTime(hour + 1, minute, 0)
        } else if (input.buttonIsPressed(Button.B)) {
            timeanddate.set24HourTime(hour - 1, minute, 0)
        }
    })
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
}
basic.showString("Set Min")
while (!(input.buttonIsPressed(Button.AB))) {
    timeanddate.numericTime(function (hour, minute, second, month, day,  year) {
        if (input.buttonIsPressed(Button.A)) {
            timeanddate.set24HourTime(hour, minute + 1, 0)
        } else if (input.buttonIsPressed(Button.B)) {
            timeanddate.set24HourTime(hour, minute - 1, 0)
        }
    })
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
}
```

# Full API 

## Setting Time Using 24-hour Format #timeanddate-set24hourtime

Use `[timeanddate.set24HourTime()]` to set the time using 24-hour format (hours from 0-23, minutes from 0-59, seconds from 0-59). See [Setting the Time](#setting-the-time).

## Setting Time Using AM/PM Format #timeanddate-settime

Use `[timeanddate.setTime()]` to set the time using am/pm format (hours from 1-12, minutes from 0-59, seconds from 0-59).  See [Setting the Time](#setting-the-time).

## Setting the Date #timeanddate-setdate

Use `[timeanddate.setDate()]` to set the date (month from 1-12, day from 1-31, year from 0000-9999). See [Setting the Time](#setting-the-time).

## Getting the Time (string) #timeanddate-time

```sig
timeanddate.time(timeanddate.TimeFormat.HMM)
```

Provides the current time in the selected format. 

If no time has been set, the time will be based on when the micro:bit started (was reset).  By default time starts at 00:00.00 on 0000-01-01.


## Getting the Date (string) #timeanddate-date

```sig
timeanddate.date(timeanddate.DateFormat.MD)
``` 

Provides the current date in the specified format. 

If no date is set, it will start at 0000-01-01 when the micro:bit starts. 

### ~alert

# Avoid using separate time and date if making a log of events

Retrieving the time and date separately can cause problems.  For example, if the date is accessed at 23:59.59 and then time is then accessed, the time may have changed to 00:00.00 (the following day) and the date won't be correct for the time.

Use the timestamp  or the ``[timeanddate.numericTime()]`` block to get numeric values for the date. 

### ~

## Timestamps (string) #timeanddate-datetime

Often a "timestamp" is needed to record events, like when measurements are taken for a science experiment.  Use:

```sig 
timeanddate.dateTime()
``` 

It provides the date and time in the format: YYYY-MM-DD HH:MM.SS.  This format can easily be "sorted" in spreadsheets.  This ensures that the date and time are retrieved at the same time (accessing them separately may lead to a date after the time if the the time is checked at almost exactly the end of
 the day).  See [Setting the Time](#setting-the-time).

### ~hint

#### When to use Timestamps
Use timestamps when logging events that happen over multiple days  (more than 24 hours).   For example, an experiment recoding temperature every 10 minutes for a week should use timestamps.

### ~

## Accessing numeric values of time / date #timeanddate-numerictime
 
Numeric values of time/date can be useful for things like alarm clocks.  Use:

```sig
timeanddate.numericTime(function (hour, minute, second, month, day, year) {
})
```

- Hour will be 0-23 (in 24-hour format)
- Minute will be 0-59
- Second will be 0-59.
- Day will be 1-31
- Month will be 1-12
- Year is the year 0-65535

### ~tip

#### Numeric Time vs. separate hour, minute, second

The ``[timeanddate.numericTime()]``  avoids errors that can occur if separate things had been used to get each part of the time.  For example, if one block provided the current time of day
and another block provided the date, it would be possible to access the time at 23:59.59 on 2020-01-01 and then the date a fraction of time later, 
when it had changed to 2020-01-02.  The combined date and time would appear to be 23:59.59 on 2020-01-02 even though the 23:59.59 was actually on 2020-01-01.

### ~

## Advancing and Adjusting Time #timeanddate-advanceby 

```sig
timeanddate.advanceBy(amount: number, unit: TimeUnit)
``` 

Can be used to advance or set back the current time. It works by adding time to the current time in the given units, *with carries*.  Adding 
to minutes may cause an overflow and change the hours.  Negative amounts can be used to set the clock backwards, however the clock 
can not be set back before the beginning of the year originally used to set the date (or year 0 if the date wasn't set).

It behaves like a mechanical clock: Advancing the minutes causes the hour to advance as well.  It may be useful 
for adjusting the clocks accuracy (adding seconds occasionally if it's slow) or adjusting 
for changes in timezone or daylight savings time.

## Seconds the Micro:bit has been running #timeanddate-secondssincereset

```sig
timeanddate.secondsSinceReset()
```

Reports the time (in seconds) since the micro:bit started.

## Minute Changing #timeanddate-onminutechanged

```sig 
timeanddate.onMinuteChanged(handler: () => void)
```
The provided code will run when the minute changes. 


## Hour Changing #timeanddate-onhourchanged

```sig
timeanddate.onHourChanged(handler: () => void)
```

The provided code will run when the hour changes. 


## Day Changing #timeanddate-ondaychanged

```sig
timeanddate.onDayChanged(handler: () => void)
```

The provided code will run when the day changes. 


## Weekdays #timeanddate-datetodayofweek

Once you have the day, month, and year, you can use them on the:
```sig
timeanddate.dateToDayOfWeek()
```

to determine the day of the week.  It returns a numeric code, where 0 is Monday, 1 is Tuesday, etc.

## Day of the Year #timeanddate-datetodayofyear

Once you have the day, month, and year, you can use them on the:
```sig
timeanddate.dateToDayOfYear()
```
to determine the ordinal day of the year.  1 is Jan. 1, 2, is Jan 2, etc.  Dec. 31 is either 365 or 366 (in a leap year).


# Measuring Accuracy and Calibrating #measuring-accuracy-and-calibrating

Accuracy can be estimated by comparing your micro:bit to an actual, accurate stopwatch.  

Use the following program, which will start the time at 00:00.00 (just like a stop watch). 

```block
input.onButtonPressed(Button.A, function () {
    basic.showString(timeanddate.dateTime())
})
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
})
basic.showIcon(IconNames.Heart)
timeanddate.set24HourTime(0, 0, 0)
```
Use a stopwatch or stopwatch app on a computer/phone. To start measurement:
1. To estimate the accuracy of the micro:bit you'll need to compare it's estimate of time to the stopwatch for a few hours (or even days). Be sure that it's set up someplace where it will have power continuously, either via battery or a USB cable,  for a long time (hours or days). Some computers will suspend power to USB devices if the computer isn't in use for a while, so you may want to use a USB  charger.
   * The micro:bit's accuracy can be impacted by large changes in temperature.  It's best to test it in an environment that you'll be using it in.  That is, if it'll be left outside in cold weather, test the accuracy in similar conditions. 
2. Prepare to start the stopwatch
3. Reset the micro:bit
4. As soon as you see the heart on the micro:bit start the stopwatch 

The micro:bit should be accurate to within about 1 second per day or better.  This experiment depends on your reaction time, which is probably about 0-2 seconds.  Consequently you may need to let it run for several days to estimate the accuracy. 

To estimate the accuracy:
1. Look at the stopwatch.  Pick a precise instant that you'll take the measurement and keep it in mind.  For example, if the  stop watch reads 2:13.20 you may decide to make the measurement at 2:14.00. 
2. At that precise instant press the "A" button.  The micro:bit will scroll it's current record of the time.  Compare it to the expected time.  For example, if the microbit indicated 0000-01-01 02:13.22 you'd estimate that the microbit  is about 2 seconds ahead. Since it's been running for 134 minutes, you'd estimate that it's gaining 2/134 seconds/minute. Since there are 1440 minutes in a day, this works out to about 21.5 seconds per day.

### ~tip

#### Improving Accuracy
If you measure the accuracy and it's consistent/predictable, you may be able to use the ``[timeanddate.advanceBy()]`` and ``[timeanddate.onHourChanged()]`` blocks to periodically adjust the accuracy.  
 
**Be careful setting time backward while using ``[timeanddate.onHourChanged()]``!** It's possible to get stuck in a "loop" that continually resets the time. You may need to use a variable to identify which "hour" was the last one to be adjusted. 

### ~


# Stopwatch behavior #stopwatch-behavior

By use of setting time to 0:0.0 this can be used as a simple stopwatch.  For example, for timing things that are less than 24 hours:

```block
input.onButtonPressed(Button.A, function () {
    timeanddate.set24HourTime(0, 0, 0)
})
input.onButtonPressed(Button.B, function () {
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
})
timeanddate.set24HourTime(0, 0, 0)
```

"A" starts counting and "B" shows the time elapsed since "A" was pressed (or the start)


# Challenges!!!

1. Find new ways to set the time or date.  
2. Create an alarm clock! (Hint: Use ``[timeanddate.numericTime()]``)
   * Start with a simple alarm that is pre-programmed. For example, the alarm will go off at 3pm each day.  The ``[timeanddate.numericTime()]`` uses 24-hour format time, so 3pm is 15:00. 
3. Add a snooze feature to your alarm clock!
4. Create an adjustable alarm clork that allows the alarm time to be changed by using buttons or actions (rather than reprogramming) 
3. Create a clock *without*  these blocks!  Hints: You'll need a few counter variables, a forever loop, and the ability to ``[basic.pause()]``.


# Bonus: A Binary Clock 

Here's a simple clock that will show time in binary code.  Each column represents a digit of the current 12-hour time. 
The bottom most LED in each column is the 1's digit, the second from the bottom is the 2's, etc.  The middle column of the display will blink a pattern off and on to indicate each second.

[Click here to open the shared project](https://makecode.microbit.org/_MJqeqei2aFjJ)

```block
function binaryDisplayOf (num: number, col: number) {
    for (let index = 0; index <= 4; index++) {
        if (Math.idiv(num, 2 ** index) % 2 == 1) {
            led.plot(col, 4 - index)
        } else {
            led.unplot(col, 4 - index)
        }
    }
}
input.onButtonPressed(Button.B, function () {
    timeanddate.advanceBy(1, timeanddate.TimeUnit.Minutes)
})
input.onButtonPressed(Button.A, function () {
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
})
input.onButtonPressed(Button.AB, function () {
    timeanddate.advanceBy(15, timeanddate.TimeUnit.Minutes)
})
basic.showString("hr:")
while (!(input.buttonIsPressed(Button.B))) {
    if (input.buttonIsPressed(Button.A)) {
        timeanddate.advanceBy(1, timeanddate.TimeUnit.Hours)
    }
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
}
basic.showString("min:")
while (!(input.buttonIsPressed(Button.B))) {
    if (input.buttonIsPressed(Button.A)) {
        timeanddate.advanceBy(1, timeanddate.TimeUnit.Minutes)
    }
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
}
let blink = false
basic.forever(function () {
    timeanddate.numericTime(function (hour, minute, second, month, day, year) {
        hour = 0 % 12
        if (hour == 0) {
            hour = 12
        }
        binaryDisplayOf(Math.idiv(hour, 10), 0)
        binaryDisplayOf(hour % 10, 1)
        binaryDisplayOf(Math.idiv(minute, 10), 3)
        binaryDisplayOf(minute % 10, 4)
    })
    basic.pause(1000)
    blink = !(blink)
    if (blink) {
        binaryDisplayOf(10, 2)
    } else {
        binaryDisplayOf(0, 2)
    }
})
```

# Bonus: A Stopwatch

Here's a simple stopwatch.  "A" starts and stops the count. The count will be automatically displayed
when it's stopped, but pressing "B" will re-display it.

[Click here to open the shared project](https://makecode.microbit.org/_2MK536dctd0m)


```block
input.onButtonPressed(Button.A, function () {
    running = !(running)
    if (running) {
        timeanddate.set24HourTime(0, 0, 0)
    } else {
        captured = timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr)
        basic.showString(captured)
    }
})
input.onButtonPressed(Button.B, function () {
    if (!(running)) {
        basic.showString(captured)
    }
})
let dotLocation = 0
let xy = 0
let captured = ""
let running = false
running = false
let coords = [11, 21, 31, 32, 33, 23, 13, 12]
basic.forever(function () {
    if (running) {
        basic.clearScreen()
        xy = coords[dotLocation]
        led.toggle(Math.idiv(xy, 10), xy % 10)
        basic.pause(1000/8)
        dotLocation = (dotLocation + 1) % 8
    } else {
        basic.showIcon(IconNames.No)
    }
})
```

## Supported targets

* for PXT/microbit

## Misc Links & References

- Algorithms used here and Unit tests for them are available on GitHub: https://github.com/bsiever/software-based-RTC-algorithm
- SparkFun's Guide was used to help develop this package: https://learn.sparkfun.com/tutorials/how-to-create-a-makecode-package-for-microbit/all

```package
timeanddate=github:bsiever/microbit-pxt-timeanddate
```
<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
