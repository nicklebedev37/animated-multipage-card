/*global window, RunningLine, Snowflakes, AnimatedImage, ClientSocket */

(function () {
    'use strict';

    var context;
    var socket;
    var canvasHeight = 0;
    var canvasWidth = 0;
    var congratsText = "Happy Holidays";

    var runningLine;
    var snowflakes;
    var animatedImage;

    /**
     * Handles connect event.
     */
    function onConnect() {
        console.log('connect');
        $('#btnConnect').hide();

        snowflakes = new Snowflakes();
        snowflakes.start(context, canvasWidth, canvasHeight);

        setInterval(function () {
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            if (runningLine) {
                runningLine.takeStep();
            }

            if (animatedImage) {
                animatedImage.takeStep();
            }

            if (snowflakes) {
                snowflakes.takeStep();
            }
        }, 10);
    }

    /**
     * Handles start event.
     */
    function onStart(message) {
        console.log('start');

        if (message.mode === 'textmove') {
            runningLine = new RunningLine();
            runningLine.start(congratsText, context, socket, canvasWidth, canvasHeight);
        } else if (message.mode === 'santa') {
            // todo: specify y coord.
            animatedImage = new AnimatedImage();
            animatedImage.start(socket, canvasWidth, 0);
        }
    }

    /**
     * Handles stop event.
     */
    function onStop() {
        console.log('stop');
    }

    /**
     * Initialization logic.
     */
    $(function () {
        $('#mycanvas').attr('height',  $(window).height());
        $('#mycanvas').attr('width', $(window).width());

        context = $('#mycanvas')[0].getContext('2d');
        canvasHeight = $('#mycanvas').attr('height');
        canvasWidth = $('#mycanvas').attr('width');

        $('#btnConnect').on("click", function () {
            $(this).prop('disabled', true);
            socket = new ClientSocket(1, onConnect, onStart, onStop);
        });
    });
}());