import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CollectionRoute.css';

// Sample bin locations with fill levels
const initialBins = [
  { id: 1, name: "Kble 16", lat: 11.5621, lng: 37.3925, level: 45 },
  { id: 2, name: "FleghiowtHospital", lat: 11.5635, lng: 37.3982, level: 80 },
  { id: 3, name: "Papires", lat: 11.5678, lng: 37.3950, level: 30 },
  { id: 4, name: "PedaCampus", lat: 11.5605, lng: 37.4001, level: 65 },
  { id: 5, name: "ቅዱስ ጊዮርጊስ ቤ/ክ", lat: 11.5652, lng: 37.3876, level: 20 },
];

// Depot location
const depot = { lat: 11.5630, lng: 37.3900, name: "Poly" };

const CollectionRoute = () => {
  const [bins, setBins] = useState(initialBins);
  const [route, setRoute] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [showFullOnly, setShowFullOnly] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'graph'
  const [graphData, setGraphData] = useState([]);

  // Calculate optimal route and prepare graph data
  useEffect(() => {
    const { optimalRoute, distance } = calculateOptimalRoute();
    setRoute(optimalRoute);
    setTotalDistance(distance);
    prepareGraphData(optimalRoute);
  }, [showFullOnly]);

  const calculateOptimalRoute = () => {
    // Filter bins based on selection
    const filteredBins = showFullOnly 
      ? bins.filter(bin => bin.level >= 50) 
      : [...bins];
    
    if (filteredBins.length === 0) {
      return { optimalRoute: [], distance: 0 };
    }

    // Simplified nearest neighbor algorithm
    let unvisited = [...filteredBins];
    let currentLocation = depot;
    let optimalRoute = [depot];
    let distance = 0;

    while (unvisited.length > 0) {
      // Find nearest bin
      let nearest = null;
      let minDist = Infinity;
      
      unvisited.forEach(bin => {
        const dist = calculateDistance(currentLocation, bin);
        if (dist < minDist) {
          minDist = dist;
          nearest = bin;
        }
      });

      // Add to route
      optimalRoute.push(nearest);
      distance += minDist;
      currentLocation = nearest;
      unvisited = unvisited.filter(b => b.id !== nearest.id);
    }

    // Return to depot
    distance += calculateDistance(currentLocation, depot);
    optimalRoute.push(depot);

    return { optimalRoute, distance };
  };

  const prepareGraphData = (optimalRoute) => {
    if (optimalRoute.length < 2) {
      setGraphData([]);
      return;
    }

    const data = [];
    let cumulativeDistance = 0;

    // Add depot as starting point
    data.push({
      name: optimalRoute[0].name,
      distance: 0,
      fillLevel: 0,
      sequence: 0
    });

    // Add bins with cumulative distance
    optimalRoute.slice(1, -1).forEach((bin, index) => {
      cumulativeDistance += calculateDistance(
        optimalRoute[index], 
        optimalRoute[index + 1]
      );
      
      data.push({
        name: bin.name,
        distance: cumulativeDistance,
        fillLevel: bin.level,
        sequence: index + 1
      });
    });

    // Add return to depot
    cumulativeDistance += calculateDistance(
      optimalRoute[optimalRoute.length - 2], 
      optimalRoute[optimalRoute.length - 1]
    );
    
    data.push({
      name: optimalRoute[optimalRoute.length - 1].name,
      distance: cumulativeDistance,
      fillLevel: 0,
      sequence: optimalRoute.length - 1
    });

    setGraphData(data);
  };

  const calculateDistance = (loc1, loc2) => {
    // Haversine formula for distance calculation
    const R = 6371; // Earth radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getBinColor = (level) => {
    if (level >= 80) return '#ff4444'; // Red
    if (level >= 50) return '#ffbb33'; // Orange
    return '#00C851'; // Green
  };

  const getBinIcon = (level) => {
    return L.divIcon({
      className: 'custom-bin-icon',
      html: `
        <div class="bin-marker" style="background-color: ${getBinColor(level)}">
          <span>${level}%</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  };

  const depotIcon = L.divIcon({
    className: 'custom-depot-icon',
    html: `
      <div class="depot-marker">
        <i class="fas fa-truck"></i>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  const renderMapView = () => (
    <div className="map-container">
      <MapContainer 
        center={[depot.lat, depot.lng]} 
        zoom={15} 
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Marker 
          position={[depot.lat, depot.lng]} 
          icon={depotIcon}
        >
          <Popup>{depot.name}</Popup>
        </Marker>

        {bins.map(bin => (
          <Marker
            key={bin.id}
            position={[bin.lat, bin.lng]}
            icon={getBinIcon(bin.level)}
            eventHandlers={{
              click: () => setSelectedBin(bin)
            }}
          >
            <Popup>
              <div className="bin-popup">
                <h4>{bin.name}</h4>
                <p>Fill Level: {bin.level}%</p>
                <div 
                  className="level-bar"
                  style={{ 
                    width: `${bin.level}%`,
                    backgroundColor: getBinColor(bin.level)
                  }}
                ></div>
              </div>
            </Popup>
          </Marker>
        ))}

        {route.length > 0 && (
          <Polyline
            positions={route.map(loc => [loc.lat, loc.lng])}
            color="#3a7bd5"
            weight={4}
            dashArray="5, 5"
          />
        )}
      </MapContainer>
    </div>
  );

  const renderGraphView = () => (
    <div className="graph-container">
      <h3>Collection Route Sequence</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={graphData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="sequence"
            label={{ value: 'Stop Sequence', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            label={{ value: 'Fill Level (%)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Distance') return [`${value.toFixed(2)} km`, name];
              if (name === 'Fill Level') return [`${value}%`, name];
              return [value, name];
            }}
            labelFormatter={(sequence) => `Stop ${sequence}: ${graphData[sequence]?.name || ''}`}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="distance"
            stroke="#3a7bd5"
            name="Distance"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="fillLevel"
            stroke="#ff4444"
            name="Fill Level"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="route-sequence">
        <h4>Route Sequence:</h4>
        <ol>
          {graphData.map((point, index) => (
            <li key={index}>
              {point.name} 
              {index > 0 && index < graphData.length - 1 && (
                <span className="fill-level" style={{ color: getBinColor(point.fillLevel) }}>
                  ({point.fillLevel}%)
                </span>
              )}
              {index > 0 && (
                <span className="distance">
                  {index < graphData.length - 1 ? '→' : '↺'} 
                  {index === graphData.length - 1 ? ' Depot' : ''}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  return (
    <div className="collection-route-container">
      <div className="route-controls">
        <h2>Optimal Collection Route</h2>
        <div className="controls">
          <div className="left-controls">
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={showFullOnly}
                onChange={() => setShowFullOnly(!showFullOnly)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Show full bins only</span>
            </label>
            
            <div className="view-toggle">
              <button
                className={viewMode === 'map' ? 'active' : ''}
                onClick={() => setViewMode('map')}
                title="Map View"
              >
                <i className="fas fa-map"></i> Map
              </button>
              <button
                className={viewMode === 'graph' ? 'active' : ''}
                onClick={() => setViewMode('graph')}
                title="Graph View"
              >
                <i className="fas fa-chart-line"></i> Graph
              </button>
            </div>
          </div>
          
          <div className="route-info">
            <div className="info-item">
              <i className="fas fa-route"></i>
              <span>Total Distance: {totalDistance.toFixed(2)} km</span>
            </div>
            <div className="info-item">
              <i className="fas fa-trash-alt"></i>
              <span>Bins to collect: {route.length > 2 ? route.length - 2 : 0}</span>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'map' ? renderMapView() : renderGraphView()}

      {selectedBin && (
        <div className="bin-details">
          <h3>{selectedBin.name}</h3>
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span>{selectedBin.lat.toFixed(4)}, {selectedBin.lng.toFixed(4)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Fill Level:</span>
            <span className="level-value" style={{ color: getBinColor(selectedBin.level) }}>
              {selectedBin.level}%
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span>
              {selectedBin.level >= 80 ? 'Critical' : 
               selectedBin.level >= 50 ? 'Needs Collection' : 'Normal'}
            </span>
          </div>
          <button 
            className="close-btn"
            onClick={() => setSelectedBin(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionRoute;