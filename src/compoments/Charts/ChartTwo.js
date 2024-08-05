
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const ChartTwo = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/crime-stats')
      .then(response => {
        const data = response.data;
        console.log('Fetched data:', data); // Log fetched data

        if (data && data.length > 0) {
          const seriesData = data.map(item => Math.round(item.percentage || 0)); // Round to nearest whole number
          const labelsData = data.map(item => `${item.gravité_crime || ''} (${item.count} )`); // Concatenate count and label

          console.log('Series data:', seriesData); // Log series data
          console.log('Labels data:', labelsData); // Log labels data

          setSeries(seriesData);
          setLabels(labelsData);
        } else {
          throw new Error('No data available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const options = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: ['#FF0000', '#FFA500', '#FFFF00', '#008000'], // Rouge, Orange, Jaune, Vert
    labels: labels,
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 280,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-black">
            Pourcentage et nombre de l'insécurite de fianarantsoa trié par la gravité


          </h5>
        </div>

      </div>

      <div className="mb-2">
        <div  className="mx-auto flex justify-center">
          {series.length > 0 && (
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
            />
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {labels.map((label, index) => (
          <div key={index} className="sm:w-1/2 w-full px-8">
            <div className="flex w-full items-center">
              <span className={`mr-2 block h-3 w-full max-w-3 rounded-full`} style={{backgroundColor: options.colors[index]}}></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-black">
                <span> {label} </span>
                <span> {series[index] || '0'}% </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartTwo;
