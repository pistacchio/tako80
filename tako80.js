#!/usr/bin/env node

const fs      = require('fs');
const ncp     = require('ncp');
const path    = require('path');
const http    = require('http');
const static  = require('node-static');
const png     = require('pngjs').PNG;

const PROJECT_TEMPLATE_DIR = 'project-template';
const PROJECT_EXAMPLE_DIR  = 'example';
const CART_TEMPLATE        = 'cart.png';
const TAKO_MAIN_FILE       = 'tako80.min.js';

const LABEL_WIDTH  = 100;
const LABEL_HEIGHT = 80;

function printHelp () {
    console.log('Usage:');
    console.log('\ttako80 new PROJECT_NAME');
    console.log('\ttako80 devel');
    console.log('\ttako80 compile');
    console.log('\ttako80 example');
    process.exit(0);
}

if (process.argv.length <= 2) {
    printHelp();
}

if (process.argv[2] === 'new') {
    if (process.argv.length === 3) {
        console.log('Usage: tako80 new PROJECT_NAME');
        process.exit(0);
    }

    const projectName = process.argv[3];

    ncp(path.join(__dirname, PROJECT_TEMPLATE_DIR), projectName);
    ncp(path.join(__dirname, TAKO_MAIN_FILE), path.join(projectName, TAKO_MAIN_FILE));
}

if (process.argv[2] === 'example') {
    ncp(path.join(__dirname, PROJECT_TEMPLATE_DIR), 'tako80example', () => {
        ncp(path.join(__dirname, PROJECT_EXAMPLE_DIR), 'tako80example');
    });
    ncp(path.join(__dirname, TAKO_MAIN_FILE), path.join('tako80example', TAKO_MAIN_FILE));
}

if (process.argv[2] === 'devel') {
    // TODO: check if it doesn't seem like a tako80 project directory
    // if (process.argv.length === 3) {
    //     console.log('Usage: tako80 new PROJECT_NAME');
    //     process.exit(0);
    // }

    const file = new static.Server('.');
    const server = http.createServer(function (req, res) {
        if (req.url === '/') {
            let htmlFile = fs.readFileSync('index.html').toString();
            const assets = fs.readFileSync('assets.json').toString();

            try {
                JSON.parse(assets);
            } catch (e) {
                console.log('Invalid asset file');
            }

            htmlFile = htmlFile.replace('ASSETS_JSON', assets);

            res.writeHead(200, {'Content-Type': 'text/html'});

            res.end(htmlFile);
        } else if (req.url === '/compile') {
            console.log('Compiled cart');
            compile();
        } else {
            file.serve(req, res);
        }
    });

    server.listen(3000, '127.0.0.1');

    console.log('Tako 80 dev server running at http://127.0.0.1:3000/');
}

if (process.argv[2] === 'compile') {
    compile();
}

function compile () {
    const data = []
    const separatorBuffer = Buffer.from('***TAKO80-SEPARATOR***');
    const separatorBufferSub = Buffer.from('***TAKO80-SUB-SEPARATOR***');

    if (fs.existsSync('dist/cart.png')) {
        fs.unlinkSync('dist/cart.png');
    }

    function packCart () {
        data.push(fs.readFileSync('dist/cart.png'));

        let cartData = fs.readFileSync('cart.js');
        data.push(cartData);
        data.push(separatorBuffer);

        const assets = JSON.parse(fs.readFileSync('assets.json'));

        for (let img in assets.images) {
            let imgData = new Buffer(img.padEnd(100))
            imgData = Buffer.concat([imgData, fs.readFileSync(assets.images[img])]);

            data.push(imgData);
            data.push(separatorBufferSub);
        }
        data.push(separatorBuffer);

        for (let sfx in assets.sfx || {}) {
            let sfxData = new Buffer(sfx.padEnd(100))
            sfxData = Buffer.concat([sfxData, fs.readFileSync(assets.sfx[sfx])]);
            data.push(sfxData);
            data.push(separatorBufferSub);
        }
        data.push(separatorBuffer);

        for (let mod in assets.mods || {}) {
            let modData = new Buffer(mod.padEnd(100))
            modData = Buffer.concat([modData, fs.readFileSync(assets.mods[mod])]);
            data.push(modData);
            data.push(separatorBufferSub);
        }
        data.push(separatorBuffer);

        for (let map in assets.maps || {}) {
            let mapData = new Buffer(map.padEnd(100))
            mapData = Buffer.concat([mapData, fs.readFileSync(assets.maps[map])]);
            data.push(mapData);
            data.push(separatorBufferSub);
        }
        data.push(separatorBuffer);

        fs.writeFileSync('dist/cart.png', Buffer.concat(data));

        ncp(path.join(__dirname, TAKO_MAIN_FILE), path.join('dist/', TAKO_MAIN_FILE));
    }

    ncp(path.join(__dirname, 'src', CART_TEMPLATE), 'dist/cart.png', (err) => {
        // label
        if (fs.existsSync('label.png')) {
            const cartData = fs.readFileSync('dist/cart.png');
            const labelData = fs.readFileSync('label.png');

            new png({filterType: 4}).parse(cartData)
            .on('parsed', function () {
                const cart = this;

                new png({filterType: 4}).parse(labelData)
                .on('parsed', function () {
                    const label = this;

                    if (label.width !== LABEL_WIDTH || label.height !== LABEL_HEIGHT) {
                        console.log(`Label found, but the size is wrong. It must be ${ LABEL_WIDTH } x ${ LABEL_HEIGHT }`);
                        process.exit(0);
                    }

                    for (let y = 0; y < label.height; y++) {
                        for (let x = 0; x < label.width; x++) {
                            const labelIdx = (label.width * y + x) << 2;
                            const cartX = x + 23;
                            const cartY = y + 28;
                            const cartIdx = (cart.width * cartY + cartX) << 2;

                            // invert color
                            cart.data[cartIdx]   = label.data[labelIdx];
                            cart.data[cartIdx+1] = label.data[labelIdx+1];
                            cart.data[cartIdx+2] = label.data[labelIdx+2];
                            cart.data[cartIdx+3] = label.data[labelIdx+3];
                        }
                    }

                    const ws = fs.createWriteStream('dist/cart.png');
                    ws.on('finish', packCart);
                    cart.pack().pipe(ws);
                });
            });
        } else {
            packCart();
        }
    });
}

if (['new', 'compile', 'devel', 'example'].indexOf(process.argv[2]) === -1) {
    printHelp();
}
