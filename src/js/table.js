let data = null;
const decFormat = d3.format('.2f');

// selections
const $section = d3.select('.compare');
const $containers = $section.selectAll('.table');
const $tables = $containers.selectAll('table');

const COLUMNS = [
  { title: 'In 10 Yrs', prop: '0' },
  { title: 'In 20 Yrs', prop: '1' },
  { title: 'In 30 Yrs', prop: '2' },
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

  setupTableBody();
}

function setupData(gender) {
  const filtered = data.filter((d) => d.gender === gender);

  const ten = filtered
    .sort((a, b) => d3.descending(a.corKaren10, b.corKaren10))
    .slice(0, 10)
    .map((d) => `<span class='num'>${decFormat(d.corKaren10)}</span> ${d.name}`);

  const twenty = filtered
    .sort((a, b) => d3.descending(a.corKaren20, b.corKaren20))
    .slice(0, 10)
    .map((d) => `<span class='num'>${decFormat(d.corKaren20)}</span> ${d.name}`);

  const thirty = filtered
    .sort((a, b) => d3.descending(a.corKaren30, b.corKaren30))
    .slice(0, 10)
    .map((d) => `<span class='num'>${decFormat(d.corKaren30)}</span> ${d.name}`);

  const zipped = d3.zip(ten, twenty, thirty);

  return zipped;
}

function setupTableBody() {
  const getRowData = (d, i) => {
    return COLUMNS.map((c) => ({ value: d[c.prop], title: c.title }));
  };

  $tables.each(function (d) {
    const table = d3.select(this);
    const chartGender = table.attr('data-gender');

    const tableData = setupData(chartGender);

    const row = table
      .select('tbody')
      .selectAll('tr')
      .data(tableData)
      .join((enter) => enter.append('tr'));

    row
      .selectAll('td')
      .data(getRowData, (d) => `${d.value}-${d.title}`)
      .join((enter) => enter.append('td').attr('class', (d) => `${d.title}`))
      .html((d) => d.value);
  });
}

function resize() {}

function init(res) {
  data = res;
  setupTableHeader();
  console.log({ data });
}

export default { init, resize };
