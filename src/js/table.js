// for typing name
import Autocomplete from 'accessible-autocomplete';

let data = null;

// selections
const $section = d3.select('.compare');
const $containers = $section.selectAll('.table');
const $tables = $containers.selectAll('table');
const $input = $section.select('#autocomplete');
const $userDir = $section.select('.user-message');

const COLUMNS = [
  { title: 'years', prop: 'i' },
  { title: 'name', prop: 'name' },
  { title: 'corr', prop: 'corr' },
];

function setupTableHeader() {
  // adding table header
  $tables.each(function (d) {
    const table = d3.select(this);

    table.append('tbody');
  });

  setupTableBody('');
}

function setupData(gender) {
  const filtered = data.filter((d) => d.gender === gender);

  const ten = filtered
    .sort((a, b) => d3.descending(a.corKaren10, b.corKaren10))
    .slice(0, 1)
    .map((d) => ({ name: d.name, corr: d.corKaren10 }));

  const twenty = filtered
    .sort((a, b) => d3.descending(a.corKaren20, b.corKaren20))
    .slice(0, 1)
    .map((d) => ({ name: d.name, corr: d.corKaren20 }));

  const thirty = filtered
    .sort((a, b) => d3.descending(a.corKaren30, b.corKaren30))
    .slice(0, 1)
    .map((d) => ({ name: d.name, corr: d.corKaren30 }));

  const zipped = d3.zip(ten, twenty, thirty);

  return zipped;
}

const getRowData = (d, i) => {
  return COLUMNS.map((c) => ({ value: d[c.prop], title: c.title, years: i }));
};

function setupTableBody(userInput) {
  $tables.each(function (d) {
    const table = d3.select(this);
    const chartGender = table.attr('data-gender');

    let tableData = null;

    if (chartGender === 'U' && userInput.length) {
      const userData = data.filter((e) => e.name === userInput);
      const mapped = userData.map((e) => {
        const ten = [{ name: e.name, corr: e.corKaren10 }];
        const twenty = [{ name: e.name, corr: e.corKaren20 }];
        const thirty = [{ name: e.name, corr: e.corKaren30 }];
        const zipped = d3.zip(ten, twenty, thirty);
        return zipped;
      });
      [tableData] = mapped[0];

      $userDir.classed('is-visible', false);
    } else [tableData] = setupData(chartGender);

    if (tableData) {
      const row = table
        .select('tbody')
        .selectAll('tr')
        .data(tableData)
        .join((enter) =>
          enter.append('tr').attr('class', (e, i) => {
            const dangerKaren = e.corr >= 0.7;
            return dangerKaren ? `row--${i} danger` : `row--${i}`;
          })
        );

      row
        .selectAll('td')
        .data(getRowData)
        .join((enter) => enter.append('td').attr('class', (d) => d.title))
        .text((d, i) => {
          if (d.title === 'years') return `In ${(d.years + 1) * 10} Years`;
          return d.value;
        });
    }
  });
}

function setupTypeFunctionality() {
  const onlyNames = data.map((d) => d.name);

  // console.log({ $input });
  // const onlyNames = ['Amber', 'Parker', 'Pixel'];
  Autocomplete({
    element: document.querySelector('#autocomplete'),
    id: 'my-autocomplete',
    source: onlyNames,
    displayMenu: 'overlay',
    confirmOnBlur: false,
    onConfirm(name) {
      // console.log({ name });
      setupTableBody(name);
    },
  });
}

function resize() {}

function init(res) {
  data = res;
  setupTableHeader();
  setupTypeFunctionality();
  // console.log({ data });
}

export default { init, resize };
