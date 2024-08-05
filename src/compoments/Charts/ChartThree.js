import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const ChartTree = () => {
  const [state, setState] = useState({
    series: [],
    categories: [] // Ajoutez un état pour stocker les noms des fokontany
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/crime-statsT')
      .then(response => {
        const crimeData = response.data.map(item => item.crime_count);
        const fokontanyNames = response.data.map(item => item.fokontany); // Récupérez les noms des fokontany depuis les données
        setState({ series: [{ data: crimeData }], categories: fokontanyNames }); // Mettez à jour l'état avec les noms des fokontany
      })
      .catch(error => {
        console.error('Error fetching crime statistics:', error);
      });
  }, []);

  const options = {
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: state.categories, // Utilisez les noms des fokontany comme catégories
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-black">
            Nombre de l'insécurité par la ville
          </h4>
        </div>

      </div>

      <div>
        <div  className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTree;
