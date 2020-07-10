## Specs

Screen size: 160 x 144
Colors: 256 (0 is transparent)
FPS: 60
Keyboard: Arrow keys plus buttons 'a', 's', 'z' and 'x'
Support: Node 8.0+; Google Chrome 60+; Firefox 54+; Safari 10.1+; Chromium 60+;

## Getting started

tako80 has been tested with the latest version of Google Chrome and Node.js.

To install tako80, run in your shell

`sudo npm install -g tako80`

This will install the command tako80. To view the example, run

`tako80 example`

The directory tako80example will be create. cd into the new directory and run

`tako80 devel`

This will launch the development server reacheable at http://localhost:3000. Any change done on cart.js or on the assets will be reflected on the server as soon as you refresh the page. By clicking on compile, the server will generate a dist directory with the compiled game (saved as a png image called cart.png), the tako80 runtime file (tako80.min.js) and a html file (index.html) that shows how to run a tako80 cart on a web page. cart.png will be customized with your custom label.png.

Optionally tako80 devel accepts a port number different from 3000.

`tako80 devel 1337`

While running the development server, you can take screenshots of your game by pressing the "p" key.

The best way to start learning tako80 is to read the source code of the example chart (available in code.js). It is fully commented and presents all the functions available in tako80.

To create a new project, just run

`tako80 new PROJECT_NAME`

This creates a directory called PROJECT_NAME with everything you need to create your game. The directory contains the following files:

* assets.json	Where you tell **tako80** the media files used by your game
* cart.js	With the actual code of the game
* font.png	System font of **tako80**. You can use it as a template to draw your own font
* image1.png	Just a placeholder. You can create as many images as you want to provide graphics for your game
* index.html	The html file used by the development server
* label.png	Example label to be placed on your cart.png while compiled
* map1.json	A sample Tiled map file
* mod1.mod	An example protracker mod to be used as background music for your game
* palette.png	An image with **tako80** palette. You can use it as reference when creation your graphics
* sfx1.wav	An example sound effect. You can use as many as you like

By running

`tako80 devel`

inside the newly created directory, you can start developing your game and see the results of your changes on http://localhost:3000 as you go.

To update tako80 to the latest version, use the standard npm procedure:

`sudo npm update -g tako80`

If you have an existing project and you'd like to update it to the latest version of tako80 (once you've installed it on your computer), cd to the project directory and run

`tako80 update`

## Key concepts

### Assets

Everything that is not code is called an asset. Images, sound, music are all assets. tako80 supports known formats as asset files.

Image files must be standard .png files. You can use images as map tiles or sprites. Any program able to save PNG images will work. If you want a free and online solution, take a look at Piskel.

You can save sound (to be used as sound effects) as .wav or .mp3 files. On Freesounds there are tons of sounds available for free that you can use in your game. MP3 files are much smaller than Wave files. If you a Wave file, you can convert it to MP3 with free softwares like Audacity

If your game needs maps, you can create them with the free softare Tiled. tako80 supports simple Tiled generated maps once you export them as .json files. Mind that tako80 only reads basic informations from maps, like their size and the actual tiles. Tiled lets you make very complicated maps with multiple layers, tile flags and more. This is not currently supported by tako80.

To give you game some fancy backgroun music, tako80 supports standard Protracker module files. On Modarchive you can find thousands of them many of which are free to use. You can compose your own modules with many different softwares like the free MilkyTracker.

### assets.json
In the file assets.json you indicate what are the assets used by your game. It looks like this:


    {
        "images": {
            "image1": "image1.png"
        },
        "sfx": {
            "sfx1": "sfx1.wav"
        },
        "mods": {
            "mod1": "mod1.mod"
        },
        "maps": {
            "map1": "map1.json"
        }
    }

The four self-explanatory sections are images (your PNG files), sfx (your Wave or MP3 files), modes (your module music files) and maps (with the Tiled maps exported as JSON files used by your game).

For each section you can specify as may assets are you want. Each asset has a code (like sfx1 in the example) that you will be using in your code to refer to the asset, and the actual name of the file.

### Multiple source files

When your project starts growing, you might want to split the source code into multiple files. For instace, suppose that you have all your enemies functions in monsters.js and some map generation code in map.js. The main code still resides in cart.js.

You can specify those additional source code file in assets.json using the optional array "sources", like this:


    {
        "images": {
            "image1": "image1.png"
        },
        "sfx": {
            "sfx1": "sfx1.wav"
        },
        "mods": {
            "mod1": "mod1.mod"
        },
        "maps": {
            "map1": "map1.json"
        },
        "sources": ["monsters.js", "map.js"]
    }

