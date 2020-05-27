let data = null;

// selections
const $section = d3.select('.compare');
const $containers = $section.selectAll('.table');
const $tables = $containers.selectAll('table');

const COLUMNS = [
  { title: '10 Years', prop: 'corKaren10' },
  { title: '20 Years', prop: 'corKaren20' },
  { title: '30 Years', prop: 'corKaren30' },
];

function setupTableHeader() {
  // adding table header
  $tables.each(function (d) {
    const table = d3.select(this);
    table
      .append('thead')
      .selectAll('th')
      .data(COLUMNS)
      .join((enter) => enter.append('th').text((d) => d.title));

    table.append('tbody');
  });
}

function resize() {}

function init(res) {
  data = res;
  setupTableHeader();
  console.log({ data });
}

export default { init, resize };
