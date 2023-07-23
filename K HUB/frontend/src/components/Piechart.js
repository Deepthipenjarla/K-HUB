import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import './piechart.css'

const PieChartComponent = () => {
  const [chartData, setChartData] = useState(null);
  const chartContainerRefs = useRef([]);

  useEffect(() => {
    // Fetch column counts data from the server
    axios.get('http://localhost:4000/column-counts')
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching column counts', error);
      });
  }, []);

  const renderCharts = () => {
    if (!chartData) {
      return <p>Loading data...</p>;
    }

    return Object.entries(chartData).map(([key, value], index) => {
      const pieChartData = Object.entries(value).map(([subKey, subValue]) => ({
        name: subKey,
        value: subValue,
      }));

      const colorScale = scaleOrdinal(schemeCategory10).domain(pieChartData.map((entry) => entry.name));
      const COLORS = pieChartData.map((entry) => colorScale(entry.name));

      return (
        <div key={key} className="chart-container" ref={(ref) => (chartContainerRefs.current[index] = ref)}>
          <h2>{key}</h2>
          <PieChart width={400} height={300}>
            <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            <Tooltip />
          </PieChart>
        </div>
      );
    });
  };

  return <div className="total_box">{renderCharts()}</div>;
};

export default PieChartComponent;
