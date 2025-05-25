import React from 'react';
import { Link } from 'react-router-dom';
import locations from './locations';

const WasteCollection = () => {
  const bestLocation = locations.reduce((min, loc) => min.distance < loc.distance ? min : loc);
  const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });

  return (
    <div className="waste-collection-container">
      <h2>Waste Collection Locations</h2>
      <p>Best Path: <Link to={`/location/${bestLocation.name}`}>{bestLocation.name} ({bestLocation.distance} km)</Link></p>
      <ul className="location-list">
        {locations.map((location) => (
          <li key={location.name}>
            <Link to={`/location/${location.name}`}>{location.name} - {location.distance} km</Link>
          </li>
        ))}
      </ul>
      <p className="last-updated">Last updated: {currentDate}</p>
    </div>
  );
};

export default WasteCollection;