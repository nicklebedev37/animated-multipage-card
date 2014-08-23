(function () {
    'use strict';

    var http = require('http'),
        url = require('url'),
        path = require('path'),
        fs = require('fs'),
        io = require('socket.io');

    var mimeTypes = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "css": "text/css"
    };

    /**
     * There are two types of components in this app:
     * - server, it is current node.js script which is responsible
     *   for tying up all other endpoints.
     * - client, the page that will render card animation.
     * - host, the page that will manage the process of the animation
     *   (start/stop)
     */
    var host;
    var clients = [];
    var textmoveIndex = 0;
    var santaIndex = 0;

    /**
     * Handles incoming http requests and fills the
     * response object with appropriate http response.
     */
    function handleRequest(request, response) {
        var uri = url.parse(request.url).pathname;
        var filename = path.join(process.cwd(), uri);

        fs.exists(filename, function (exists) {
            if (!exists) {
                console.log("not exists: " + filename);
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('404 Not Found\n');
                response.end();
                return;
            }

            var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
            response.writeHead(200, {'Content-Type': mimeType});

            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(response);
        });
    }

    /**
     * Makes the next client start the running line.
     */
    function stepForwardTextmove() {
        if (textmoveIndex < clients.length) {
            clients[textmoveIndex++].emit('message', {
                kind: 'start',
                mode: 'textmove',
            });
        }
    }

    /**
     * Makes the next client start the animate image.
     */
    function stepForwardSanta() {
        if (santaIndex < clients.length) {
            clients[santaIndex++].emit('message', {
                kind: 'start',
                mode: 'santa',
            });
        }
    }

    /**
     * Handles socket.io message from the client.
     * The first parameter is the socket which is responsible for
     * communicated with the client that sent a message. The second
     * is the event object which carries the message.
     */
    function handleClientMessage(socket, e) {
        if (e.kind === 'register') {
            clients.push(socket);
        } else if (e.kind === 'done') {
            if (e.mode === 'textmove') {
                stepForwardTextmove();
            }

            if (e.mode === 'santa') {
                stepForwardSanta();
            }
        }
    }

    /**
     * Handles message from the host page.
     */
    function handleHostMessage(socket, e) {
        if (e.kind === 'register') {
            host = socket;
        } else if (e.kind === 'start') {
            console.log('host triggered start');
            stepForwardTextmove();
            stepForwardSanta();
        } else if (e.kind === 'stop') {
            console.log('host triggered stop');

            var i;
            for (i = 0; i < clients.length; i++) {
                clients[i].emit('message', { kind: 'stop' });
            }
        }
    }

    /**
     * Handles disconnect message from the client or host.
     */
    function handleDisconnect(socket) {
        if (socket === host) {
            host = null;
        } else {
            var i;
            for (i = clients.length - 1; i >= 0; i++) {
                if (socket === clients[i]) {
                    clients.slice(i, 1);
                }
            }
        }
    }

    var server = http.createServer(handleRequest);

    server.listen(8888);
    io = io.listen(server);

    io.sockets.on('connection', function (socket) {
        socket.on('disconnect', function () {
            handleDisconnect(socket);
        });

        socket.on('message', function (e) {
            console.log('messsage from <', e.id, '> with kind <', e.kind, '>');

            if (e.id === 0) {
                handleHostMessage(socket, e);
            } else {
                handleClientMessage(socket, e);
            }
        });
    });
}());