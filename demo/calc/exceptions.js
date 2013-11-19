'use strict';

/*global CALC */

CALC.Exception = function (message) {
	this.name = "Unexpected Exception";
	this.message = "Sorry!";
};


CALC.InvalidArgumentException = function (message) {
	this.name = "Invalid argument";
	this.message = "Invalid argument: " + message;
};

CALC.NotImplementedYetException = function () {
	this.name = "Not implemented yet";
	this.message = "This feature it not yet implemented";
};

CALC.AbstractCallException = function () {
	this.name = "Abstract method call";
	this.message = "The method is abstract";
};