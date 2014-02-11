jqCube
======

**jqCube** is a [jQuery](http://jquery.com/) library for adding cubes to pages, such as the one pictured below. 
A full API is included for manipulating these cubes, allowing you to change its colors, dimensions, and animate it. You can put any content you like on each side of the cube.

You can [play around with the API-accessible features on this playground page](http://peterolson.github.com/jqCube/jqCube.html)

![Screenshot of web form on green rotating cube](http://i.stack.imgur.com/zMebo.png)

Background
===

You can read some [extended discussion about the user interface implications of rotating cubes](http://ux.stackexchange.com/q/11229/3966). Having seen it's popularity there among user interface professionals, I have decided to release it as an open source project so that anybody can include cubes in their own websites.

How to Use
===

You can download the source files by cloning this repository, or just copying it from this GitHub hosted url:

    http://peterolson.github.com/jqCube/jqCube.jquery.min.js

Include it as a script on your page. It depends on jQuery, so make sure you include it *after* jQuery.

Create a div on your page, and include six divs inside of it, and each should have one of the classes "front", "back", "left", "right", "bottom", "top", like this:

    <div id="myCube">
      <div class="front">Front Side</div>
      <div class="back">Back Side</div>
      <div class="left">Left Side</div>
      <div class="right">Right Side</div>
      <div class="bottom">Bottom Side</div>
      <div class="top">Top Side</div>
    </div>

Then you can make `myCube` into a cube. For default settings, just call `.cube` on a jQuery element with no arguments.

    $("#myCube").cube();

If you want to initialize the cube with custom settings, you can pass a settings object as an argument.

    $("#myCube").cube({ /* settings */ });

Settings
===

`length`, `width`, `height`
---
Sets the dimensions of the cube in pixels with these three settings.

**Expected Value**: Integer<br>
**Default:** `400`

`center`
---
Sets the center point of the cube. Defined by pixel offsets to the left and top of the page.

**Expected Value**: [Integer, Integer]<br>
**Default**: `[300, 300]`


`lightDirection`
---
Sets the direction light comes from. Defined by a proportion of [lightFromRight, lightFromTop, lightFromFront] facing toward the cube. You can use negative values to reverse the direction.

**Expected Value**: [Number, Number, Number]<br>
**Default**: `[1, 1, 1]`

`hue`
---
Sets the hue of the cube.

**Expected Value**: Integer in range [0, 255]<br>
**Default**: `128`

`saturation`
---
Sets the saturation of the cube.

**Expected Value**: Integer in range [0, 100]<br>
**Default**: `50`

`opacity`
---
Sets the opacity/transparency of the cube. 0 is transparent, and 100 is opaque.

**Expected Value**: Integer in range [0, 100]<br>
**Default**: `100`

`minLuminosity`
---
Sets the luminosity of the darkest face of the cube.

**Expected Value**: Integer in range [0, 100]<br>
**Default**: `50`

`maxLuminosity`
---
Sets the luminosity of the brightest face of the cube.

**Expected Value**: Integer in range [0, 100]<br>
**Default**: `85`

`animate`
---
Boolean indicating whether the cube will animate.

**Expected Value**: Boolean<br>
**Default**: `true`

`frameRate`
---
Sets the number of frames drawn per second when the cube animates.

**Expected Value**: Integer<br>
**Default**: `20`

`secondsPerRotation`
---
Sets the approximate time in seconds it will take the cube to rotate fully about one axis at default spinning speed.

**Expected Value**: Integer<br>
**Default**: `5`

`initialPosition`
---
Sets the initial position of the cube in terms of 90 degree [turnsRight, turnsUp] from the default position where the front side is facing forward with the top, bottom, left, and right sides respectively above, below, left, and right of the front side. You can use non-integers to specify partial turns.

**Expected Value**: [Number, Number]<br>
**Default**: `[0, 0]`

`horizontalCoefficient`
---
The relative speed that the cube will rotate in a horizontal direction.

**Expected Value**: Number<br>
**Default**: `1`

`verticalCoeficcient`
---
The relative speed that the cube will rotate in a vertical direction.

**Expected Value**: Number<br>
**Default**: `1`

Methods
===
`setOption(property, value)`
---
Used to dynamically change the cube's settings.

`startAnimation()`
---
Starts animating the cube

`stopAnimation()`
---
Stops animating the cube

`setPosition(position, time, framesPerSecond)`
---
Moves the cube to the specified position (see `initialPosition` setting) in the given time in seconds at the given frames per second. Accepts face names (`"front", "back", "left", "right", "top", "botton"`) as positions.

`moveRight(turns, time, framesPerSecond)`
---
Turns the cube the given number of turns to the right in the given time in seconds at the given number of frames per second.

`moveLeft(turns, time, framesPerSecond)`
---
Turns the cube the given number of turns to the left in the given time in seconds at the given number of frames per second.

`moveUp(turns, time, framesPerSecond)`
---
Turns the cube the given number of turns upward in the given time in seconds at the given number of frames per second.

`moveDown(turns, time, framesPerSecond)`
---
Turns the cube the given number of turns downward in the given time in seconds at the given number of frames per second.

`move([turnsRight, turnsUp], time, framesPerSecond)`
---
Turns the cube the given number of turns in the horizontal and vertical directions at the same time in the given time in seconds at the given number of frames per second. Negative numbers may be used to turn left or down.

