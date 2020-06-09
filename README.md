# microbit-pxt-softclock

## Setting the Time 

There are three approaches to setting the time:

1. Synchronize at startup 
2. Time advancing / rewinding 
3. Digit count up / count down on digits

Using a reasonable "startup value" as described in [Synchronize at startup](#synchronize-at-startup) will make the last two approaches easier.

### Synchronize at startup

Synchronizing the time at startup is the easiest approach, but it requires re-programming the micro:bit everytime the time needs to be set (like whenever it is restarted).  The `startup` will include blocks to set the time, like:

```blocks
timeAndDate.setDate(1, 20, 2020)
timeAndDate.set24HourTime(13, 30, 0)
```
Setting the date can be left out if there's no need to keep track of the date. 

Once you're ready to program the micro:bit select a time that is approximately 1 minute in  the future.  Program the micro:bit and then watch the time carefully until about 2 seconds before the time that was programmed.  Push the reset button on the back of the micro:bit, which will cause it to restart.  The micro:bit takes about 2 seconds to start, which will set the clock to the desired time at almost exactly that time.





## TODO

- [ ] Add a reference for your blocks here
- [X] Add "icon.png" image (300x200) in the root folder
- [X] Add "- beta" to the GitHub project description if you are still iterating it.
- [ ] Turn on your automated build on https://travis-ci.org
- [ ] Use "pxt bump" to create a tagged release on GitHub
- [X] On GitHub, create a new file named LICENSE. Select the MIT License template.
- [ ] Get your package reviewed and approved https://makecode.microbit.org/extensions/approval

Read more at https://makecode.microbit.org/extensions

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)



## Misc Links & References

FontAwesome Icon: https://iconify.design/icon-sets/fa/ 
SparkFun's Guide: https://learn.sparkfun.com/tutorials/how-to-create-a-makecode-package-for-microbit/all

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
