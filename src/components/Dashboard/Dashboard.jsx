import React from 'react';
import BinStatus from '../BinStatus/BinStatus';
import Reports from '../Reports/Reports';
import './Dashboard.css';
import Home from '../../RoutingPath/Home';
import LocationDetail from '../../RoutingPath/WasteCollection';
import CollectionRoute from '../CollectionRoute/CollectionRoute';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* <Home /> */}
        {/* <LocationDetail /> */}
        
        <BinStatus />
        <CollectionRoute />
        <Reports />
      </div>
    </div>
  );
};

export default Dashboard;