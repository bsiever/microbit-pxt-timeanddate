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
