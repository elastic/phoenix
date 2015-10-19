define(function (require) {
  var d3 = require('d3');
  var d3Components = require('d3_components');
  var path = d3Components.element.path;
  var textElement = d3Components.element.text;
  var events = d3Components.control.events;
  var valuator = d3Components.helpers.valuator;

  return function pieChart() {
    var width = 300;
    var height = 300;
    var color = d3.scale.category10();
    var outerRadius = null;
    var innerRadius = 0;
    var sort = null;
    var value = function (d) { return d.x; };
    var label = function (d) { return d.name; };

    var pieClass = 'pie';
    var fill = function (d, i) {
      return color(label.call(this, d.data, i));
    };
    var stroke = '#ffffff';

    // Text options
    var text = {
      fill: '#ffffff',
      dy: '.35em',
      anchor: 'middle',
      transform: null
    };

    var listeners = {};

    function chart (selection) {
      selection.each(function (data, index) {
        var pie = d3.layout.pie()
          .sort(sort)
          .value(value);

        data = pie(data).map(function (d) {
          return [d];
        });

        var radius = Math.min(width, height) / 2;

        var svgEvents = events().listeners(listeners);

        var svg = d3.select(this).append('svg')
          .attr('width', width)
          .attr('height', height)
          .call(svgEvents);

        var g = svg.append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var arc = d3.svg.arc()
          .outerRadius(outerRadius || radius)
          .innerRadius(innerRadius);

        var piePath = path()
          .pathGenerator(arc)
          .class(pieClass)
          .fill(fill)
          .stroke(stroke);

        var pieText = textElement()
          .transform(text.transform || function (d) {
            return 'translate(' + arc.centroid(d) + ')';
          })
          .dy(text.dy)
          .anchor(text.anchor)
          .fill(text.fill)
          .text(function (d, i) {
            return label.call(this, d.data, i);
          });

        g.selectAll('groups')
          .data(data)
          .enter().append('g')
          .call(piePath)
          .call(pieText);
      });
    }

    // Public API
    chart.width = function (_) {
      if (!arguments.length) { return width; }
      width = _;
      return chart;
    };

    chart.height = function (_) {
      if (!arguments.length) { return height; }
      height = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) { return color; }
      color = _;
      return chart;
    };

    chart.outerRadius = function (_) {
      if (!arguments.length) { return outerRadius; }
      outerRadius = _;
      return chart;
    };

    chart.innerRadius = function (_) {
      if (!arguments.length) { return innerRadius; }
      innerRadius = _;
      return chart;
    };

    chart.sort = function (_) {
      if (!arguments.length) { return sort; }
      sort = _;
      return chart;
    };

    chart.value = function (_) {
      if (!arguments.length) { return value; }
      value = valuator(_);
      return chart;
    };

    chart.label = function (_) {
      if (!arguments.length) { return label; }
      label = valuator(_);
      return chart;
    };

    chart.class = function (_) {
      if (!arguments.length) { return pieClass; }
      pieClass = _;
      return chart;
    };

    chart.fill = function (_) {
      if (!arguments.length) { return fill; }
      fill = _;
      return chart;
    };

    chart.stroke = function (_) {
      if (!arguments.length) { return stroke; }
      stroke = _;
      return chart;
    };

    chart.text = function (_) {
      if (!arguments.length) { return text; }
      text.fill = typeof _.fill !== 'undefined' ? _.fill : text.fill;
      text.anchor = typeof _.anchor !== 'undefined' ? _.anchor: text.anchor;
      text.dy = typeof _.dy !== 'undefined' ? _.dy : text.dy;
      text.transform = typeof _.transform !== 'undefined' ? _.transform : text.transform;
      return chart;
    };

    chart.listeners = function (_) {
      if (!arguments.length) { return listeners; }
      listeners = typeof _ !== 'object' ? listeners : _;
      return chart;
    };

    return chart;
  };
});