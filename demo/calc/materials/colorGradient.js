/*
  Example input:
  
  spec = {
      0: 0xff00dd, (or a CALC.Color-object)
      1: 0x00ff00dd (or a CALC.Color-object)
  }
*/


(CALC.ColorGradient = function (spec) {
    var colors = [];
    var length = 0;

    // TODO: handle mode
    delete spec.mode;

    Object.keys(spec).forEach(function (k) {
        var v = spec[k],
        color = v instanceof CALC.Color ? v : new CALC.Color(v);
        colors.push([k, color]);
        length ++;
    });

    colors.sort(function (a, b) {
        return a[0] - b[0];
    });

    this.getColor = function(i) {
        return colors[i][1];
    };


    this.getPosition = function(i) {
        return colors[i][0];
    };
    
    this.count = function () {
        return length;
    };

    this.forEachColor = function(fn) {
        Object.keys(colors).forEach(function(c) {
            var v = colors[c];
            fn(v[0], v[1]);
        });
    };

});
