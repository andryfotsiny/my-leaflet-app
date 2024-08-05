import React from 'react';
/**
 * @typedef {Object} Package
 * @property {string} name - The name of the package.
 * @property {number} price - The price of the package.
 * @property {string} invoiceDate - The invoice date of the package.
 * @property {string} status - The payment status of the package.
 */

/** @type {Package[]} */
const packageData = [
  {
    name: 'Free package',
    price: 0.0,
    invoiceDate: 'Jan 13, 2023',
    status: 'Paid',
  },
  {
    name: 'Standard Package',
    price: 59.0,
    invoiceDate: 'Jan 13, 2023',
    status: 'Paid',
  },
  {
    name: 'Business Package',
    price: 99.0,
    invoiceDate: 'Jan 13, 2023',
    status: 'Unpaid',
  },
  {
    name: 'Standard Package',
    price: 59.0,
    invoiceDate: 'Jan 13, 2023',
    status: 'Pending',
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-success text-success';
    case 'Unpaid':
      return 'bg-danger text-danger';
    case 'Pending':
      return 'bg-warning text-warning';
    default:
      return '';
  }
};

const TableThree = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Package
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Invoice date
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {packageData.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {packageItem.name}
                  </h5>
                  <p className="text-sm">${packageItem.price}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.invoiceDate}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClass(packageItem.status)}`}>
                    {packageItem.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* SVG path removed */}
                      </svg>
                    </button>
                    <button className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* SVG path removed */}
                      </svg>
                    </button>
                    <button className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* SVG path removed */}
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>


  );
};

export default TableThree;
