import React from 'react';
import { Link } from 'react-router-dom';
import locations from './locations';

const Home = () => {
  const bestLocation = locations.reduce((min, loc) => min.distance < loc.distance ? min : loc);

  return (
    <div className="home-container">
      <h2>Collection Locations</h2>
      <p>Best path: <Link to={`/location/${bestLocation.name}`}>{bestLocation.name} ({bestLocation.distance} km)</Link></p>
      <ul className="location-list">
        {locations.map((location) => (
          <li key={location.name}>
            <Link to={`/location/${location.name}`}>{location.name} - {location.distance} km</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;