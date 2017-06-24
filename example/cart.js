// set cart variables
let buttonAPress      = 0;
let starRotationAngle = 0;
let musicPlaying      = true;
let currentVolume     = 8;
let bouncingCirle     = {
    x:    80,
    y:    80,
    r:    40,
    vecx: 0.5,
    vecy: 1
};
let maskStatus = 'noMask';
let cameraX = 30;
let cameraY = 30;
let paused = false;

// this function is only called once per execution of the cart, at the beginning
function init () {
    // print the number of frames per second. useful for debugging performance
    fps(true)

    // set the layer 'ss' as a spritesheet where each sprite has a width of 8
    // pixels and a height of 8 pixels
    sprset(8, 8, 'ss1');

    // make a new layer. we will use it later to show the masking functions
    // we call it 'mask'. the default size is (160 x 144), but you can make a
    // layer of any size
    layern('mask');

    // this new layer will be used to show off the mask feature as well
    layern('randomColors');

    // start playing a mod track
    play('mod1');

    // create a map on the fly and fill it with the sprite number 9
    // also, create a new layer (mask2). this will be used to show off the
    // masking functions later on
    mapn('map3', 30, 4);
    for (var x = 0; x < 30; x++) {
        for (var y = 0; y < 4; y++) {
            mset('map3', x, y, 9);
        }
    }
    layern('mask2');
    layer('mask2');
    color(1);
    rectfill(00, 80, 80, 30);
}

