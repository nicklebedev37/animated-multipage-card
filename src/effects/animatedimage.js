/*global window */

(function (g) {
    'use strict';

    /**
     * The ctor.
     */
    function animatedImage() {
        var santax;
        var santay;
        var socket;
        var canvasWidth;
        var santaSpeed;
        var santaStepDone;
        var santaStepDoneMessageSent;

        /**
         * Starts the animated image.
         */
        this.start = function (socketInput, canvasWidthInput, ycoord) {
            santax = -72;
            santay = ycoord;
            santaSpeed = 1;
            santaStepDone = false;
            santaStepDoneMessageSent = false;

            socket = socketInput;
            canvasWidth = canvasWidthInput;
        };

        /**
         * Moves one step further the animated image.
         */
        this.takeStep = function () {
            if (santaStepDone) {
                return;
            }

            if (!santaStepDoneMessageSent && santax + 72 >= canvasWidth) {
                santaStepDoneMessageSent = true;
                socket.done('santa', santay);
            }

            if (santax >= canvasWidth) {
                santaStepDone = true;
                $('#santa').css('display', 'none');
                console.log('done - santa');
                return;
            }


            if ($('#santa').css('display') === 'none') {
                $('#santa').css('display', 'inline');
            }

            santax += santaSpeed;
            santay += 0.1;

            $('#santa').css('top', santay + 'px');
            $('#santa').css('left', santax + 'px');
        };
    }

    g.AnimatedImage = animatedImage;
}(window));
