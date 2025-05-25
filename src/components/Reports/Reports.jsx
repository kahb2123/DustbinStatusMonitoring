import React, { useState, useEffect } from 'react';
import { fetchBinData } from '../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let results = 100; // Default to last 100 entries
      
      if (timeRange === '24h') results = 96; // Assuming 15-minute intervals
      else if (timeRange === '7d') results = 168; // Assuming 1-hour intervals
      else if (timeRange === '30d') results = 120; // Assuming 6-hour intervals

      const data = await fetchBinData(results);
      const processedData = data.map(item => ({
        date: new Date(item.created_at).toLocaleString(),
        dry: parseInt(item.field1) || 0,
        wet: parseInt(item.field2) || 0
      }));
      setReportData(processedData.reverse());
      setLoading(false);
    };

    fetchData();
  }, [timeRange]);

  const getSummaryStats = () => {
    if (reportData.length === 0) return null;

    const dryData = reportData.map(item => item.dry);
    const wetData = reportData.map(item => item.wet);

    return {
      dry: {
        max: Math.max(...dryData),
        min: Math.min(...dryData),
        avg: (dryData.reduce((a, b) => a + b, 0) / dryData.length).toFixed(1)
      },
      wet: {
        max: Math.max(...wetData),
        min: Math.min(...wetData),
        avg: (wetData.reduce((a, b) => a + b, 0) / wetData.length).toFixed(1)
      }
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="reports-container">
      <h2>Bin Status Reports</h2>
      
      <div className="time-range-selector">
        <button 
          className={timeRange === '24h' ? 'active' : ''}
          onClick={() => setTimeRange('24h')}
        >
          Last 24 Hours
        </button>
        <button 
          className={timeRange === '7d' ? 'active' : ''}
          onClick={() => setTimeRange('7d')}
        >
          Last 7 Days
        </button>
        <button 
          className={timeRange === '30d' ? 'active' : ''}
          onClick={() => setTimeRange('30d')}
        >
          Last 30 Days
        </button>
      </div>

      {loading ? (
        <p>Loading report data...</p>
      ) : (
        <>
          <div className="chart-container">
            <h3>Bin Level Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="dry" 
                  stroke="#8884d8" 
                  name="Dry Waste (%)" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="wet" 
                  stroke="#82ca9d" 
                  name="Wet Waste (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {stats && (
            <div className="stats-container">
              <h3>Summary Statistics</h3>
              <div className="stats-cards">
                <div className="stat-card">
                  <h4>Dry Waste</h4>
                  <p>Max: {stats.dry.max}%</p>
                  <p>Min: {stats.dry.min}%</p>
                  <p>Avg: {stats.dry.avg}%</p>
                </div>
                <div className="stat-card">
                  <h4>Wet Waste</h4>
                  <p>Max: {stats.wet.max}%</p>
                  <p>Min: {stats.wet.min}%</p>
                  <p>Avg: {stats.wet.avg}%</p>
                </div>
              </div>
            </div>
          )}

          <div className="data-table-container">
            <h3>Raw Data</h3>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Dry Waste (%)</th>
                    <th>Wet Waste (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.dry}</td>
                      <td>{item.wet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;