They will be merged into cart.js before cart.js code and in the order they are declared in the sources array.

### Layers

In tako80 you draw on the 160 x 144 screen by using the graphic functions explained in detail later. The screen is a layer (layer "0"). A layer in tako80 is a canvas you can draw on. You can have many layers, copy images from one layer to another, stack them to create the final image or used them off-screen to prepare images. When you load an image (by putting it in you asset.json file), you are actually creating a layer. This is very powerful, as you can create spritesheets on the fly, precompute images and compose the final image to be displayed by stacking different layers one on top of the other.

Using too many layers, thought, can lead to perfomarmance issues. It is a powerful instrument to be used carefully!

Layers can also be used as masks. A mask is a reference layer applied on another layer. When you tell tako80 to use layer A to mask layer B, all the drawing done on layer B will occur only if the corresponding pixel on layer A is not transparent (or transparent, if you apply an inverted map).

### Images, spritesheets and fonts

As said, once an image is loaded into tako80 by declaring it in the images section of your assets.json file, it is available as a layer having the code you specified. You can load any PNG file. Naturally, the bigger the image, the more performance issues you may encounter. Since tako80 screen only supports a fixed set of 256 colors (see next section), if the image uses any color that is not in the standard palette, that color will be converted in the most similar color found by tako80.

You can tell tako80 to treat a layer as a spritesheet by telling it the width and height of each pixel. Sprites will be enumerated from left to right, top to bottom (so, sprite "0" is the top-left sprite and so on). By doing so, you can select refer to each sprite individually and draw it. In order for a spritesheet to be valid, the width and height of the layer must be a multiple of the wanted width and height of each sprite.

To display a map, you must tell it what spritesheet layer to use as tiles.

tako80 has a standard font (you can see it in the font.png file once you create a new project). A font is nothing but a fancy spritesheet with 96 sprites. So, as long as you have a layer with 96 sprites correctly mapped to characters as shon in font.png, you can use it as a font.

### Colors

tako80 display supports 256 colors. Color 0 is the only transparent colors, color 1 is black and color 16 is white (it is the default color). You can refer to each color by its number. The colors are:

