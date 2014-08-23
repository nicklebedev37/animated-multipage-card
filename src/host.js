/*global ClientSocket */

(function () {
    'use strict';

    /**
     * An id which identifies the host at the server.
     */
    var hostId = 0;

    /**
     * Handles connect event.
     */
    function onConnect() {
        console.log('connected');
        $('#start').prop('disabled', false);
    }

    /**
     * Handles start event.
     */
    function onStart() {
        console.log('started');
    }

    /**
     * Handles stop event.
     */
    function onStop() {
        console.log('stopped');
    }

    /**
     * Initialization logic. Happens when document is initialized.
     */
    $(function () {
        $('#start').prop('disabled', true);
        $('#stop').prop('disabled', true);

        var socket = new ClientSocket(hostId, onConnect, onStart, onStop);

        $('#start').click(function () {
            socket.start();
            $('#start').prop('disabled', true);
            $('#stop').prop('disabled', false);
        });

        $('#stop').click(function () {
            socket.stop();
            $('#start').prop('disabled', false);
            $('#stop').prop('disabled', true);
        });
    });
}());
