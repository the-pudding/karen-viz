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
    const decFormat = d3.format('.2f');
    const yearFormat = d3.format('.0f');

    // dimensions
    let width = 0;
    let height = 0;
    const TEXT_HEIGHT = 100;
    const MARGIN_TOP = 0;
    const MARGIN_BOTTOM = 15;
    const MARGIN_LEFT = 35;
    const MARGIN_RIGHT = 0;

    // scales
    const scaleX = d3.scaleLinear();
    const scaleY = d3.scaleLinear();
    const MAX_PROP = 0.06;

    // axes
    let axisX = null;
    let axisY = null;

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

    function updateChartDetails() {
      $chart.select('.chart-name').text(data.key);
      $chart
        .select('.chart-sub')
        .html(`<span class='corr'>${data.corr}</span> correlation`);
    }

    const Chart = {
      // called once at start
      init() {
        // add specific name data
        $chart.append('p').attr('class', 'chart-name');
        $chart.append('p').attr('class', 'chart-sub');

        // add an SVG
        $svg = $chart.append('svg').attr('class', 'chart-line');

        // create axis
        $axis = $svg.append('g').attr('class', 'g-axis');
        $axis.append('g').attr('class', 'axis-x');
        $axis.append('g').attr('class', 'axis-y');

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
        scaleX.domain([1918, 2018]).range([0, width - MARGIN_LEFT]);
        scaleY.domain([0, MAX_PROP]).range([height - MARGIN_BOTTOM, 0]);

        // setup axes
        axisX = d3.axisBottom(scaleX).ticks(2);

        axisY = d3.axisLeft(scaleY).ticks(2);

        // define line attributes
        line.x((d) => scaleX(d.year)).y((d) => scaleY(d.prop));
        return Chart;
      },
      // update scales and render chart
      render() {
        updateChartDetails();
        // offset chart for margins
        $vis.attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);

        // add Karen line
        $vis
          .selectAll('.line-karen')
          .data([data.karen], () => data.key)
          .join((enter) =>
            enter.append('path').attr('class', 'line-karen').attr('d', line)
          );

        $vis
          .selectAll('.line')
          .data([data.values], () => data.key)
          .join((enter) =>
            enter.append('path').attr('class', 'line').attr('d', line)
          )
          .attr('stroke', 'url(#linear-gradient)');

        $axis
          .select('.axis-x')
          .call(
            d3
              .axisBottom(scaleX)
              .tickSize(0)
              .ticks(2)
              .tickValues([1918, 2018])
              .tickFormat(yearFormat)
          )
          .attr(
            'transform',
            `translate(${MARGIN_LEFT}, ${height - MARGIN_BOTTOM})`
          )
          // remove the X axis line
          .call((g) => g.select('.domain').remove())
          // move text slightly
          .call((g) =>
            g
              .selectAll('.tick text')
              .attr('y', 8)
              .style('text-anchor', function (d) {
                return this.parentNode.nextSibling ? 'start' : 'end';
              })
          );
        $axis
          .select('.axis-y')
          .call(
            d3
              .axisLeft(scaleY)
              .tickValues([0, 0.02, 0.04])
              .tickSize(-width + MARGIN_LEFT)
              .tickFormat((d, i) => {
                if (i === 0) return 0;
                return decFormat(d);
              })
          )
          .attr('transform', `translate(${MARGIN_LEFT}, 0)`)
          // remove the y axis line
          .call((g) => g.select('.domain').remove())
          .call((g) => g.selectAll('.tick text').attr('x', -8));

        return Chart;
      },
      // get / set data
      data(val) {
        if (!arguments.length) return data;
        data = val;
        $chart.datum(data);
        console.log(data);
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