![16x16 grid of colored rectangles with number labels](https://i.imgur.com/lWEgfVQ.png)

## Programming

One you have your assets loaded, you can actually start coding the game in cart.js.

A cart.js file is generally composed of 3 parts: global variable declaration, init section and update section:

    // set cart variables
    let step = 1;

    // this function is only called once per execution of the cart, at the beginning
    function init () {
        fps(true);
    }

    // this function is called 60 times per second
    function update () {
        cls();

        print(step, 0, 10);
        step++;

        draw();
    }

The init() function is called only once, at the beginning of the game. It is useful to declare initial variable values or, like in the example above, initialize the fps counter (this will show the current FPS on tge top-left corner of the display).

The update() function is called once per frame (60 times a second). It is the core of your game. Generally, you want to clear the screen (cls()), do your drawings (in this case we just the print the value of a variable that we increment at each frame) and finally draw() everything to the main screen.

## Layer functions

#### `layer([l])`

Sets the current layer to layer l. If l is not passed, it sets the current layer to layer "0", the main one.

    // set the current layer to the layer 'image1'
    layer('image1');

    // draw a rectangle on the current layer, that is now 'image1'
    rect(10, 10, 30, 30);

    // reset the current layer to the main layer
    layer();

#### `layern(l, [w], [h])`

Creates a new layer with the code l having a width of w pixels and a height of h pixels. From now on, you can refert to this layer as l.

If w is not passed, it defaults to 160. If h is not passed, it defaults to 144.

    // create a new layer called 'newLayer' with a width of 50 and a height of 60
    layern('newLayer', 50, 60);

    // set 'newLayer' as the current layer
    layer('newLayer');

    // draw a rectangle on the current layer that is now 'newLayer'
    rect(10, 10, 20, 20);

#### `mask([l], [i])`

Sets the layer l as mask for the current layer. From now on, drawing on the current layer will only happen on those pixels whose corresponding pixel on the layer l is not a trasparent pixel (color 0). If i is true, the mask is applied with the inverted option and the drawing will occour only if the correspondin pixels on are mask are transparent (color 0).

If called with no arguments, maks() removes all the masks from the current layer.

    let x = 1;

    function init () {
        // create a new layer called 'maskLayer' and activate it
        layern('maskLayer');
        layer('maskLayer');

        // draw a black filled circle on maskLayer
        color(1);
        circfill(50, 50, 30);

        // set the active layer to the main one and apply maskLayer as its mask
        layer();
        mask('maskLayer');
    }

    function update () {
        cls();

        // draw a moving pink rectangle. it will only show when it passes under the
        // mask
        color(60);
        rectfill(x, 30, 20, 20);
        x++;

        draw();
    }

### Display functions

#### `cls([c])`

Clears the current layer. If c is not passed, clear fill it with black color, otherwise with the passed color. Typically it is called at the beginning of the update() function.

Callingcls(0) will clear the current layer with the transparent color

#### `draw()`

Display on tako80 screen the content of layer 0. Typically it is called at the end of the update() function.

### Debug functions

#### `fps([f])`

If f is true (default is false), the current number of Frames Per Second (FPS) will be displayed on the top left corner of the screen.

### Color functions

#### `color([c])`

Sets the current color equal to c. If c is not passed, it defaults to 16 (white color).

All the subsequent calls to primitive drawing functions (pset(), drawing lines and rectangles and so on) will use the set color.

All the subsequent calls to the sprite drawing functions (cp, sprcp, map) will use the set color if colorize is active.

    function update () {
        cls();

        for (var x = 0; x < 160; x++) {
            for (var y = 0; y < 144; y++) {
                // set the current color to a random one and draw the pixel at (x, y)
                // with that color
                color(Math.random() * 256);
                pset(x, y);
            }
        }

        draw();
    }

#### `colorize([c])`

If c is not passed as parameter, disactivate the colorize functionality. When c is a color, all the subsequent calls to the sprite drawing functions (cp, sprcp, map...) and will draw any non-transparent pixel with the currently active color and will skip any transparent pixel.

It also affects the color of the font in print()

    function init () {
        // set the layer 'ss1' as a spritesheet where each sprite has a width of
        // 8 pixels and a height of 8 pixels
        sprset(8, 8, 'ss1');
    }

    function update () {
        cls();

        // draw the sprite 4 of ss1 at position (x, y)
        sprcp('ss1', 4);

        // activate colorize  with the color 'yellow' and draw the sprite 4 of ss1
        // at position (10, 0)
        colorize(30);
        sprcp('ss1', 4, 10);
        colorize();

        draw();
    }

colorize

#### `pal([c1], [c2])`

Sets the color c1 to be the same as color c2. All the subsequent uses of color c1 will be the same as using color c2.

Note: the substitution is done at draw time. If you switch the color palette, draw something, than switch again, only the second switch will apply.

Calling pal() without arguments will reset the palette to the default one.

    function update () {
        cls();

        // set the current color to green and draw a pixel
        color(200);
        pset(10, 10);

        // set the color 100 (purple) to be equal to 200 (green)
        pal(100, 200);

        // setting the color purple will acually result in drawing another green pixel
        color(100);
        pset(20, 10);

        draw();
    }

### Primitive drawing functions

#### `camera([x], [y])`

camera() sets the current camera setting to x, y. All subsequent drawing functions will result in a shift of (-x, -y), like, in fact, moving a camera over the screen.

Calling camera() with no arguments resets the camera to (0, 0).

    let x = 0;

    function update () {
        cls();

        // set the camera shit
        camera(x, 0);

        // we alway draw the rectangle at (10, 10), but it will appear to move
        rect(10, 10, 10, 10);
        x--;

        draw();
    }

    function update () {
        cls();

        // tilt effect!
        camera(Math.random() * 2, Math.random() * 2);

        rect(10, 10, 10, 10);

        draw();
    }

#### `pset(x, y)`

Draws a pixel at (x, y) on the current layer with the current color

    function update () {
        cls();

        // plot a sine wave
        let t = 0;
        for (var i = 0; i < 160; i++) {
            pset(i, (Math.cos(t) * 15) + 50);
            t += 0.1;
        }

        draw();
    }

#### `pget(x, y)`

Return the color code at (x, y) on the current layer.

#### `line(x1, y1, x2, y2)`

Draw a line form (x1, y1) to (x2, y2) with the current color to the current layer

    function update () {
        cls();

        // draw a white grid
        for (var x = 0; x < 160; x += 8) {
            for (var y = 0; y < 144; y += 8) {
                line(0, y, 160, y);
                line(x, 0, x, 144);
            }
        }

        draw();
    }

#### `rect(x, y, w, h)`

Draw a rectangle on the active layer with the current color having its top-left vertex at (x, y), a width of w and a height of h pixels;

    function update () {
        cls();

        // draw some colored pixels
        for (var i = 0; i < 12; i++) {
            color(Math.random() * 256);
            rect(i * 10, i * 10, 40, 40);
        }

        draw();
    }

#### `rectfill(x, y, w, h)`

Like rect(), but the rectangle is fill with the current color.

#### `circ(x, y, rd, [a1], [a2])`

Draws a circle having it center at (x, y) and a radius of rd pixels.

If a1 and a2 are passed, only draw the circle from the angle (in degrees) a1 to the angle a2.

    let t = 0;

    function update () {
        cls();

        // draw a rotating arc
        circ(50, 50, 30, t, t+90);
        t += 2;

        draw();
    }

#### `circfill(x, y, rd)`

Like circ(), but the circle is fill with the current color. Doesn't support drawing a partial circle like circ() does.

#### `tri(x1, y1, x2, y2, x3, y3)`

Draws a triangle with vertices at (x1, y1), (x2, y2), (x3, y3).

    let t = 0;

    function update () {
        cls();

        // draw a triangle and a filled triangle
        tri(50, (Math.sin(t) * 30) + 50, 25, 50, 75, 50);
        trifill(50, (Math.sin(t) * -30) + 50, 25, 50, 75, 50);
        t += 0.1;

        draw();
    }

#### `trifill(x1, y1, x2, y2, x3, y3)`

Like tri(), but the triangle is fill with the current color.

### Print functions

#### `print(text, [x], [y], [l])`

Prints text at (x, y). If x and y are not passed, print at (0, 0). Use the default tako80 font unless a different layer l is passed to be used as font.

To be used as font, a layer must have been set as a spritesheet with sprset() and must be a spritesheet of exaclty 96 sprites. The order of the sprites must respect the one shown in font.png (sprite 0 is a space, sprite 1 is "!" and so on).

    function update () {
        let c = 0;
        for (var i = 0; i < 96; i++) {
            const xx = Math.floor(i % 16) + 2;
            const yy = Math.floor(i / 16) + 2;
            colorize(c)
            // print each of all the 96 characters using the default font and the
            // "colorize" functionality to use a different color for each character
            print (String.fromCharCode(32 + i), xx * 8, yy * 8);
            c += 2;
        }
        draw();
    }

### Layer drawing and sprite functions

#### `cp(l, [dx], [dy], [sx], [sy], [sh], [sw], [dw], [dh], [fh], [fv], [a])`

Low-level function for copying all or a portion of the layer l onto the current layer.

If called only with the l argument, copies all layer l to the current layer at (0, 0).

You can draw l at the coordinate (dx, dy) of the current layer.

You can copy only a portion of the layer l by specifying where to start copying (sx, sy), the width of the copy (sw) and the height (sh) of the copy in pixels.

The source layer l (or a portion of it) is copied on the current layer with the same size unless you specify a different destination width (dw) or height (dh), allowing to scale the copied images.

The source image can also be copied flipped horizontally (passing fh as true) or vertically (passing fv as true).

Finally, the source image can be copied with a rotation of a degrees.

    // copies on the current layer at (10, 20) the portion of 'ss1' starting at (30, 40) and having
    // a witdth of 50 and a height of 60. Copies the image scaling it to a width of 100 and a height of
    // 120. Flips it both horizontally and vertically and rotate it by 45 degrees.
    cp('ss1', 10, 20, 30, 40, 50, 60, 100, 120, true, true, 45);

For a complete usage example, see the example cart.

#### `sprset(w, h, [l])`

Declares the layer l (or the current layer, if l is not passed) as a spritesheet where each sprite has a width of w pixels and a height of h pixels.

In order for a layer to be used as a font, by functions like cp() and sprcp() or by the maps functions, it must be defined as a spritesheet.

In order for a spritesheet to be valid, the width and height of the layer must be a multiple of the wanted width and height of each sprite.

    // declares the layer 'ss1' as a spritesheet where each sprite has a width of 8 pixels
    // and a height of 10 pixels
    sprset('ss1', 8, 10);

For a complete usage example, see the example cart.

`sprcp(l, s, [x], [y], [sw], [sh], [w], [h], [fh], [fv], [a])`

Sprite copy. sprcp() works just like cp() but copies on the current layer the sprite number s of the layer l that must have been set as a spritesheet with sprset().

x and y ar the coordinates on the current layer where to draw the sprite number s or layer l.

sw and sh indicate how many sprites to copy. For instance

`sprcp('ss1', 2, 10, 10, 2);`

will copy at (10, 10) the sprite number 2 (the third sprite, since their index is 0-based) of the layer 'ss1' (that must have been declared as a spritesheet) taking two sprites horizontally (this means that the sprites 2 and 3 will be drawn)

w and h are the width and height in pixels on the destination layer (this allows to scale the sprite).

Just like cp(), sprcp allows to flip the sprite horizontally (fh), vertically (fv) and rotate it by an angle of a degrees.

For a complete usage example, see the example cart.

### Map functions

#### `map(m, l, [x], [y], [sx], [sy], [sw], [sh])`

Draws on the current layer the Tiled map m using as spritesheed the layer l (that must have been declared as spritesheet). Draws it at the coordinates (x, y). Eventually draw the portiion of map starting at the coordinates (sx, sy) with a width of sw tiles and a height of sh tiles.

For a complete usage example, see the example cart.

#### `mapn(m, w, h)`

Creates the new map called m with a width of w tiles and a height of h tiles.

For a complete usage example, see the example cart.

#### `mget(m, x, y)`

Returns the tile number at (x, y) of the map m.

For a complete usage example, see the example cart.

#### `mset(m, x, y, t)`

Sets the tile at (x, y) of the map m to be equal to tile t.

For a complete usage example, see the example cart.

### Sound functions

#### `sfx(s)`

Plays the sound s;

#### `play(m)`

Starts playing the module m at volume 8;

#### `stop(m)`

Stops playing the module m;

#### `volume(m, v)`

Sets the playing volume of module m at v, where v is a number between 0 (no music) and 20 (loudest music).

### Input functions

#### `btn(k)`

Returns true if the button k is currently being pressed. Possible values for k are: 'up'. 'dowm', 'left', 'right', 'a', 's', 'z', 'x'.

#### `btnp(k)`

Returns true if the button k has been pressed in the last frame. Useful for thigs like "Press key to contienue". Possible values for k are: 'up'. 'dowm', 'left', 'right', 'a', 's', 'z', 'x'.

    let x = 50;
    let y = 50;
    let bullets = [];

    function update () {
        cls();

        // move the rectangle around when the arrow keys are pressed
        if (btn('up'))    y -= 1;
        if (btn('down'))  y += 1;
        if (btn('left'))  x -= 1;
        if (btn('right')) x += 1;

        // when the button 'a' is pressed, add four 'bullet' object whose vx, and vy
        // vector indicate the four different directions they'll move to
        if (btnp('a')) {
            bullets.push({ x, y, vx: -3, vy:  0});
            bullets.push({ x, y, vx:  3, vy:  0});
            bullets.push({ x, y, vx:  0, vy: -3});
            bullets.push({ x, y, vx:  0, vy:  3});
        }

        // advance each bullet towards its direction, and draw it as a green circle
        // if the bullet is outside the screen, remove it from the array of bullets
        for (let b = 0; b < bullets.length; b++) {
            const bullet = bullets[b];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            color(186);
            circfill(bullet.x, bullet.y, 2);
            if (bullet.x < -10 || bullet.x > 170 || bullet.y < -10 || bullet.y > 150) {
                bullets.splice(b, 1);
            }
        }

        // reset the color to white and draw the rectangle
        color();
        rectfill(x, y, 10, 10);

        draw();
    }

### Math functions

#### `sin(x)`

Alternative implementation of Javscript standard Math.sin(). It is compatible with PICO-8's sin function as it treats x as if it's in the range 0-1 and not 0-2PI.

#### `cos(x)`

Alternative implementation of Javscript standard Math.cos(). It is compatible with PICO-8's cos function as it treats x as if it's in the range 0-1 and not 0-2PI.

#### `atan2(dx, dy)`

Alternative implementation of Javscript standard Math.atan2(). It is compatible with PICO-8's atan2 function as it treats the input as if it's in the range 0-1 and not 0-2PI.

#### `rnd([min], [max], [int])`

Alternative implementation of Javscript standard Math.random(). It uses a seed that is randomized at start time. The seed can be reset or set with rndseed(). By default, returns a random integer between 0 and 1 (that is, 0 or 1). You can pass a min and max number and the function will return a random number between min and max (min and max included). So, for instance, rnd(1, 6) will simulate the roll of a die and return a number that is 1, 2, 3, 4, 5 or 6.

If you want a float, call rnd with int = true;

#### `rndseed([x])`

Sets the seed used by rnd to x. If you don't pass x, sets the seed to a random number (this is done by default at start time).
