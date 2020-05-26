/* global d3 */
import './pudding-chart/line';

// selections
const $containers = d3.selectAll('.charts');
const charts = [];
const $future = d3.select('.future');
const $dropdownF = $future.select('#female-select');
const $dropdownM = $future.select('#male-select');

// data
let annual = null;
let corr = null;
let karen = null;

const cutoff = 0.7;

function filterData(gender, time) {
  const current = time === 'current';
  // first, find matches for the time frame & time frame
  const filteredCorr = corr
    .filter((d) => d.gender === gender)
    .filter((d) => (current ? d.corKaren > cutoff : d.corKaren10 > cutoff))
    // return names and correlation for this chart
    .map((d) => {
      const thisCorr = current ? d.corKaren : d.corKaren10;
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

function handleDropdown() {}

function setupChart() {
  const $sel = d3.select(this);
  const chartGender = $sel.attr('data-gender');
  const chartTime = $sel.attr('data-time');

  // filter specific data for this section and sort by decreasing correlation
  const filtered = filterData(chartGender, chartTime).sort((a, b) =>
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
  console.log({ charts });
}

function resize() {}

function init(data) {
  [annual, corr, karen] = data;
  console.log({ karen, data });
  $containers.each(setupChart);
}

export default { init, resize };
