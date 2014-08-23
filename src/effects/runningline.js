/*global window,  */

(function (g) {
    'use strict';

    /**
     * The ctor.
     */
    function runningLine() {
        var text;
        var textWidth;
        var textSpeed;
        var socket;
        var context;
        var canvasWidth;
        var canvasHeight;
        var moveStepDone;
        var moveStepDoneMessageSent;
        var xcoord;

        /**
         * Starts the running line.
         */
        this.start = function (lineText, contextInput, socketInput, canvasWidthInput, canvasHeightInput) {
            context = contextInput;
            context.font = "50pt Georgia";
            context.fillStyle = "rgba(255, 255, 255, 0.8)";

            text = lineText;
            textWidth = context.measureText(text).width;
            textSpeed = 1;
            moveStepDone = false;
            xcoord = -textWidth;

            socket = socketInput;

            canvasWidth = canvasWidthInput;
            canvasHeight = canvasHeightInput;

            moveStepDone = false;
            moveStepDoneMessageSent = false;
        };

        /**
         * Moves one step further the running line.
         */
        this.takeStep = function () {
            if (moveStepDone) {
                return;
            }

            if (!moveStepDoneMessageSent && xcoord + textWidth >= canvasWidth) {
                moveStepDoneMessageSent = true;
                socket.done('textmove');
            }

            if (xcoord >= canvasWidth) {
                moveStepDone = true;
                console.log('runningline: done');
            }

            context.fillText(text, xcoord, canvasHeight / 2);
            xcoord += textSpeed;
        };
    }

    g.RunningLine = runningLine;
}(window));