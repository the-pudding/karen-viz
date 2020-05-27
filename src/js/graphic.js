/* global d3 */
import './pudding-chart/line';
import parallax from './parallax';

// selections
const $containers = d3.selectAll('.charts');
const charts = [];
const $future = d3.select('.future');
const $futureContainers = $future.selectAll('.charts');
const $dropdowns = $future.selectAll('select');

// data
let annual = null;
let corr = null;
let karen = null;

const cutoff = 0.7;

function filterData(gender, time) {
  const current = time === 'current';
  // first, find matches for the time frame & time frame

  // figure out what year we're dealing with if we're talking future Karen
  const futureCol = `corKaren${time}`;

  const filteredCorr = corr
    .filter((d) => d.gender === gender)
    .filter((d) => (current ? d.corKaren > cutoff : d[futureCol] > cutoff))
    // return names and correlation for this chart
    .map((d) => {
      const thisCorr = current ? d.corKaren : d[futureCol];
      return [d.name, thisCorr];
    });

  // create lookup map to find correlation by name
  const corrMap = new Map(filteredCorr);

  const justNames = filteredCorr.map((d) => d[0]);

  // then filter our annual data to just include the appropriate names
  const filteredNames = annual.filter((d) => justNames.includes(d.name));

  // nest the data so we can make one chart per name
  const nestedNames = d3
    .nest()
    .key((d) => d.name)
    .entries(filteredNames)
    // add the correlation number back in & karen data
    .map((d) => {
      const added = {
        ...d,
        corr: corrMap.get(d.key),
        karen,
      };

      return added;
    });

  return nestedNames;
}

function handleDropdown() {
  const val = d3.select(this).property('value');
  console.log(val)

  $futureContainers.each(function (d, i) {
    const $sel = d3.select(this);
    const chartGender = $sel.attr('data-gender');
    const filtered = filterData(chartGender, val)
      .sort((a, b) => d3.descending(a.corr, b.corr))
      .slice(0, 10);

    $sel.selectAll('.chart__line').remove();

    const theseCharts = $sel
      .selectAll('.chart__line')
      .data(filtered)
      .join((enter) => enter.append('div').attr('class', 'chart__line'))
      .karenLine();

    theseCharts.forEach((chart) => chart.resize().render());

    // change both dropdowns to match
    $dropdowns.selectAll('option').property('selected', (d) => d === +val);

    // change spans in table to match
    d3.selectAll('.year-change').text(val)
  });
}

function setupChart() {
  const $sel = d3.select(this);
  const chartGender = $sel.attr('data-gender');
  const chartTime = $sel.attr('data-time');

  const passYear = chartTime === 'current' ? 'current' : '10';

  // filter specific data for this section and sort by decreasing correlation
  const filtered = filterData(chartGender, passYear).sort((a, b) =>
    d3.descending(a.corr, b.corr)
  );

  const theseCharts = $sel
    .selectAll('.chart__line')
    .data(filtered)
    .join((enter) => enter.append('div').attr('class', 'chart__line'))
    .karenLine();

  theseCharts.forEach((chart) => chart.resize().render());

  const id = `${chartGender}-${chartTime}`;

  charts.push([theseCharts]);
}

function resize() {}

function setupDropdowns() {
  const years = [10, 20, 30];

  $dropdowns
    .selectAll('option')
    .data(years)
    .join((enter) =>
      enter
        .append('option')
        .text((d) => `${d} years`)
        .attr('value', (d) => d)
    );
  $dropdowns.on('change', handleDropdown);
}

function init(data) {
  [annual, corr, karen] = data;
  $containers.each(setupChart);
  setupDropdowns();
  parallax.init();
}

export default { init, resize };