// this function is called 60 times per second
function update () {
    // set the active layer to the main one. all the subsequent graphic
    // functions will work on the selected layer
    layer();

    // clear the current layer
    cls();

    // select the current color. this color will be used by all the subsequent
    // graphic functions (drawing of pixels, lines and other primitive
    // shapes)
    color(60);

    // set a pixel at position x = 0, y = 0 to be of the current color
    pset(0, 8);

    // changes one color of the palette setting the color 100 equal to the color
    // 60. Setting a pixel of color 100 will actually result in a pixel of color
    // 60. Note that the color substitution works at rendering time.
    pal(100, 60);
    color(100);
    pset(2, 8);

    // draw some primitive shapes

    // a rectange with the top-left edge at (0, 10) with width = 30 and
    // height = 30
    color(20);
    rect(0, 10, 30, 30);

    // a circle with the center at (15, 25) and a radius of 14
    color(30);
    circ(15, 25, 14)

    // a line from (5, 15) to (25, 35)
    color(40);
    line(5, 15, 25, 35);

    // a fillled rectangle with the top-left edge at (10, 12) with width = 10
    // and height = 10
    color(50);
    rectfill(10, 20, 11, 11);

    // a fillled circle with the center at (15, 25) and a radius of 3
    color(60);
    circfill(15, 25, 3);

    // with pget, read the color of a pixel on the current layer (in this case,
    // it's a pixel withing the filled rectangle)
    color(pget(10, 20));

    // a triangle with the vetices at (40, 10), (35, 15) and (45, 15)
    tri(40, 10, 35, 15, 45, 15);

    // a filled triangle with the vetices at (40, 10), (35, 15) and (45, 15)
    color(70)
    trifill(35, 17, 45, 17, 40, 22);

    // draw on the current layer the sprite 0 of the image 'ss' at different
    // (x, y) coordinates
    sprcp('ss1', 0, 1, 120);
    sprcp('ss1', 0, 11, 120);
    sprcp('ss1', 0, 3, 129);
    sprcp('ss1', 0, 13, 129);

    // print the letters "A" and "S" at coordinates (3, 121) and (13, 121) using
    // the default system font ('font') and the font color (white)
    print("A", 3, 121);
    print("S", 13, 121);

    // print the letters "Z" and "X" with the "colorize" option. The colorize
    // option, that can also be turned on with colorize(COLOR), draws fonts and
    // sprites with the current color for each pixel that is not "0"
    // (transparent color)
    colorize(65);
    print("Z", 5, 130);
    print("X", 15, 130);
    colorize();

    // if the button "a" is pressed, set the variable buttonAPress to 10.
    // for the following 10 frames, button "a" will be drawn with the sprite
    // number 1 instead of the sprite number 0.
    // It also plays a sound with the function "sfx"
    //
    // btnp checks that a button has been pressed in the last few frames,
    // white btn checks that a button is currently being pressed
    //
    // accepted values for btnp and btn are:
    //     'up', 'down', 'left', 'right',
    //     'a', 's', 'z', 'x'
    if (btnp('a')) {
        buttonAPress = 10;
        // play a sound
        sfx('sfx1');
    }
    buttonAPress--;
    if (buttonAPress > 0) {
        sprcp('ss1', 1, 1, 120);
    }

    // pressing button "s" will toggle the music
    if (btnp('s')) {
        if (musicPlaying) {
            stop('mod1');
            musicPlaying = false;
        } else {
            play('mod1');
            musicPlaying = true;
        }
    }

    // arrow up and down will increase / decrease the music volume. the volume
    // ranges from 0 to 20
    if (btnp('up')) {
        volume('mod1', ++currentVolume);
    }
    if (btnp('down')) {
        volume('mod1', --currentVolume);
    }

    // with sprcp you can select how many sprites horizontally (in this case 2)
    // and how many vertically (in this case 1) to draw from the sprite sheet
    // starting from the selected sprite
    sprcp('ss1', 4, 35, 30, 2, 1);

    // normaly sprites are copied from the sprite sheet to the current layer
    // with the same size. you can however select the destination size, in this
    // case (16 x 16), doubling the original size (8 x 8)
    // sprcp('ss', 4, 55, 22, 1, 1, 16, 16);
    sprcp('ss1', 4, 55, 22, 1, 1, 16, 16);

    // you can also flip sprites horizontally and vertically
    sprcp('ss1', 4, 75, 30, 1, 1, 8, 8, true, true);

    // and freely rotate them using degrees (0-360)
    sprcp('ss1', 5, 85, 30, 1, 1, 8, 8, false, false, starRotationAngle);
    starRotationAngle += 2;

    // cp is the low-level version of sprcp. it doesn't work with sprites,
    // but freely copies a layer (or portions of it) on the current layer.
    // it also supports scaling, flipping and rotating
    cp('ss1', 100, 28, 3, 3, 10, 10);

    // map draws a map on the current layer using the specified sprite sheet.
    // you can specify where to draw it ((0, -16) in the example). you can also
    // draw a portion of the map specifying at what index starting to draw
    // ((0, 7) in our example) and how many tiles to draw (we didn't set it,
    // so it's drawing the tile till the fill width and height)
    map('map1', 'ss1', 0, -16, 0, 7);

    // it's also possible to create a new map on the fly, in the example a map
    // called 'map2' with a width of 2 tiles and a height of 1 tile
    mapn('map2', 2, 1);

    // mset let's you change map tiles on the fly (its companion function
    // mget reads a tile value)
    mset('map2', 0, 0, 8);
    mset('map2', 1, 0, 9);
    map('map2', 'ss1', 85, 56);

    // toggle mask when pressing "x"
    // a map is a layer applied on another layer as mask. on the target layer,
    // only those pixels that are set to a color different from 0 on the mask
    // will be drawn (or, only those pixels that are 0 if "inverse" mode is on)
    if (btnp('x')) {
        layer('randomColors');
        if (maskStatus === 'noMask') {
            maskStatus = 'mask';
            mask('mask');
        } else if ((maskStatus === 'mask')) {
            maskStatus = 'maskInverted';
            mask('mask', true);
        } else {
            maskStatus = 'noMask';
            mask();
        }
        layer();
    }

    // the camera function sets an offsets and all subsequent drawing functions
    // will be shifted accordingly. calling camera without argumets resets the
    // camera settings to (0, 0)

    camera(cameraX, cameraY);
    mask('mask2');
    map('map3', 'ss1', 0, 110);
    mask();
    camera();

    // left and right arrows move the camera when drawing the small map
    if (btn('left')) {
        cameraX += 2;
    }
    if (btn('right')) {
        cameraX -= 2;
    }

    // draw a bouncing ball on the layer 'mask' if it is used to mask the main
    // layer

    if (maskStatus === 'mask' || maskStatus === 'maskInverted') {
        // select the layer 'mask'
        layer('mask');

        // clear the layer with the transparent color
        cls(0);

        bouncingCirle.x += bouncingCirle.vecx;
        bouncingCirle.y += bouncingCirle.vecy;

        // draw the circle with solid black
        color(1);
        circfill(bouncingCirle.x, bouncingCirle.y, bouncingCirle.r);
        if (   bouncingCirle.x + bouncingCirle.r > 160
            || bouncingCirle.x - bouncingCirle.r < 0)
            bouncingCirle.vecx *= -1;
        if (   bouncingCirle.y + bouncingCirle.r > 144
            || bouncingCirle.y - bouncingCirle.r < 0)
            bouncingCirle.vecy *= -1;

        layer('randomColors');
        cls(0);
        for (var x = 0; x < 160; x++) {
            for (var y = 0; y < 144; y++) {
                color(Math.floor(Math.random() * 255));
                pset(x, y);
            }
        }

        // select back the main layer
        layer();

        cp('randomColors');
    }

    // draw to the screen what's currently on the main layer
    draw()
}
