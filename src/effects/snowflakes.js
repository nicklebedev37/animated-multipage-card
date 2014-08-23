/*global window */

(function (g) {
    'use strict';

    /**
     * The ctor.
     */
    function snowflakes() {
        var angle;
        var snowflakesArray;
        var snowflakesNumber;
        var context;
        var canvasWidth;
        var canvasHeight;

        /**
         * Starts the snowflakes.
         */
        this.start = function (contextInput, canvasWidthInput, canvasHeightInput) {
            context = contextInput;
            context.fillStyle = "rgba(255, 255, 255, 0.8)";
            canvasWidth = canvasWidthInput;
            canvasHeight = canvasHeightInput;

            angle = 0;
            snowflakesNumber = 200;
            snowflakesArray = [];

            var i;
            for (i = 0; i < snowflakesNumber; i++) {
                snowflakesArray.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    radius: Math.random() * 4 + 1,
                });
            }
        };

        /**
         * Moves the snowflakes one step further.
         */
        this.takeStep = function () {
            context.beginPath();
            var i, p;
            for (i = 0; i < snowflakesNumber; i++) {
                p = snowflakesArray[i];
                context.moveTo(p.x, p.y);
                context.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
            }
            context.fill();

            for (i = 0; i < snowflakesNumber; i++) {
                p = snowflakesArray[i];

                p.y += Math.random();
                p.x += Math.random();

                if (p.x > canvasWidth + 5 || p.y > canvasHeight) {
                    snowflakesArray[i] = {
                        x: Math.random() * canvasWidth,
                        y: Math.random() * canvasHeight,
                        radius: p.radius
                    };
                }
            }
        };
    }

    g.Snowflakes = snowflakes;
}(window));