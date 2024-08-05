import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const ChartOne = () => {
  const [seriesData, setSeriesData] = useState([{ name: 'Total Crimes', data: [] }]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    // Fetch unique years
    axios.get('http://127.0.0.1:8000/api/years')
      .then(response => {
        setYears(response.data);
        if (response.data.length > 0) {
          setSelectedYear(response.data[0].year);
        }
      })
      .catch(error => {
        console.error('Error fetching years:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedYear) {
      // Fetch crimes data by year
      axios.get(`http://127.0.0.1:8000/api/crimesY/${selectedYear}`)
        .then(response => {
          const months = Array(12).fill(0);
          response.data.forEach(crime => {
            months[crime.month - 1] = crime.total;
          });
          setSeriesData([{ name: 'Total Crimes', data: months }]);
        })
        .catch(error => {
          console.error('Error fetching crimes:', error);
        });
    }
  }, [selectedYear]);

  const options = {
    legend: { show: false },
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: { show: false },
    },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 300 } } },
      { breakpoint: 1366, options: { chart: { height: 350 } } },
    ],
    stroke: { width: 2, curve: 'straight' },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      hover: { sizeOffset: 5 },
    },
    xaxis: {
      type: 'category',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { style: { fontSize: '0px' } }, min: 0 },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex min-w-47.5">
        <div>
          <div className="relative z-20 inline-block">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="relative z-20 inline-flex bg-transparent pr-1 pl-1 mr-2 text-sm font-medium outline-none"
            >
              {years.map(year => (
                <option key={year.year} value={year.year} className='dark:bg-boxdark'>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full">
          <p className="font-semibold text-primary">Total l'insecurite par ans: {seriesData[0].data.reduce((a, b) => a + b, 0)}</p>
          <p className="font-semibold text-primary">Total tous l'insecurite: {/* Add total insecurity calculation here */}</p>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart options={options} series={seriesData} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
