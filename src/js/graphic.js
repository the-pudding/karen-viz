/* global d3 */
import './pudding-chart/line';

// selections
const $containers = d3.selectAll('.charts');
const charts = [];

// data
let annual = null;
let corr = null;

const cutoff = 0.7;

function filterData(gender, time) {
  // first, find matches for the time frame & time frame
  const filteredCorr = corr
    .filter((d) => d.gender === gender)
    .filter((d) =>
      time === 'current' ? d.corKaren > cutoff : d.corKaren10 > cutoff
    )
    .sort((a, b) =>
      time === 'current'
        ? d3.descending(a.corKaren, b.corKaren)
        : d3.descending(a.corKaren10, b.corKaren10)
    )
    .map((d) => d.name);

  // then filter our annual data to just include the appropriate names
  const filteredNames = annual.filter((d) => filteredCorr.includes(d.name));

  // nest the data so we can make one chart per name
  const nestedNames = d3
    .nest()
    .key((d) => d.name)
    .entries(filteredNames);

  return nestedNames;
}

function setupChart() {
  const $sel = d3.select(this);
  const chartGender = $sel.attr('data-gender');
  const chartTime = $sel.attr('data-time');

  const filtered = filterData(chartGender, chartTime);
  console.log({ filtered });

  $sel
    .selectAll('.chart__line')
    .data(filtered)
    .join((enter) => enter.append('div').attr('class', 'chart__line'))
    .karenLine();
}

function resize() {}

function init(data) {
  [annual, corr] = data;
  $containers.each(setupChart);
}

export default { init, resize };
