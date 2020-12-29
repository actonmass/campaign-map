/* global Papa */
document.addEventListener('DOMContentLoaded', () => {
  const csv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4l7bRcBIgwsEPGM_s9zF9csIeTgE2No_4tA6MuDCBUbfmWY_e9mAfzPpCJTsIK_hUzOyJ8CmdGMsX/pub?gid=641305740&single=true&output=csv';
  Papa.parse(csv, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      const repList = document.createElement('ul');

      results.data.sort((a, b) => a.last_name.localeCompare(b.last_name));
      results.data.filter((rep) => rep.commitments).forEach((rep) => {
        const commitments = [
          rep.committee_votes ? '1' : null,
          rep.public_bills ? '2' : null,
          rep.roll_call ? '3' : null,
        ].filter((i) => i);

        repList.insertAdjacentHTML('beforeend', `
          <li>
            Rep. ${rep.first_name} ${rep.last_name}
            (${rep.party ? `${rep.party[0]} - ` : ''}${rep.district}):
            Amendment${commitments.length > 1 ? 's' : ''}
            ${commitments.join(', ')}
          </li>
        `);
      });

      document.querySelector('script[src*=commitment-list]')
        .insertAdjacentElement('afterend', repList);
    },
  });
});
