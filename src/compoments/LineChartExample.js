import React from 'react';
import ChartOne from './Charts/ChartOne';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartThree from "./Charts/ChartThree";
import ChartTwo from "./Charts/ChartTwo";
import Navbar from "./Navbar";
const data = [
  { x: 'Jan', y: 30 },
  { x: 'Feb', y: 20 },
  { x: 'Mar', y: 50 },
  { x: 'Apr', y: 40 },
  { x: 'May', y: 60 },
  { x: 'Jun', y: 70 },
];

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
