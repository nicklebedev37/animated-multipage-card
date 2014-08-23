/*global window, io */

(function (g) {
    'use strict';

    /**
     * Constructor function for the click socket object
     * which allows to perform communication with the
     * server.
     */
    g.ClientSocket = function (id, connectcb, startcb, stopcb) {
        var socket;
        var connectCallback = connectcb;
        var startCallback = startcb;
        var stopCallback = stopcb;

        /**
         * Handles the 'connect' message.
         * Ideally there should be more sophisticted way
         * to handle the events but for simplicity purposes
         * there were done only callbacks parameters.
         */
        function handleConnect(e) {
            if (e.kind === 'connect') {
                if (connectCallback) {
                    connectCallback();
                }
                socket.emit('message', { id: id, kind: 'register' });
                return true;
            }

            return false;
        }

        /**
         * Handles the 'start' event.
         */
        function handleStart(e) {
            if (e.kind === 'start') {
                if (startCallback) {
                    startCallback(e);
                }
                return true;
            }

            return false;
        }

        /**
         * Handles the stop event.
         */
        function handleStop(e) {
            if (e.kind === 'stop') {
                if (stopCallback) {
                    stopCallback();
                }

                return true;
            }

            return false;
        }

        /**
         * Handles disconnect message.
         */
        function handleDisconnectMessage(message) {
            console.log('got disconnected: ', message);
        }

        var messageHandlers = [handleConnect, handleStart, handleStop];

        /**
         * Handles general message from the server.
         */
        function handleServerMessage(e) {
            var i;
            for (i = 0; i < messageHandlers.length; i++) {
                if (messageHandlers[i](e)) {
                    // messsage has been handled.. skipping other commands.
                    return;
                }
            }
        }

        /**
         * Performs connecting client and server.
         * Returns tne socket object which can receive events
         * from server and send event to server.
         */
        function connect(handleCallback, disconnectCallback) {
            var hostname = window.document.location.hostname;
            var port = window.document.location.port;
            var url = 'http://' + hostname + ':' + port;

            var endpoint = io.connect(url, { 'force new connection': true });

            endpoint.on('message', handleCallback);

            if (handleCallback) {
                endpoint.on('connect', function () {
                    handleCallback({ kind: 'connect' });
                });
            }

            if (disconnectCallback) {
                endpoint.on('disconnect', function () {
                    disconnectCallback({ kind: 'disconnect' });
                });
            }

            return endpoint;
        }

        /**
         * [Public method] Starts the dialog between the client and server.
         */
        this.start = function () {
            socket.emit('message', { id: id, kind: 'start' });
        };

        /**
         * [Public method] Stops the dialog between the client and server.
         */
        this.stop = function () {
            socket.emit('message', { id: id, kind: 'start' });
        };

        /**
         * [Public method] Notifies server that the client completed the operation.
         */
        this.done = function (mode) {
            socket.emit('message', {
                id: id,
                kind: 'done',
                mode: mode,
            });
        };

        socket = connect(handleServerMessage, handleDisconnectMessage);
    };
}(window));

