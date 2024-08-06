import React from 'react';
import ChartOne from './Charts/ChartOne';

import ChartThree from "./Charts/ChartThree";
import ChartTwo from "./Charts/ChartTwo";
import Navbar from "./Navbar";


const LineChartExample = () => {
  return (
      <><Navbar/>
      <div style={{padding:"10px "}}>
              <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-2/3  ">
                <ChartOne />
              </div>
              <div className="w-full md:w-1/4 pl-6">
                <ChartTwo />
              </div>


            </div >
                   <div className="pt-4">
                        <ChartThree/>
                   </div>
      </div>
          </>
  );
};

export default LineChartExample;
