# microbit-pxt-softclock

## Setting the Time 

There are three approaches to setting the time:

1. Synchronize at startup 
2. Time advancing / rewinding 
3. Digits count up / count down 

Using a reasonable "startup value" as described in [Synchronize at startup](#synchronize-at-startup) will make the last two approaches easier.

### Synchronize at startup

Synchronizing the time at startup is the easiest approach, but it requires re-programming the micro:bit everytime the time needs to be set (like whenever it is restarted).  The `startup` will include blocks to set the time, like:

```block
timeAndDate.setDate(1, 20, 2020)
timeAndDate.set24HourTime(13, 30, 0)
```
Setting the date can be left out if there's no need to keep track of the date. 

Once you're ready to program the micro:bit select a time that is approximately 1 minute in  the future.  Program the micro:bit and then watch the time carefully until about 2 seconds before the time that was programmed.  Push the reset button on the back of the micro:bit, which will cause it to restart.  The micro:bit takes about 2 seconds to start, which will set the clock to the desired time at almost exactly that time.

### Time advancing / rewinding 

This is the approach used by mechanical clocks, where time is
 set by moving the hour hand forward (or, possibly, backwards). 
  This is  a tedious way to set dates and should probably only be used for adjusting the time. 
  
For example, the time could be set by advancing or backing it up one minute at a time using the A and B buttons:

```block
input.onButtonPressed(Button.A, function () {
    timeAndDate.advanceBy(1, timeAndDate.TimeUnit.Minutes)
})

input.onButtonPressed(Button.B, function () {
    timeAndDate.advanceBy(-1, timeAndDate.TimeUnit.Minutes)
})
```

### Digits count up / count down 

This approach should be done on each digits of the time (minutes, hours, and if the date is important too, day, month, and year)

Here's an example that focuses on just the minutes:

```block
input.onButtonPressed(Button.B, function () {
    timeAndDate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
        timeAndDate.set24HourTime(hour, minute + -1, second)
    })
})

input.onButtonPressed(Button.A, function () {
    timeAndDate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
        timeAndDate.set24HourTime(hour, minute + 1, second)
    })
})
```

Since the time setting blocks use modular arithmetic, adding and subtracting to the prior value will 
"roll over" in the expected way (and will not impact the hours, like the adding approach would)

Note that this may not work correctly when the total time is before the year specified in ``setDate``.  
That is, if ``setDate`` specifies 2024, then negative values should not "roll back" before Jan 1, 2024. 

# Time and Date Blocks

## Time 

The ``[timeAndDate.date]`` block provides the current time in the specified format. 

If no time is set it will start at 00:00.00 when the micro:bit starts. 

## Date 

The ``[timeAndDate.date]`` block provides the current date in the specified format. 

If no date is set, it will start at 0000-01-01 when the micro:bit starts. 

### ~alert

#### Avoid using both in critical applications

Retrieving the time and date separately can be problematic.  For example, if the date is accessed at 23:59.59 
and then time is then accessed, it may have changed to 00:00.00 the following day and the date won't be correct for the time.

### ~

# Time stamps

Often a "time stamp" is needed to record events. The ``date and time stamp`` block should be used.  It provides the date and time in the format:
 YYYY-MM-DD HH:MM.SS.  This format is well suited to sorting and use in spreadsheets.  It also ensures that the date and time are retrieved at the same time 
 (accessing them separately may lead to a date after the time if the the time is checked at almost exactly the end of
 the day).

### ~hint

#### When to use Time Stamps
Use time stamps when looging events that happen over multiple days  (more than 24 hours).  
For example, an experiment recoding temperature every 10 minutes for a week should use time stamps.
### ~

## Accessing numeric values of time / date
 
Accessing the numeric values of time/date can be useful for things like alarm clocks.  The ``current time as numbers``
is used.  It access all parts of the day/time at once and provides variables containing them. 

```sig
timeAndDate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
})
```

### Background

The ``current time as numbers`` block avoids errors that can occur if separate blocks had been used.  For example, if one block provided the current time of day
and another block provided the date, it would be possible to access the time at 23:59.59 on 2020-01-01 and then the date a fraction of time later, 
when it had changed to 2020-01-02.  The combined date and time would appear to be 23:59.59 on 2020-01-02 even though the 23:59.59 was actually on 2020-01-01.


# Calibrating and Measuring Drift

The clock isn't accurate... Drift can be measured with a simple stop watch and the following program:

```blocks
input.onButtonPressed(Button.A, function () {
    basic.showString(timeAndDate.time(timeAndDate.TimeFormat.HHMMSS24hr))
})
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
})
basic.showIcon(IconNames.Heart)
timeAndDate.set24HourTime(0, 0, 0)
```

The goal is to compare the time kept by the micro:bit with an accurate stopwatch (most cell phones include a stopwatch as part of the 
clock or as a stand alone app)

After programming the micro:bit, press the "reset" button on its back.  As soon as you see the Heart Icon, start the stop watch.  They 
should now be in sync.  After a few seconds look at the stop watch time and press the "A" button at a precise time, such as at 1 minute.  

Note the time that scrolls across the micro:bit screen.  It should match the time on the stop watch the instant you pushed the "A" button. 

Leave the micro:bit running for several hours or days (perhaps with batter or via a USB cable to a power source).  Periodically note the time and try to estimate 
how much "Drift" occurs.  Is the micro:bit ahead or behind the stopwatch after a day?  How far is it off? 

# Challenges


Create a program that will allow the time to be set wen A+B are pressed.  After that, pressing "A" should advance the hour
and pressing "B" should advance the minute.  Pressing "A+B" again should change the mode back to just keeping time (not allow hour/minute
to be changed.)

# Setting Hour/Minute at Start


The following can be used to set the time at startup.  It will scroll the time continuously until you are done setting it.  
First set the hour.  Hold "A" to advance it or "B" to decrease it.  When the hour is correct, hole "A+B" until you get the message to set the minute.
Then repeat the process for the minute.  "A" advances and "B" decreases. When done hold "A+B" until the message stops scrolling.  

There's an extra block that displays the time after pressing "A" to check your work.


```blocks
input.onButtonPressed(Button.A, function () {
    basic.showString(timeAndDate.time(timeAndDate.TimeFormat.HMMAMPM))
})
timeAndDate.setTime(11, 30, 0, timeAndDate.MornNight.AM)
basic.showString("Set Hour")
while (!(input.buttonIsPressed(Button.AB))) {
    timeAndDate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
        if (input.buttonIsPressed(Button.A)) {
            timeAndDate.set24HourTime(hour + 1, minute, 0)
        } else if (input.buttonIsPressed(Button.B)) {
            timeAndDate.set24HourTime(hour - 1, minute, 0)
        }
    })
    basic.showString(timeAndDate.time(timeAndDate.TimeFormat.HMMAMPM))
}
basic.showString("Set Min")
while (!(input.buttonIsPressed(Button.AB))) {
    timeAndDate.numericTime(function (hour, minute, second, weekday, day, month, year, dayOfYear) {
        if (input.buttonIsPressed(Button.A)) {
            timeAndDate.set24HourTime(hour, minute + 1, 0)
        } else if (input.buttonIsPressed(Button.B)) {
            timeAndDate.set24HourTime(hour, minute - 1, 0)
        }
    })
    basic.showString(timeAndDate.time(timeAndDate.TimeFormat.HMMAMPM))
}
```


## TODO

- [ ] Add a reference for your blocks here
- [X] Add "icon.png" image (300x200) in the root folder
- [X] Add "- beta" to the GitHub project description if you are still iterating it.
- [X] Turn on your automated build on https://travis-ci.org
- [ ] Use "pxt bump" to create a tagged release on GitHub
- [X] On GitHub, create a new file named LICENSE. Select the MIT License template.
- [ ] Get your package reviewed and approved https://makecode.microbit.org/extensions/approval

Read more at https://makecode.microbit.org/extensions

## Supported targets

* for PXT/microbit

## Misc Links & References

FontAwesome Icon: https://iconify.design/icon-sets/fa/ 
SparkFun's Guide: https://learn.sparkfun.com/tutorials/how-to-create-a-makecode-package-for-microbit/all

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
