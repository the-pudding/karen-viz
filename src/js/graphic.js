/* global d3 */
import './pudding-chart/line';
import Annotation from 'd3-svg-annotation';
import parallax from './parallax';

// selections
const $containers = d3.selectAll('.charts');
const charts = [];
const $future = d3.select('.future');
const $futureContainers = $future.selectAll('.charts');
const $dropdowns = $future.selectAll('select');
const $buttons = d3.selectAll('.show-more');
const $femaleTable = $future.select('.brief__female');
const $maleTable = $future.select('.brief__male');

// data
let annual = null;
let corr = null;
let karen = null;
let allExtremes = null;

const cutoff = 0.7;

function findExtremes(year) {
  const col = `corKaren${year}`;

  const male = corr.filter((d) => d.gender === 'M');
  const female = corr.filter((d) => d.gender === 'F');

  const sortedCorrF = female.sort((a, b) => d3.descending(a[col], b[col]));
  const topF = [sortedCorrF.shift()].map((d) => ({
    name: d.name,
    corr: d[col],
  }))[0];
  const bottomF = [sortedCorrF.pop()].map((d) => ({
    name: d.name,
    corr: d[col],
  }))[0];

  const sortedCorrM = male.sort((a, b) => d3.descending(a[col], b[col]));
  const topM = [sortedCorrM.shift()].map((d) => ({
    name: d.name,
    corr: d[col],
  }))[0];
  const bottomM = [sortedCorrM.pop()].map((d) => ({
    name: d.name,
    corr: d[col],
  }))[0];

  return {
    female: { top: topF, bottom: bottomF },
    male: { top: topM, bottom: bottomM },
  };
}

function setupCalloutData() {
  const tenYears = findExtremes(10);
  const twentyYears = findExtremes(20);
  const thirtyYears = findExtremes(30);

  allExtremes = d3.zip([tenYears], [twentyYears], [thirtyYears]);
}

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

function updateTables(years) {
  const allYears = [10, 20, 30];
  const yearIndex = allYears.findIndex((d) => d === +years);

  const femaleData = allExtremes[0][yearIndex].female;
  const maleData = allExtremes[0][yearIndex].male;

  const namesF = $femaleTable.selectAll('.name');
  namesF.each(function (name) {
    const thisName = d3.select(this);
    const cond = thisName.attr('data-condition');
    thisName.text(femaleData[cond].name);
  });

  const corrF = $femaleTable.selectAll('.corr');
  corrF.each(function (corr) {
    const thisCorr = d3.select(this);
    const cond = thisCorr.attr('data-condition');
    thisCorr.text(`Correlation: ${femaleData[cond].corr}`);
  });

  const namesM = $maleTable.selectAll('.name');
  namesM.each(function (name) {
    const thisName = d3.select(this);
    const cond = thisName.attr('data-condition');
    thisName.text(maleData[cond].name);
  });

  const corrM = $maleTable.selectAll('.corr');
  corrM.each(function (corr) {
    const thisCorr = d3.select(this);
    const cond = thisCorr.attr('data-condition');
    thisCorr.text(`Correlation: ${maleData[cond].corr}`);
  });
}

function handleDropdown() {
  const val = d3.select(this).property('value');

  $futureContainers.each(function (d) {
    const $sel = d3.select(this);
    const chartGender = $sel.attr('data-gender');
    const filtered = filterData(chartGender, val).sort((a, b) =>
      d3.descending(a.corr, b.corr)
    );

    // if there are more than 2 rows, clip container and show button
    const windowWidth = $future.node().offsetWidth;
    const graphicWidth = 255;
    const graphicPerRow = windowWidth / graphicWidth;
    const tooMany = filtered.length > graphicPerRow * 2;

    const btn = d3.select(this.parentNode).select('button');

    $sel.classed('is-clipped', tooMany);
    btn.classed('is-visible', tooMany);

    // remove old charts
    $sel.selectAll('.chart__line').remove();

    // create new ones
    const theseCharts = $sel
      .selectAll('.chart__line')
      .data(filtered)
      .join((enter) => enter.append('div').attr('class', 'chart__line'))
      .karenLine();

    theseCharts.forEach((chart, i) => chart.resize().render(i));

    // change both dropdowns to match
    $dropdowns.selectAll('option').property('selected', (d) => d === +val);

    // change spans in table to match
    d3.selectAll('.year-change').text(val);
  });

  updateTables(val);
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

  theseCharts.forEach((chart, i) => chart.resize().render(i));

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

function handleButtonClick() {
  const btn = d3.select(this);
  const chart = d3.select(this.parentNode.parentNode).select('.charts');

  // was the container clipped before clicking?
  const expanded = chart.classed('is-clipped');
  const text = expanded ? 'Show Fewer' : 'Show All';
  btn.text(text);
  chart.classed('is-clipped', !expanded);

  console.log(expanded);

  // if (expanded) {
  //   const y = +btn.attr('data-y');
  //   window.scrollTo(0, y);
  // }

  // btn.attr('data-y', window.scrollY);
}

function init(data) {
  parallax.init();
  [annual, corr, karen] = data;
  $containers.each(setupChart);
  setupDropdowns();
  setupCalloutData();
  updateTables(10);
  $buttons.on('click', handleButtonClick);
}

export default { init, resize };
