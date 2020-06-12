# microbit-pxt-softclock


This set of blocks allows the micro:bit to track the time and date.  They can also be used for primitive 
[stopwatch](#stopwatch-behavior)-like capabilities.

It's importantant to be aware that:
- These blocks use a counter that is only accurate to about 250 parts per million, which is approximately 
22 seconds per day.  The accuracy may change based on the environment (heat/cold) and from micro:bit to micro:bit. If accuracy is important, 
you can use the stopwatch experiment described [below](#measuring-accuracy-and-calibrating) to estimate the accuracy of your micro:bit where you plan to use it. 
- The time needs to be set each time the micro:bit is re-programmed or restarts.  

## Setting the Time 

There are three common approaches to setting the time:

1. Synchronize at startup (easiest, but requires reprogramming)
2. Time advancing / rewinding 
3. Digits count up / count down 

Using a reasonable "startup value" as described in 
[Synchronize at startup](#synchronize-at-startup) will make the last two approaches easier.

### 1. Synchronize at startup

Synchronizing the time at startup is the easiest approach, but it requires re-programming the micro:bit everytime the time needs to be set (like whenever it is restarted).  The `startup` will include blocks to set the time, like:

```block
timeanddate.setDate(1, 20, 2020)
timeanddate.set24HourTime(13, 30, 0)
```
Setting the date can be left out if there's no need to keep track of the date, like if you want a 
wearable that won't display the date. 

Once you're ready to program the micro:bit, update the time/date being used so the time 
is approximately 1 minute in the future.  Program the micro:bit and then watch the real time 
carefully.  About 2 seconds before the programmed time press the reset button on the back of the 
micro:bit. (The micro:bit takes about 2 seconds to restart and will then "set" the time).

For the example blocks above the micro:bit would be reset at 13:29.58s on Jan. 20, 2020.  It would run the two blocks
that set the date and time at almost exactly the time they indicate. 

### 2. Time advancing / rewinding 

This is the approach used by mechanical clocks, where time is
 set by moving the hour hand forward (or, possibly, backwards). Moving the minutes forward may cause the hours
 to change. This is  a tedious way to set dates and should probably only be used for adjusting the time. 
  
For example, the time could be set by advancing or backing it up one minute at a time using the A and B buttons:

```block
input.onButtonPressed(Button.A, function () {
    timeanddate.advanceBy(1, timeanddate.TimeUnit.Minutes)
})

input.onButtonPressed(Button.B, function () {
    timeanddate.advanceBy(-1, timeanddate.TimeUnit.Minutes)
})
```

Here's an alternate approach that can be used to set the time at startup by advancing hours.  First hold "A" until 
the correct hour is shown.  Then hold "B" until the message says "min:". Then hold "A" until the correct minute is shown.  Finally hold "B" again.

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

### 3. Digits count up / count down 

This approach should be done on each digits of the time (minutes, hours, and if the date is important too, day, month, and year)

Here's an example that focuses on just the minutes:

```block
input.onButtonPressed(Button.B, function () {
    timeanddate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
        timeanddate.set24HourTime(hour, minute + -1, second)
    })
})

input.onButtonPressed(Button.A, function () {
    timeanddate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
        timeanddate.set24HourTime(hour, minute + 1, second)
    })
})
```

Since the time setting blocks use modular arithmetic, adding and subtracting to the prior value will 
"roll over" in the expected way (and will not impact the hours, like the adding approach would)

Note that this may not work correctly when the total time is before the year specified in ``setDate``.  
That is, if ``setDate`` specifies 2024, then negative values should not "roll back" before Jan 1, 2024. 

# Time and Date Blocks

## Time 

``[let txt = "text"]``

The ``[timeanddate.time]`` block provides the current time in the given format. 

If no time has been set, the time will be based on when the micro:bit started (was reset).  By default time 
starts at 00:00.00 on 0000-00-00.

## Date 

The ``[timeanddate.date]`` block provides the current date in the specified format. 

If no date is set, it will start at 0000-01-01 when the micro:bit starts. 


# Time stamps

Often a "time stamp" is needed to record events. The ``date and time stamp`` block should be used.  It provides the date and time in the format:
 YYYY-MM-DD HH:MM.SS.  This format is well suited to sorting and use in spreadsheets.  It also ensures that the date and time are retrieved at the same time 
 (accessing them separately may lead to a date after the time if the the time is checked at almost exactly the end of
 the day).

### ~hint

#### When to use Time Stamps
Use time stamps when logging events that happen over multiple days  (more than 24 hours).  
For example, an experiment recoding temperature every 10 minutes for a week should use time stamps.
### ~

### ~alert

# Avoid using separate time and date blocks if making a log of events

Retrieving the time and date separately can be problematic.  For example, if the date is accessed at 23:59.59 
and then time is then accessed, it may have changed to 00:00.00 the following day and the date won't be correct for the time.

Use the time stamp block or the "with" block to get numeric values for the date. 

### ~

## Accessing numeric values of time / date
 
Accessing the numeric values of time/date can be useful for things like alarm clocks.  The ``current time as numbers``
is used.  It access all parts of the day/time at once and provides variables containing them. 

```sig
timeanddate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
})
```
The weekday indicates the day of the week, where 0 is Monday, 1 is Tuesday, etc.

### Background

The ``current time as numbers`` block avoids errors that can occur if separate blocks had been used.  For example, if one block provided the current time of day
and another block provided the date, it would be possible to access the time at 23:59.59 on 2020-01-01 and then the date a fraction of time later, 
when it had changed to 2020-01-02.  The combined date and time would appear to be 23:59.59 on 2020-01-02 even though the 23:59.59 was actually on 2020-01-01.

# Measuring Accuracy and Calibrating

Accuracy can be measured by comparing your micro:bit in a stable environment to an actual, accurate stopwatch.  

Use the following program, which will start the time at 00:00.00 (just like a stop watch). 

```blocks
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
2. Prepare to start the stopwatch
3. Reset the micro:bit
4. As soon as you see the heart on the micro:bit start the stopwatch 

Generally you'd expect the micro:bit to be accurate to within about 1 second per hour or better.  This experiment
also depends on your reaction time, which is probably about 0-2 seconds.  Consequently you may need to let it run for severl hours
to estimate the actual accuracy. 

To estimate the accuracy:
1. Look at the stopwatch.  Pick a precise instant that you'll take the measurement and keep it in mind.  For example, if the 
stop watch reads 2:13.20 you may decide to make the measurement at 2:14.00. 
2. At that precise instant press the "A" button.  The micro:bit will scroll it's current record of the time.  Compare
it to the expected time.  For example, if the microbit indicated 0000-01-01 02:13.22 you'd estimate that the microbit 
is about 2 seconds ahead. Since it's been running for 134 minutes, you'd estimate that it's gaining 2/134 seconds/minute. Since there are 1440 minutes in a day, this works out to about 21.5 seconds per day.

Since there may be a ~1s error in your reaction time, it's probably best to try to measure the error over many hours or days. 

### ~tip

#### Improving Accuracy
If you measure the accuracy and it's consistent/predictable, you may be able to use the
 ``[timeanddate.advanceBy]`` and ``[timeanddate.onHourChanged]`` blocks to periodically adjust the accuracy.  
 
 Be careful setting time backward while using ``[timeanddate.onHourChanged]``! It's possible to get stuck in a "loop" 
 that continually resets the time. You may need to use a variable to identify which "hour" was the last one to be adjusted. 

### ~

# Setting Hour/Minute at Start

The following can be used to set the time at startup.  It will scroll the time continuously until you are done setting it.  
First set the hour.  Hold "A" to advance it or "B" to decrease it.  When the hour is correct, hole "A+B" until you get the message to set the minute.
Then repeat the process for the minute.  "A" advances and "B" decreases. When done hold "A+B" until the message stops scrolling.  

There's an extra block that displays the time after pressing "A" to check your work.


```blocks
input.onButtonPressed(Button.A, function () {
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
})
timeanddate.setTime(11, 30, 0, timeanddate.MornNight.AM)
basic.showString("Set Hour")
while (!(input.buttonIsPressed(Button.AB))) {
    timeanddate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
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
    timeanddate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
        if (input.buttonIsPressed(Button.A)) {
            timeanddate.set24HourTime(hour, minute + 1, 0)
        } else if (input.buttonIsPressed(Button.B)) {
            timeanddate.set24HourTime(hour, minute - 1, 0)
        }
    })
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
}
```

# Stopwatch behavior

By use of setting time to 0:0.0 this can be used as a simple stopwatch.  For example, for timing things that are less than 24 hours:

```blocks
input.onButtonPressed(Button.A, function () {
    timeanddate.set24HourTime(0, 0, 0)
})
input.onButtonPressed(Button.B, function () {
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
})
timeanddate.set24HourTime(0, 0, 0)
```

"A" starts counting and "B" shows the time elapsed since "A" was pressed (or the start)


# Challenges

1. Create a program that will allow the time to be set wen A+B are pressed.  After that, pressing "A" should advance the hour
and pressing "B" should advance the minute.  Pressing "A+B" again should change the mode back to just keeping time (not allow hour/minute
to be changed.)
2. Create an alarm clock!
3. Add a snooze feature to your alarm clock!
3. Create an adjustable alarm clork that allows the alarm time to be changed without reprogramming. 
3. Create a clock *without*  these blocks!  Hints: You'll need a few counter variables, a forever loop, and the ability to "wait".


# Binary clock 

```blocks
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
    timeanddate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
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

## Supported targets

* for PXT/microbit

## Misc Links & References

Algorithms used here and Unit tests for them: https://github.com/bsiever/software-based-RTC-algorithm
FontAwesome Icon: https://iconify.design/icon-sets/fa/ 
SparkFun's Guide: https://learn.sparkfun.com/tutorials/how-to-create-a-makecode-package-for-microbit/all

```package
timeanddate=github:bsiever/microbit-pxt-timeanddate
```
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
