(function () {

    /**
     * Main function. It returns an object with all the public functions bound to
     * a new context that it creates by loading a cart
     */
    function boot () {
        let WIDTH = 160;
        let HEIGHT = 144;
        let PIXEL_WIDTH = 4;

        const {SYSTEM_FONT_DATA, LOGO_DATA , INTRO_WAV_DATA, INTRO_LOGO_DATA} = require('./tako80.core.data');

        const INTRO_DURATION = 3000;

        const GL_VERTEX_SHADER_SOURCE = `
            attribute vec4 a_position;
            varying vec2 v_texcoord;
            void main() {
                gl_Position = a_position;

                // assuming a unit quad for position we
                // can just use that for texcoords. Flip Y though so we get the top at 0
                v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;
            }
         `;

        // https://stackoverflow.com/questions/19695658/emulating-palette-based-graphics-in-webgl-v-s-canvas-2d
        const GL_FRAGMENT_SHADER_SOURCE = `
            precision mediump float;
            varying vec2 v_texcoord;
            uniform sampler2D u_image;
            uniform sampler2D u_palette;

            vec4 color;

            void main() {
                float index = texture2D(u_image, v_texcoord).a * 255.0;

                color = texture2D(u_palette, vec2((index + 0.5) / 256.0, 0.5));

                // CRT effect
                // color -= abs(sin(v_texcoord.y * 100.0 * 5.0)) * 0.08; // (1)
                // color -= abs(sin(v_texcoord.y * 300.0 * 10.0)) * 0.05; // (2)

                gl_FragColor = color;
            }
        `;

        const PALETTE = require('./tako80.core.palette.js').PALETTE;

        let COLORS = PALETTE.slice();
        let palette = new Uint8Array(COLORS.length * 4);
        makePalette();

        let gl;
        let image;

        const _images = {
            0: {
                id:     0,
                data:   new Uint8Array(),
                width:  0,
                height: 0,
                masks:  {}
            }
        };
        const _sfx  = {};
        const _mods = {};
        const _maps = {};

        let _color    = 0xF;
        let _layer    = 0;
        let _camera   = [0, 0];
        let _colorize = null;
        let _status   = 'paused';
        let _sshot    = false;
        let _sshotfn  = null;

        const _fps = {
            running: false,
            lastTime: new Date(),
            fps: 0,
            lastFps: 0
        }
        const _btns  = {};
        const _btnsp = {};

        const publicFunctions = [color, colorize,
            layer, layern, mask,
            camera,
            pset, pget,
            line, rect, rectfill, circ, circfill,
            cp,
            sprset, sprcp,
            print,
            sfx, play, stop, volume,
            cls, draw,
            run, pause, runcart, stopcart,
            fps,
            btn, btnp,
            map, mapn, mget, mset,
            pal,
            tri, trifill,
            sshot,
            sin, cos, atan2,
            rnd, rndseed
        ];

        let _rndSeed = new Date().getTime();

        /**
         * Loads the palette Uint8Array with colors from colors
         */
        function makePalette () {
            for (var i = 0; i < COLORS.length; i++) {
                palette[i * 4 + 0] = COLORS[i][0];
                palette[i * 4 + 1] = COLORS[i][1];
                palette[i * 4 + 2] = COLORS[i][2];
                palette[i * 4 + 3] = COLORS[i][3];
            }
        }

        /**
         * Given an image data object, returns a Uint8Array usable by tako80.
         * It maps each color to a color from the standard palette. If a color
         * is not part of the palette, the most similar available color is used
         */
        function rgb2palette (imageData, width, height) {
            function getNearestColor (color_r, color_g, color_b, a) {
                if (a !== 255) return 0;
                // handle hex input
                if (color_r && color_g === undefined) {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color_r);
                    [color_r, color_g, color_b] = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
                }

                //Function to find the smallest value in an array
                // TODO: don't extend Array
                Array.min = (array) => Math.min.apply(Math, array);

                //Convert the HEX color in the array to RGB colors, split them up to R-G-B, then find out the difference between the "color" and the colors in the array
                const differenceArray = PALETTE.map(c => {
                    return Math.sqrt( ((color_r - c[0]) * (color_r - c[0])) + ((color_g - c[1]) * (color_g - c[1])) + ((color_b - c[2]) * (color_b - c[2])) );
                });

                //Get the lowest number from the differenceArray
                const lowest = Array.min(differenceArray);

                return differenceArray.indexOf(lowest);
            }

            const paletteImage = new Uint8Array(imageData.length / 4);
            for (var i = 0, ii = 0; i < imageData.length; i+=4, ii++) {
                let [color_r, color_g, color_b, a] = [imageData[i], imageData[i+1], imageData[i+2], imageData[i+3]];
                paletteImage[ii] = getNearestColor(color_r, color_g, color_b, a);
                if (paletteImage[ii] === 0 && a === 255) {
                    paletteImage[ii] = 1;
                }
            }

            return paletteImage;
        }

        /**
         * Initialize the cart by creating a canvas and loading the cart.
         * assets is an object with the following keys:
         * images, sfx, mods, maps
         */
        function init (container, assets={}) {
            // create and initialize the display canvas
            const canvas = document.createElement('canvas');
            canvas.width  = WIDTH * PIXEL_WIDTH;
            canvas.height = HEIGHT * PIXEL_WIDTH;
            canvas.tabIndex = 1;
            canvas.style.outline = 'none';

            container.style.width = canvas.width + 'px';
            container.style.height = canvas.height + 'px';

            container.appendChild(canvas);
            canvas.focus();

            // create the webgl context. the webgl program has two textures, one
            // with the actual image to display (160 x 144 pixels, it is then scaled up
            // 4 times for the retro look effect) and the other with the palette
            gl = canvas.getContext('webgl', {
                alpha: false
            });
            const glProgramInfo = twgl.createProgramInfo(gl, [GL_VERTEX_SHADER_SOURCE, GL_FRAGMENT_SHADER_SOURCE]);

            // Note: createProgramFromScripts will call bindAttribLocation
            // based on the index of the attibute names we pass to it.
            gl.useProgram(glProgramInfo.program);

            const imageLoc = gl.getUniformLocation(glProgramInfo.program, "u_image");
            const paletteLoc = gl.getUniformLocation(glProgramInfo.program, "u_palette");

            // tell it to use texture units 0 and 1 for the image and palette
            gl.uniform1i(imageLoc, 0);
            gl.uniform1i(paletteLoc, 1);

            // Setup a unit quad
            const positions = [
                 1,  1,
                -1,  1,
                -1, -1,
                 1,  1,
                -1, -1,
                 1, -1
            ];
            const vertBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            // Make image. Just going to make something 8x8
            _images[0].data = new Uint8Array(WIDTH * HEIGHT);
            _images[0].width = WIDTH;
            _images[0].height = HEIGHT;
            layer();
            cls();

            // make image textures and upload image
            gl.activeTexture(gl.TEXTURE0);
            const imageTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, imageTex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, WIDTH, HEIGHT, 0, gl.ALPHA, gl.UNSIGNED_BYTE, _images[0].data);

            // make image textures and upload image
            gl.activeTexture(gl.TEXTURE1);
            const paletteTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, paletteTex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, COLORS.length, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

            gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

            // handle the supported key events. when a key is pressed, it sets its entry
            // on the _btns object to 0. after one frame, it is set to 1 by the main game loop
            // (to handle the "just pressed")
            canvas.addEventListener('keydown', function (evt) {
                const pressedKey = evt.key.toLowerCase();
                const key = ['arrowup', 'arrowright', 'arrowdown', 'arrowleft', 'a', 's', 'z', 'x'].indexOf(pressedKey);
                if (key !== -1) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _btns[pressedKey] = true;
                    if (_btnsp[pressedKey] === undefined) {
                        _btnsp[pressedKey] = 0;
                    }
                }
            });

            // remove the entry of the key from the _btns object
            canvas.addEventListener('keyup', function (evt) {
                const pressedKey = evt.key.toLowerCase();
                try {
                    delete _btns[pressedKey];
                    delete _btnsp[pressedKey];
                } catch (e) {}
            });

            // asynchronously load all the assets
            return new Promise(resolve => {
                // load the default font
                assets.images.font = SYSTEM_FONT_DATA;
                const assetsToLoad = Object.keys(assets.images || {}).length
                                   + Object.keys(assets.mods   || {}).length
                                   + Object.keys(assets.maps   || {}).length;

                /**
                 * checks that the number of assets to load equals to the number of
                 * assets loaded. called by each loading function till the loading is
                 * done
                 */
                function checkLoadingDone () {
                    const loadedAssets = Object.keys(_images).length
                                       + Object.keys(_mods).length
                                       + Object.keys(_maps).length - 1;

                    if (loadedAssets === assetsToLoad) {
                        // set the default font
                        sprset(5, 6, 'font');
                        resolve();
                    }
                }

                if (assets.images) {
                    // load the image onto a temporary canvas to get its data. then convert
                    // the data to the data format used internally by tako80
                    for (let img in assets.images) {
                        const newImage = document.createElement('img');
                        newImage.onload = function () {
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.width = newImage.width;
                            canvas.height = newImage.height;
                            context.drawImage(newImage, 0, 0 );
                            const imageData = context.getImageData(0, 0, newImage.width, newImage.height);

                            _images[img] = {
                                id:     img,
                                data:   rgb2palette(new Uint8Array(imageData.data)),
                                width:  newImage.width,
                                height: newImage.height,
                                masks:  {}
                            };

                            checkLoadingDone();
                        };

                        // handle both images to load from the server and images already mapped as
                        // data urls (images packed in the cart)
                        if (assets.images[img] instanceof Uint8Array) {
                            newImage.src = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, assets.images[img]));
                        } else {
                            if (assets.images[img].startsWith('data:image/png;base64,')) {
                                newImage.src = assets.images[img];
                            } else {
                                newImage.src = assets.images[img];
                            }
                        }
                    }
                }

                // load the wave sound effects
                if (assets.sfx) {
                    for (let sound in assets.sfx) {
                        if (assets.sfx[sound] instanceof Uint8Array) {
                            const dataUri = 'data:audio/wav;base64,' + btoa(String.fromCharCode.apply(null, assets.sfx[sound]));
                            _sfx[sound] = new Audio(dataUri)
                        } else {
                            _sfx[sound] = new Audio(assets.sfx[sound]);
                        }
                    }
                }

                // load the protracker modules
                if (assets.mods) {
                    for (let mod in assets.mods) {
                        _mods[mod] = new Modplayer();
                        _mods[mod].setrepeat(true);

                        if (assets.mods[mod] instanceof Uint8Array) {
                            _mods[mod].load(assets.mods[mod], 'mod');
                        } else {
                            _mods[mod].load(assets.mods[mod]);
                        }

                        _mods[mod].onReady = function () {
                            checkLoadingDone();
                        }
                    }
                }

                // load the Tiled maps
                if (assets.maps) {
                    for (let map in assets.maps) {
                        if (assets.maps[map] instanceof Uint8Array) {
                            const json = JSON.parse(new TextDecoder("utf-8").decode(assets.maps[map]));
                            _maps[map] = {
                                width:  json.width,
                                height: json.height,
                                data:   json.layers[0].data
                            };
                            checkLoadingDone();
                        } else {
                            window.fetch(assets.maps[map])
                            .then(response => {
                                response.json().then(json => {
                                    _maps[map] = {
                                        width:  json.width,
                                        height: json.height,
                                        data:   json.layers[0].data
                                    };
                                    checkLoadingDone();
                                });
                            });
                        }
                    }
                }

                // call checkLoadingDone even if there are no assets to load
                if (Object.keys(assets.images).length === 0
                    && Object.keys(assets.sfx).length === 0
                    && Object.keys(assets.mods).length === 0
                    && Object.keys(assets.maps).length === 0) {
                    checkLoadingDone();
                }
            });
        }

        /**
         * Set a pixel at coordinate (x, y) of the current layer to be of the
         * current color. Ignore the color "0" (transparent). Offset the pixel
         * coordinates if camera is set. Also, take into account any mask that
         * might be applied to the layer
         */
        function pset (x, y) {
            x -= _camera[0];
            y -= _camera[1];

            if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;

            try {
                x = Math.floor(x);
                y = Math.floor(y);

                const currentLayer = _layer;
                const layerMasks = _layer.masks;
                for (let m in layerMasks) {
                    layer(m);
                    if (layerMasks[m]) {
                        if (pget(x, y) !== 0) {
                            _layer = currentLayer;
                            return;
                        }
                    } else {
                        if (pget(x, y) === 0) {
                            _layer = currentLayer;
                            return;
                        }
                    }
                }
                _layer = currentLayer;

                if (_color === 0) return;
                let index = ((y * _layer.width) + x);

                _layer.data[index] = _color;
            } catch (e) {}
        }

        /**
         * Return the color of the pixel at (x, y) of the current layer
         */
        function pget (x, y) {
            try {
                x = Math.floor(x);
                y = Math.floor(y);
                let index = ((y * _layer.width) + x);

                return _layer.data[index];
            } catch (e) {}
        }

        /**
         * Set the current color to the color specified. Default is white (16)
         * @param  {Number} [c=0xF] [description]
         * @return {[type]}         [description]
         */
        function color (c = 0xF) {
            _color = c;
        }

        /**
         * Sets a color as "corizer". When it is enables, draw
         * all the images and sprites with the current color for any non-transparent
         * pixel
         */
        function colorize (c = null) {
            _colorize = c;
        }

        /**
         * Set the active layer. Defaul is the main layer (0)
         */
        function layer (l = 0) {
            _layer = _images[l];
        }

        /**
         * Create a new layer with the given name. If the width or the height are
         * not specified, create a layer as big as the default one (160 x 144)
         */
        function layern (l, w = 0, h = 0) {
            if (w === 0) w = WIDTH;
            if (h === 0) h = HEIGHT;

            _images[l] = {
                id:     l,
                data:   new Uint8Array(w * h),
                width:  w,
                height: h,
                masks:  {}
            };
        }

        /**
         * Set the width and height of each sprite of the specified layer (default to
         * the currently selected layer)
         */
        function sprset (w, h, l) {
            l = l || _layer.id;

            if (_images[l].width % w !== 0 || _images[l].height % h !== 0)
                throw "Width and height of the layer must be multiple of the sprites' width and height";

            _images[l].sprw = w;
            _images[l].sprh = h;
        }

        /**
         * Set or reset the camera. When the camera is set, all the drawing functions
         * are offset by (-x, -y)
         */
        function camera(x = 0, y = 0) {
            _camera = [x, y];
        }

        /**
         * Draw a line from (x1, y1) to (x2, y2)
         */
        function line (x1, y1, x2, y2) {
            // bresenham midpoint circle algorithm to draw a pixel-perfect line
            x1 = Math.floor(x1);
            y1 = Math.floor(y1);
            x2 = Math.floor(x2);
            y2 = Math.floor(y2);

            let dx = Math.abs(x2 - x1);
            let dy = Math.abs(y2 - y1);
            let sx = (x1 < x2) ? 1 : -1;
            let sy = (y1 < y2) ? 1 : -1;
            let err = dx - dy;

            while(true) {
                pset(x1, y1);

                if ((x1 === x2) && (y1 === y2)) break;

                let e2 = 2 * err;
                if (e2 >- dy) { err -= dy; x1  += sx; }
                if (e2 <  dx) { err += dx; y1  += sy; }
            }
        }

        /**
         * Draw a rectangle having its top.left vertex at (x, y), a width of w and
         * a d height of h
         */
        function rect (x, y, w, h) {
            // normalize input
            let x0 = Math.min(x, x + w);
            let x1 = Math.max(x, x + w);
            let y0 = Math.min(y, y + h);
            let y1 = Math.max(y, y + h);

            line(x0, y0, x1, y0);
            line(x1, y0, x1, y1);
            line(x1, y1, x0, y1);
            line(x0, y1, x0, y0);
        }

        /**
         * Like rect, but the rectangle is filled
         */
        function rectfill (x, y, w, h) {
            // normalize input
            let x0 = Math.floor(Math.min(x, x + w));
            let x1 = Math.floor(Math.max(x, x + w));
            let y0 = Math.floor(Math.min(y, y + h));
            let y1 = Math.floor(Math.max(y, y + h));

            for (let yy = y0; yy < y1; yy++) {
                for (let xx = x0; xx < x1; xx++) {
                    pset(xx, yy);
                }
            }
        }

        /**
         * Draw a circle having its center at (x, y) and a redius od rd.
         * Optionally, only draw it from angle a1 to angle a2 where a1 is the topmost
         * pixel
         */
        function circ (x, y, rd, a1 = 0, a2 = 360) {
            let xx = rd;
            let yy = 0;
            let radiusError = 1 - xx;

            function inAngle(x1, y1) {
                const deltaY = y1 - y;
                const deltaX = x1 - x;
                const angleInDegrees = (Math.atan2(deltaY, deltaX) * 180 / Math.PI) + 180;

                if (a2 > a1) {
                    return angleInDegrees >= a1 && angleInDegrees <= a2;
                } else {
                    return angleInDegrees >= a1 || angleInDegrees <= a2;
                }
            }

            if (a1 !== undefined) {
                a1 = (a1 + 90) % 360;
                a2 = (a2 + 90) % 360;
            }

            // two different paths for performace reasons
            while (xx >= yy) {
                if (a1 === undefined) {
                    pset( xx + x,  yy + y);
                    pset( yy + x,  xx + y);
                    pset(-xx + x,  yy + y);
                    pset(-yy + x,  xx + y);
                    pset(-xx + x, -yy + y);
                    pset(-yy + x, -xx + y);
                    pset( xx + x, -yy + y);
                    pset( yy + x, -xx + y);
                } else {
                    if (inAngle( xx + x,  yy + y)) pset( xx + x,  yy + y);
                    if (inAngle( yy + x,  xx + y)) pset( yy + x,  xx + y);
                    if (inAngle(-xx + x,  yy + y)) pset(-xx + x,  yy + y);
                    if (inAngle(-yy + x,  xx + y)) pset(-yy + x,  xx + y);
                    if (inAngle(-xx + x, -yy + y)) pset(-xx + x, -yy + y);
                    if (inAngle(-yy + x, -xx + y)) pset(-yy + x, -xx + y);
                    if (inAngle( xx + x, -yy + y)) pset( xx + x, -yy + y);
                    if (inAngle( yy + x, -xx + y)) pset( yy + x, -xx + y);
                }

                yy++;

                if (radiusError < 0) {
                    radiusError += 2 * yy + 1;
                }
                else {
                    xx--;
                    radiusError+= 2 * (yy - xx + 1);
                }
            }
        }

        /**
         * Like circ, but the circle is filled. Does not support drawing a partial
         * circle
         */
        function circfill (x, y, rd) {
            // bresenham midpoint circle algorithm to draw a pixel-perfect line
            let xx = rd;
            let yy = 0;
            let radiusError = 1 - xx;

            while (xx >= yy) {
                line( xx + x,  yy + y, -xx + x,  yy + y);
                line( yy + x,  xx + y, -yy + x,  xx + y);
                line(-xx + x, -yy + y,  xx + x, -yy + y);
                line(-yy + x, -xx + y,  yy + x, -xx + y);

                yy++;

                if (radiusError < 0) {
                    radiusError += 2 * yy + 1;
                }
                else {
                    xx--;
                    radiusError+= 2 * (yy - xx + 1);
                }
            }
        }

        /**
         * Draw a triangle having its vertices at (x1, x1), (x2, y2), (x3, y3)
         */
        function tri (x1, y1, x2, y2, x3, y3) {
            line(x1, y1, x2, y2);
            line(x2, y2, x3, y3);
            line(x3, y3, x1, y1);
        }

        /**
         * Like tri, but filled
         */
        function trifill (x1, y1, x2, y2, x3, y3) {
            // http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html
            // sort the points vertically
            if (y2 > y3) {
                [x2, x3] = [x3, x2];
                [y2, y3] = [y3, y2];
            }
            if (y1 > y2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            if (y2 > y3) {
                [x2, x3] = [x3, x2];
                [y2, y3] = [y3, y2];
            }

            tri(x1, y1, x2, y2, x3, y3);

            // fourth, middle vertex
            const x4 = x1 + ((y2 - y1) / (y3 - y1)) * (x3 - x1);
            const y4 = y2;

            // fillBottomFlatTriangle
            let invslope1 = (x2 - x1) / (y2 - y1);
            let invslope2 = (x4 - x1) / (y4 - y1);
            let curx1 = x1;
            let curx2 = x1;

            for (let sy = y1; sy <= y2; sy++) {
                line(curx1, sy, curx2, sy);
                curx1 += invslope1;
                curx2 += invslope2;
            }

            // fillTopFlatTriangle
            invslope1 = (x3 - x2) / (y3 - y2);
            invslope2 = (x3 - x4) / (y3 - y4);

            curx1 = x3;
            curx2 = x3;

            for (let sy = y3; sy > y2; sy--) {
              line(curx1, sy, curx2, sy);
              curx1 -= invslope1;
              curx2 -= invslope2;
            }
        }

        /**
         * Copy a portion of a layer into the current layer
         * @param  {String}  l          Layer to copy from
         * @param  {Number}  [dx=0]     Destination X coordinate
         * @param  {Number}  [dy=0]     Destination Y coordinate
         * @param  {Number}  [sx=0]     Source X coordinate
         * @param  {Number}  [sy=0]     Source Y coordinate
         * @param  {Number}  [sw=0]     Source width - 0 = all
         * @param  {Number}  [sh=0]     Source height - 0 = all
         * @param  {Number}  [dw=0]     Destination width - 0 = like source
         * @param  {Number}  [dh=0]     Destination Height - 0 = like source
         * @param  {Boolean} [fh=false] Flip horizontal
         * @param  {Boolean} [fv=false] Flip vertical
         * @param  {Number}  [a=0]      Rotation angle in degrees
         */
        function cp (l, dx = 0, dy = 0, sx = 0, sy = 0, sw = 0, sh = 0, dw = 0, dh = 0, fh = false, fv = false, a = 0) {
            let currentLayerId = _layer.id;
            let currentColor = _color;

            layer(l);

            sw = sw === 0 ? _layer.width  - sx: sw;
            sh = sh === 0 ? _layer.height - sy: sh;
            dw = dw === 0 ? sw : dw;
            dh = dh === 0 ? sh : dh;
            rw = dw / sw;
            rh = dh / sh;

            let cx = dx + (dw / 2);
            let cy = dy + (dh / 2);

            function rotate(x, y) {
                if (a === 0) return [x, y];

                const radians = (Math.PI / 180) * -a;
                const cos = Math.cos(radians)
                const sin = Math.sin(radians)
                const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
                const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
                return [nx, ny];
            }

            let step = a === 0 ? 1 : 0.5;

            for (let x = 0; x < dw; x += step) {
                for (let y = 0; y < dh; y += step) {
                    layer(l);
                    let _x = (x / rw) + sx;
                    let _y = (y / rh) + sy;

                    const pixelColor = pget(_x, _y);
                    if (_colorize !== null) {
                        if (pixelColor === 0) continue;
                        color(_colorize);
                    } else {
                        color(pixelColor);
                    }

                    [_x, _y] = rotate(x + dx, y + dy)

                    if (fh) { _x = dw  + (dx * 2) - _x - 1; }
                    if (fv) { _y = dh  + (dy * 2) - _y - 1; }

                    layer(currentLayerId);
                    pset(_x, _y);
                }
            }

            layer(currentLayerId);
            _color = currentColor

        }

        /**
         * Like cp but works with sprites
         * @param  {String}  l          Layer with the spritesheet
         * @param  {Number}  s          Index of the sprite
         * @param  {Number}  x          X position where to draw
         * @param  {Number}  y          Y position where to draw
         * @param  {Number}  [sw=1]     Number of horizontal sprites to draw
         * @param  {Number}  [sh=1]     Number of vertical sprites to draw
         * @param  {Number}  [w=0]      Width of the destination image (to scale sprites)
         * @param  {Number}  [h=0]      Height of the destination image (to scale sprites)
         * @param  {Boolean} [fh=false] Flip horizontal
         * @param  {Boolean} [fv=false] Flip vertical
         * @param  {Number}  [a=0]      Rotation angle in degrees
         */
        function sprcp(l, s, x = 0, y = 0, sw = 1, sh = 1, w = 0, h = 0, fh = false, fv = false, a = 0) {
            if (!_images[l].sprw || !_images[l].sprh)
                throw 'The selected layer is not a spritesheet';

            // ignore offscreen sprites
            if (   x - _camera[0] < 0 - _images[l].sprw || x - _camera[0] > WIDTH
                || y - _camera[1] < 0 - _images[l].sprh || y - _camera[1] > HEIGHT)
                    return

            let sprw = _images[l].sprw;
            let sprh = _images[l].sprh;
            if (!sprw) sprw = _images[l].width;
            if (!sprh) sprh = _images[l].height;

            w = w === 0 ? sprw * sw : w;
            h = h === 0 ? sprh * sh : h;

            let spritesPerRow    = _images[l].width / sprw;

            let spriteX = s % spritesPerRow;
            let spriteY = Math.floor(s / spritesPerRow);

            cp (l, x,  y, spriteX * sprw, spriteY * sprh, sprw * sw, sprh * sh, w, h, fh, fv, a);
        }

        /**
         * Print the string "text" at the coordinate (x, y) using the layer "l"
         * as font (default = system font). If colorize is enabled, the font will adhere to it.
         * The layer used as font must have been set as spritesheet and must
         * have exaclty 96 sprites (see the system font.png as an example)
         */
        function print (text, x = 0, y = 0, l = 'font') {
            text = text.toString();

            if (!_images[l].sprw || !_images[l].sprh)
                throw 'The selected layer is not a spritesheet';
            if ((_images[l].width / _images[l].sprw) * (_images[l].height / _images[l].sprh) !== 96)
                throw 'A font spritesheet must have exactly 96 sprites';

            for (var i = 0; i < text.length; i++) {
                const sprIdx = text.charCodeAt(i) - 32;
                sprcp(l, sprIdx, x + (i * _images[l].sprw), y);
            }
        }

        /**
         * Play the sound effect s
         */
        function sfx (s) {
            _sfx[s].play();
        }

        /**
         * Play the protracker module m
         */
        function play (m) {
            _mods[m].play();
        }

        /**
         * Stop playing the protraker module m
         */
        function stop (m) {
            _mods[m].stop();
        }

        /**
         * Set the volume of protracker module m at v (0-20)
         */
        function volume (m, v) {
            if (v === 0) {
                v = 0;
            } else if (v >= 1 && v <= 10) {
                v = 11 - v;
            } else if (v >= 11 && v <= 19) {
                v = (20 - v) / 10;
            } else if (v === 20) {
                v = 0.5;
            } else {
                v = 8;
            }

            _mods[m].mixval = v;
        }

        /**
         * Main display function. Plots the layer "0" to the canvas using the current
         * palette
         */
        function draw () {
            const positions = [1,  1,-1,  1,-1, -1, 1,  1,-1, -1, 1, -1];
            gl.activeTexture(gl.TEXTURE0);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, WIDTH, HEIGHT, 0, gl.ALPHA, gl.UNSIGNED_BYTE, _images[0].data);

            gl.drawArrays(gl.TRIANGLES, 0, 6); // 6 = positions length
        }

        /**
         * Fill the current layer wit color c (default is black)
         */
        function cls (c = 1) {
            _layer.data.fill(c)
        }

        /**
         * Take a screenshot of the canvas as soon as the current update function
         * finishes and call the function fn with the canvas data as data url
         */
        function sshot (fn) {
            _sshotfn = fn;
            _sshot = true;
        }

        /**
         * Load the assets, create the display canvas in container and call the
         * initFn function (if any) and 60 times a second the updateFn.
         * If dev is true, exposes all the public functions on the window object
         */
        function run (container, assets, updatefn, initfn, dev=true) {
            // if not in development mode (from a cart), load the assets used by the intro
            // screen
            if (!dev) {
                assets.sfx               = assets.sfx || {};
                assets.images            = assets.images || {};
                assets.sfx.tako80Intro   = INTRO_WAV_DATA;
                assets.images.tako80Logo = INTRO_LOGO_DATA;
            }

            init(container, assets)
            .then(function () {

                if (dev) {
                    for (let f of publicFunctions) {
                        window[f.name] = f;
                    }
                }

                _status = 'running';
                if (!updatefn) return;

                function runfn () {
                    if (_status === 'running') updatefn();

                    // if a screeshot is requested, call _sshotfn with the current
                    // canvas data
                    if (_sshot) {
                        _sshotfn(canvas.toDataURL());
                        _sshot = false;
                    }

                    // set all the buttons to 1 (they are initially set as 0). This
                    // makes it possible to call btnp (has the button been pressed
                    // in the last frame?)
                    for (let btn in _btnsp) {
                        _btnsp[btn] = 1;
                    }

                    // update the fps counter
                    _fps.fps++;
                    if ((new Date() - _fps.lastTime) >= 1000) {
                        _fps.lastTime = new Date();
                        _fps.lastFps = _fps.fps;
                        _fps.fps = 0;
                    }
                    if (_fps.running) {
                        const currentLayer = _layer;
                        const currentCamera = _camera;
                        camera(0, 0);
                        layer();
                        const layerMasks = _layer.masks;
                        mask();
                        print(_fps.lastFps, 1, 1);
                        _layer.masks = layerMasks;
                        draw();
                        _layer = currentLayer;
                        _camera = currentCamera;
                    }

                    window.requestAnimationFrame(runfn);
                }

                // if not in development mode (from a cart), play the intro screen
                // before the game
                if (!dev) {
                    sfx('tako80Intro');
                    let introFnRunning = true;
                    let takoIntroStep1 = 70;
                    let takoIntroStep2 = 71;
                    let takoIntroStep  = 1;

                    function introFn () {
                        cls();

                        cp('tako80Logo', 25, 50);

                        color(1);
                        if (takoIntroStep < 4) {
                            const stepX = takoIntroStep;
                            const stepY = takoIntroStep;
                            for (var x = 0; x < 160; x += stepX) {
                                for (var y = 0; y < 144; y += stepX) {
                                    pset(x, y)
                                }
                            }
                            takoIntroStep += 0.03;
                        }

                        color(1);
                        rectfill(0, 0, 160, takoIntroStep1);
                        rectfill(0, takoIntroStep2, 160, 144);

                        color(86);
                        line(0, takoIntroStep1, 160, takoIntroStep1);
                        line(0, takoIntroStep2, 160, takoIntroStep2);

                        takoIntroStep1 -= 0.7;
                        takoIntroStep2 += 0.7;
                        takoIntroStep  += 0.005;

                        draw();
                        if (introFnRunning) window.requestAnimationFrame(introFn);
                    }

                    introFn();
                    setTimeout(function () {
                        introFnRunning = false;
                        if (initfn) initfn();
                        runfn();
                    }, INTRO_DURATION);
                } else {
                    if (initfn) initfn();
                    runfn();
                }
            });
        }

        /**
         * Initialize the context from a cart and not from the server
         */
        function runcart (container, cart) {
            /**
             * Utility function. Looks for the index of an array within an array
             */
            function searchArray(array, searchElements, fromIndex = 0) {
                let index = Array.prototype.indexOf.call(array, searchElements[0], fromIndex);

                if(searchElements.length === 1 || index === -1) {
                    return index;
                }

                let i;
                for(i = index, j = 0; j < searchElements.length && i < array.length; i++, j++) {
                    if(array[i] !== searchElements[j]) {
                        return searchArray(array, searchElements, index + 1)
                    }
                }

                return index;
            }

            /**
             * Utility function. Like String.split but for arrays
             */
            function splitArray(array, searchElements) {
                const arr = [];
                let prevIdx = 0;
                let idx = searchArray(array, searchElements);
                while (idx !== -1) {
                    arr.push(array.subarray(prevIdx, idx));
                    prevIdx = idx + searchElements.length;
                    idx = searchArray(array, searchElements, prevIdx);
                }

                return arr;
            }


            // ignore cart if it's not an image
            if (cart.tagName === 'IMG') {
                fetch(cart.src)
                .then(response => {
                    return response.blob();
                })
                .then(cartData => {
                    // unpack the cart by reading all the various parts (code, images and so on)
                    const fileReader = new FileReader();
                    fileReader.onload = function() {
                        const data = new Uint8Array(this.result);
                        const endOfPng = [0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82];
                        const splitBuf = new TextEncoder("utf-8").encode('***TAKO80-SEPARATOR***');
                        const splitBufSub = new TextEncoder("utf-8").encode('***TAKO80-SUB-SEPARATOR***');

                        const cartDataIdx = searchArray(data, endOfPng) + endOfPng.length;
                        const cartData = data.subarray(cartDataIdx);
                        const splittedcartData = splitArray(cartData, splitBuf);

                        // code
                        const takoFunctions = []
                        let code = new TextDecoder("utf-8").decode(splittedcartData[0]);
                        const cartInitFnName = `tako80cartInit${ new Date().getTime() }`;
                        const cartUpdateFnName = `tako80cartUpdate${ new Date().getTime() }`;
                        const cartFnName = `tako80cart${ new Date().getTime() }`;
                        code = code.replace(/function\s+update\s+\(\)/, `window.${cartUpdateFnName} = function ()`);
                        code = code.replace(/function\s+init\s+\(\)/, `window.${cartInitFnName} = function ()`);
                        code = `
                            window.${ cartFnName } = function (${ publicFunctions.map(f => f.name).join(', ') }) {
                                ${code}
                            };
                        `;
                        eval(code);
                        window[cartFnName].apply(this, publicFunctions);

                        // assets
                        const assets = {
                            images: {},
                            sfx:    {},
                            mods:   {},
                            maps:   {}
                        }

                        // images
                        const imagesData = splitArray(splittedcartData[1], splitBufSub);
                        for (let imgData of imagesData) {
                            const imgName = new TextDecoder("utf-8").decode(imgData.subarray(0, 100)).trim();
                            const imageData = imgData.subarray(100);
                            assets.images[imgName] = imageData;
                        }

                        // sfx
                        const sfxData = splitArray(splittedcartData[2], splitBufSub);
                        for (let sData of sfxData) {
                            const sfxName = new TextDecoder("utf-8").decode(sData.subarray(0, 100)).trim();
                            const soundData = sData.subarray(100);
                            assets.sfx[sfxName] = soundData;
                        }

                        // mods
                        const modsData = splitArray(splittedcartData[3], splitBufSub);
                        for (let modData of modsData) {
                            const modName = new TextDecoder("utf-8").decode(modData.subarray(0, 100)).trim();
                            const moduleData = modData.subarray(100);
                            assets.mods[modName] = moduleData;
                        }

                        // maps
                        const mapsData = splitArray(splittedcartData[4], splitBufSub);
                        for (let mapData of mapsData) {
                            const mapName = new TextDecoder("utf-8").decode(mapData.subarray(0, 100)).trim();
                            const tilemapData = mapData.subarray(100);
                            assets.maps[mapName] = tilemapData;
                        }

                        const initfn = window[cartInitFnName] ? window[cartInitFnName] : function () {};
                        run(container, assets, window[cartUpdateFnName], initfn, false);
                    };
                    fileReader.readAsArrayBuffer(cartData);
                })
            }
        }

        /**
         * Pauses the execution and stops the music
         */
        function stopcart () {
            pause();
            for (m in _mods) {
                stop(m);
            }
        }

        /**
         * Enables or disables printing the current fps
         */
        function fps (f = false) {
            _fps.running = f;
        }

        /**
         * Pauses the execution of the cart. Not used
         */
        function pause(paused=true) {
            _status = paused ? 'paused' : 'running';
        }

        /**
         * Return true if the specified key is currenly bein pressed
         */
        function btn (k) {
            switch (k) {
                case 'up':    k = 'arrowup'; break;
                case 'down':  k = 'arrowdown'; break;
                case 'left':  k = 'arrowleft'; break;
                case 'right': k = 'arrowright'; break;
            }
            return _btns[k.toLowerCase()] === true;
        }

        /** Return true if the specified key has been recently pressed
         */
        function btnp (k) {
            switch (k) {
                case 'up':    k = 'arrowup'; break;
                case 'down':  k = 'arrowdown'; break;
                case 'left':  k = 'arrowleft'; break;
                case 'right': k = 'arrowright'; break;
            }
            return _btnsp[k.toLowerCase()] === 0;
        }

        /**
         * Draw a map or a portion of a map on the current layer
         * @param  {String} m      - Code of the map to draw
         * @param  {String} l      - Code of the layer to use as spritesheet to draw the map
         * @param  {Number} [x=0]  - X coordinate where to draw the map
         * @param  {Number} [y=0]  - Y coordinate where to draw the map
         * @param  {Number} [sx=0] - X coordinate of the map to start drawing from
         * @param  {Number} [sy=0] - Y coordinate of the map to start drawing from
         * @param  {Number} [sw=0] - How may horizontal tiles of the map to draw
         * @param  {Number} [sh=0] - How may vertical tiles of the map to draw
         */
        function map (m, l, x = 0, y = 0, sx = 0, sy = 0, sw = 0, sh = 0) {
            sw = sw === 0 ? _maps[m].width  : sw - sx;
            sh = sh === 0 ? _maps[m].height : sh - sy;

            for (var xx = sx; xx < sw; xx++) {
                for (var yy = sy; yy < sh; yy++) {
                    const tileIdx = ((yy * _maps[m].width) + xx);
                    if (_maps[m].data[tileIdx] === 0) continue;
                    const tile = _maps[m].data[tileIdx] - 1; // tiled is 1 based
                    const _xx = xx * _images[l].sprw + x;
                    const _yy = yy * _images[l].sprh + y;

                    sprcp(l, tile, _xx, _yy);
                }
            }
        }

        /**
         * Create a new map called m with a width of w and a height of h
         */
        function mapn (m, w, h) {
            _maps[m] = {
                width:  w,
                height: h,
                data:   new Array(w * h)
            };
            _maps[m].data.fill(0);
        }

        /**
         * Return the tile at (x, y) of the map m
         */
        function mget (m, x, y) {
            let index = ((y * _maps[m].width) + x);
            return _maps[m].data[index] - 1;
        }

        /**
         * Set the tile at (x, y) of map m to t
         */
        function mset (m, x, y, t) {
            let index = ((y * _maps[m].width) + x);
            _maps[m].data[index] = t + 1;
        }

        /**
         * Set the color c1 of the palette to the value of the color c2
         */
        function pal (c1, c2) {
            if (c1 === undefined) {
                COLORS = PALETTE.slice();
            } else {
                COLORS[c1] = COLORS[c2];
            }

            palette = new Uint8Array(COLORS.length * 4);
            makePalette();
            gl.activeTexture(gl.TEXTURE1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, COLORS.length, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);
        }

        /**
         * Apply or remove (if l is undefined) the layer l as mask to the current
         * layer. If i(nverse) is true, use all the colors !== 0 as mask
         */
        function mask (l, i = false) {
            if (l === undefined) {
                _layer.masks = {};
            } else {
                _layer.masks[l] = i
            }
        }

        /**
        * Alternative implementation of Math.sin() compatible with PICO-8's sin
        * Handle values from 0 to 1 instead of 0 to 2PI
        */
        function sin (x) {
            return Math.sin(-(x || 0) * (Math.PI * 2));
        }

        /**
        * Alternative implementation of Math.cos() compatible with PICO-8's cos
        * Handle values from 0 to 1 instead of 0 to 2PI
        */
        function cos (x) {
            return Math.cos((x || 0) * (Math.PI * 2));
        }

        /**
        * Alternative implementation of Math.atan2() compatible with PICO-8's atan2
        * Handle values from 0 to 1 instead of 0 to 2PI
        */
        function atan2 (dx, dy) {
            function angle(a) { return (((a - Math.PI) / (Math.PI * 2)) + 0.25) % 1.0; }

            return angle(Math.atan2(dy, dx));
        }

        /**
        * Return a random number between min and max (included) calculated based on
        * _rndSeed. By default, return an integer number but you can ask for a float
        */
        function rnd (min = 0, max = 1, int = true) {
            let x = Math.sin(_rndSeed++) * 10000;
            x -= Math.floor(x);
            x = (x * (max - min)) + min;
            if (int) x = Math.round(x);
            return x;
        }

        /**
        * Set the seed of calculates a new random one
        */
        function rndseed (s) {
            if (s === undefined) s = new Date().getTime();
            _rndSeed = s;
        }

        return publicFunctions.reduce((acc, f) => { acc[f.name] = f; return acc; }, {});
    }

    // Export the functions run and runcart to the window object
    window.tako80 = {
        run: function (container, assets, updatefn, initfn, dev=true) {
            const tako80env = boot();
            tako80env.run(container, assets, updatefn, initfn);
            return tako80env;
        },
        runcart: function (container, cart) {
            const tako80env = boot();
            tako80env.runcart(container, cart, tako80env);
            return tako80env;
        },
        stopcart: function (tako80env) {
            tako80env.stopcart();
            return tako80env;
        }
    };
}());
