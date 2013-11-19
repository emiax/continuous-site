'use strict';
/*global CALC */

(CALC.Animation = function (spec) {
    var scope = this,
        scheduler = CALC.scheduler;
    
    if (spec.milliseconds !== undefined) {
        this.duration = spec.milliseconds;
        this.unit = "milliseconds";
        this.endTime = this.startTime = 0;
    } else {
        this.duration = spec.frames || 60;
        this.unit = "frames";
        this.startTime = this.endTime = 0;
    }

    this.interpolation = spec.interpolation || CALC.interpolations.linear;

    /* functions to perform in the beginning, during every step and in the end of the animation */
    this.begin = spec.begin;
    this.step = spec.step;
    this.end = spec.end || function() {};

    this.active = false;

}).extend({
    
    proceed: function() {
        var t,
            scope = this,
            scheduler = CALC.scheduler;

        if (!this.active) {
            return;
        }

        if (scope.unit === "milliseconds") {
            t = (scheduler.millisecond() - this.startTime)/(this.endTime - this.startTime);
        } else {
            t = (scheduler.frame() - this.startTime)/(this.endTime - this.startTime);
        }
        
        this.makeFrame(t);

        if (t < 1) {
            scheduler.attach(function() {
                scope.proceed();
            }, 0);
        } else {
            this.active = false;
            this.end();
        }
    },
    
    makeFrame: function (t) {
        var x;

        if (t > 1) t = 1;
        if (t < 0) t = 0;

        x = this.interpolation(t);
        
        this.step(x);
    },

    start: function() {
        var scope = this, 
            scheduler = CALC.scheduler;

        this.active = true;
        
        if (this.unit === 'milliseconds') {
            this.startTime = scheduler.millisecond();
        } else {
            this.startTime = scheduler.frame();
        }

        this.endTime = this.startTime + this.duration;
        
        this.begin();
        scheduler.attach(function() {
            scope.proceed();
        }, 0);
    },


    abort: function() {
        this.active = false;
    },


    skip: function(skipEnd) {
        this.makeFrame(1);
        this.abort();
    },

    revert: function() {
        this.makeFrame(0);
        this.abort();
    }


});
