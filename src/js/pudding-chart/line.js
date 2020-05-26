/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.karenLine = function init(options) {
  function createChart(el) {
    // dom elements
    const $chart = d3.select(el);
    let $svg = null;
    let $axis = null;
    let $vis = null;

    // data
    let data = $chart.datum();
    console.log({ data });

    // dimensions
    let width = 0;
    let height = 0;
    const TEXT_HEIGHT = 100;
    const MARGIN_TOP = 0;
    const MARGIN_BOTTOM = 0;
    const MARGIN_LEFT = 0;
    const MARGIN_RIGHT = 0;

    // scales
    const scaleX = d3.scaleLinear();
    const scaleY = d3.scaleLinear();
    const MAX_PROP = 0.06;

    // shapes
    const line = d3.line();

    // colors
    let linearGradient = null;
    const TOP_COLOR = '#B89CF4';
    const BOTTOM_COLOR = '#F93A5B';

    // helper functions

    function setupGradient() {
      const defs = $svg.append('defs');

      linearGradient = defs
        .append('linearGradient')
        .attr('id', 'linear-gradient');

      linearGradient
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      // set the color for the start
      linearGradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', TOP_COLOR);

      linearGradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', BOTTOM_COLOR);
    }

    const Chart = {
      // called once at start
      init() {
        // add specific name data
        $chart.append('p').attr('class', 'chart-name').text(data.key);
        $chart
          .append('p')
          .attr('class', 'chart-sub')
          .html(`<span class='corr'>${data.corr}</span> correlation`);

        // add an SVG
        $svg = $chart.append('svg').attr('class', 'chart-line');

        // create axis
        $axis = $svg.append('g').attr('class', 'g-axis');

        // setup viz group
        $vis = $svg.append('g').attr('class', 'g-vis');

        setupGradient();
      },
      // on resize, update new dimensions
      resize() {
        // defaults to grabbing dimensions from container element
        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height =
          $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM - TEXT_HEIGHT;
        $svg
          .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);

        // define specifics for x and y scales
        scaleX.domain([1918, 2018]).range([0, width]);
        scaleY.domain([0, MAX_PROP]).range([height, 0]);

        // define line attributes
        line.x((d) => scaleX(d.year)).y((d) => scaleY(d.prop));
        return Chart;
      },
      // update scales and render chart
      render() {
        // offset chart for margins
        $vis.attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);
        console.log({ val: data.values });

        $vis
          .selectAll('.line')
          .data([data.values])
          .join((enter) => enter.append('path').attr('class', 'line'))
          .attr('d', line)
          .attr('stroke', 'url(#linear-gradient)');
        return Chart;
      },
      // get / set data
      data(val) {
        if (!arguments.length) return data;
        data = val;
        $chart.datum(data);
        return Chart;
      },
    };
    Chart.init();

    return Chart;
  }

  // create charts
  const charts = this.nodes().map(createChart);
  return charts.length > 1 ? charts : charts.pop();
};
