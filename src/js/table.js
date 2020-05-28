// for typing name
import Autocomplete from 'accessible-autocomplete';

let data = null;

// selections
const $section = d3.select('.compare');
const $containers = $section.selectAll('.table');
const $tables = $containers.selectAll('table');
const $input = $section.select('#autocomplete');

const COLUMNS = [
  { title: '10 Years', prop: '0' },
  { title: '20 Years', prop: '1' },
  { title: '30 Years', prop: '2' },
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

  setupTableBody('');
}

function setupData(gender) {
  const filtered = data.filter((d) => d.gender === gender);

  const ten = filtered
    .sort((a, b) => d3.descending(a.corKaren10, b.corKaren10))
    .slice(0, 10)
    .map((d) => `<span class='num'>${d.corKaren10}</span> ${d.name}`);

  const twenty = filtered
    .sort((a, b) => d3.descending(a.corKaren20, b.corKaren20))
    .slice(0, 10)
    .map((d) => `<span class='num'>${d.corKaren20}</span> ${d.name}`);

  const thirty = filtered
    .sort((a, b) => d3.descending(a.corKaren30, b.corKaren30))
    .slice(0, 10)
    .map((d) => `<span class='num'>${d.corKaren30}</span> ${d.name}`);

  const zipped = d3.zip(ten, twenty, thirty);

  return zipped;
}

function setupTableBody(userInput) {
  const getRowData = (d, i) => {
    return COLUMNS.map((c) => ({ value: d[c.prop], title: c.title }));
  };

  $tables.each(function (d) {
    const table = d3.select(this);
    const chartGender = table.attr('data-gender');

    let tableData = null;

    if (userInput.length > 0) {
      const userCorr = data.filter((d) => d.name === userInput);
      console.log(userCorr);
    } else tableData = setupData(chartGender);

    const row = table
      .select('tbody')
      .selectAll('tr')
      .data(tableData)
      .join((enter) => enter.append('tr'));

    row
      .selectAll('td')
      .data(getRowData, (e) => `${e.value}-${e.title}`)
      .join((enter) => enter.append('td').attr('class', (e) => `${e.title}`))
      .html((e) => e.value);
  });
}

function setupTypeFunctionality() {
  const onlyNames = data.map((d) => d.name);

  console.log({ $input });
  // const onlyNames = ['Amber', 'Parker', 'Pixel'];
  Autocomplete({
    element: document.querySelector('#autocomplete'),
    id: 'my-autocomplete',
    source: onlyNames,
    displayMenu: 'overlay',
    confirmOnBlur: true,
    onConfirm(name) {
      console.log({ name });
      // setupTableBody(name);
    },
  });
}

function resize() {}

function init(res) {
  data = res;
  setupTableHeader();
  setupTypeFunctionality();
  console.log({ data });
}

export default { init, resize };
