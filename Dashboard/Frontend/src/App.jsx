import { useState } from 'react';
import './App.css';

function App() {
  const [farmData] = useState({
    name: "Shivam Organic Farm",
    location: "Jabalpur, Madhya Pradesh • 50km from City",
    totalArea: "245 acres",
    fields: 19,
    lastUpdate: "Jan 15, 2026, 5:05 PM IST",
    season: "Rabi 2026",
    nextHarvest: "Mar 15, 2026"
  });

  const [dashboardData] = useState({
    stats: [
      { icon: '🌾', title: 'Total Land', value: '245 Ac', target: '300 Ac', progress: 82, color: '#10b981', trend: '+12 Ac', unit: 'Acres' },
      { icon: '🌱', title: 'Active Crops', value: '8 Types', target: '10 Types', progress: 80, color: '#3b82f6', trend: '+1', unit: 'Types' },
      { icon: '💧', title: 'Soil Moisture', value: '68%', target: '75%', progress: 68, color: '#06b6d4', trend: '+5%', unit: '%' },
      { icon: '🌡️', title: 'Avg Temp', value: '28°C', target: '30°C', progress: 93, color: '#f59e0b', trend: '+2°C', unit: '°C' },
      { icon: '💰', title: 'Revenue', value: '₹12.5L', target: '₹15L', progress: 83, color: '#8b5cf6', trend: '+₹1.2L', unit: 'Lakhs' },
      { icon: '🚜', title: 'Equipment', value: '8/12', target: '12', progress: 67, color: '#ef4444', trend: '+1', unit: 'Units' },
      { icon: '💡', title: 'IoT Sensors', value: '45/60', target: '60', progress: 75, color: '#f97316', trend: '+3', unit: 'Sensors' },
      { icon: '🛰️', title: 'Drone Coverage', value: '92%', target: '100%', progress: 92, color: '#14b8a6', trend: '+8%', unit: '%' },
      { icon: '📱', title: 'Alerts', value: '3 Active', target: '0', progress: 30, color: '#f43f5e', trend: '-1', unit: 'Alerts' },
      { icon: '👨‍🌾', title: 'Workers', value: '28/35', target: '35', progress: 80, color: '#a855f7', trend: '+2', unit: 'Workers' },
      { icon: '⚡', title: 'Power Usage', value: '2.4 kWh', target: '3 kWh', progress: 80, color: '#eab308', trend: '-0.2', unit: 'kWh' },
      { icon: '📊', title: 'Yield/Ac', value: '24 Qt', target: '28 Qt', progress: 86, color: '#ec4899', trend: '+1.2', unit: 'Qt/Ac' }
    ],
    crops: [
      { name: 'Paddy', yield: 28, health: 92, area: 85, irrigated: true, pest: 'Low', fertilizer: 'Organic', stage: 'Tillering', color: '#10b981', status: 'Excellent' },
      { name: 'Wheat', yield: 22, health: 87, area: 65, irrigated: true, pest: 'Medium', fertilizer: 'NPK', stage: 'Jointing', color: '#f59e0b', status: 'Good' },
      { name: 'Maize', yield: 35, health: 78, area: 45, irrigated: false, pest: 'High', fertilizer: 'Urea', stage: 'Vegetative', color: '#3b82f6', status: 'Fair' },
      { name: 'Soybean', yield: 18, health: 95, area: 35, irrigated: true, pest: 'Low', fertilizer: 'Organic', stage: 'Flowering', color: '#8b5cf6', status: 'Excellent' },
      { name: 'Cotton', yield: 25, health: 82, area: 25, irrigated: false, pest: 'Medium', fertilizer: 'NPK', stage: 'Squaring', color: '#ef4444', status: 'Good' },
      { name: 'Gram', yield: 15, health: 88, area: 20, irrigated: true, pest: 'Low', fertilizer: 'Organic', stage: 'Podding', color: '#14b8a6', status: 'Good' },
      { name: 'Mustard', yield: 12, health: 91, area: 18, irrigated: false, pest: 'Low', fertilizer: 'NPK', stage: 'Siliquae', color: '#f97316', status: 'Excellent' },
      { name: 'Lentil', yield: 10, health: 85, area: 12, irrigated: true, pest: 'Medium', fertilizer: 'Organic', stage: 'Podding', color: '#ec4899', status: 'Good' }
    ],
    soil: [
      { name: 'Optimal (65%)', value: 65, fields: 12, moisture: '22-28%', ph: '6.5-7.0', color: '#10b981' },
      { name: 'Dry (20%)', value: 20, fields: 4, moisture: '<18%', ph: '7.2-7.8', color: '#f59e0b' },
      { name: 'Wet (10%)', value: 10, fields: 2, moisture: '>32%', ph: '6.0-6.5', color: '#3b82f6' },
      { name: 'Critical (5%)', value: 5, fields: 1, moisture: '8-12%', ph: '8.0+', color: '#ef4444' }
    ],
    weather: [
      { day: 'Today', temp: 28, condition: '🌤️', rain: 10, humidity: 65, wind: '8 km/h' },
      { day: 'Tomorrow', temp: 26, condition: '⛅', rain: 30, humidity: 72, wind: '12 km/h' },
      { day: 'Fri', temp: 25, condition: '🌧️', rain: 60, humidity: 85, wind: '15 km/h' },
      { day: 'Sat', temp: 29, condition: '☀️', rain: 5, humidity: 55, wind: '10 km/h' },
      { day: 'Sun', temp: 31, condition: '🌤️', rain: 15, humidity: 62, wind: '9 km/h' },
      { day: 'Mon', temp: 27, condition: '⛅', rain: 20, humidity: 68, wind: '11 km/h' },
      { day: 'Tue', temp: 24, condition: '🌧️', rain: 70, humidity: 88, wind: '18 km/h' },
      { day: 'Wed', temp: 30, condition: '☀️', rain: 2, humidity: 52, wind: '7 km/h' },
      { day: 'Thu', temp: 29, condition: '🌤️', rain: 8, humidity: 60, wind: '9 km/h' },
      { day: 'Fri', temp: 26, condition: '⛅', rain: 25, humidity: 70, wind: '13 km/h' }
    ],
    market: [
      { crop: 'Paddy', msp: '₹2180', market: '₹2250', mandi: 'Jabalpur Mandi', trend: '+2.3%', volume: '450 Qt' },
      { crop: 'Wheat', msp: '₹2275', market: '₹2350', mandi: 'Katni Mandi', trend: '+3.1%', volume: '320 Qt' },
      { crop: 'Maize', msp: '₹1950', market: '₹1880', mandi: 'Sagar Mandi', trend: '-3.6%', volume: '280 Qt' },
      { crop: 'Soybean', msp: '₹4620', market: '₹4750', mandi: 'Indore Mandi', trend: '+2.8%', volume: '150 Qt' },
      { crop: 'Cotton', msp: '₹7100', market: '₹7250', mandi: 'Nagpur Mandi', trend: '+2.1%', volume: '90 Qt' }
    ],
    tasks: [
      { id: 1, title: 'Field F12 Irrigation', status: 'Pending', priority: 'High', due: 'Today 6PM', worker: 'Ramu' },
      { id: 2, title: 'Drone Survey F1-F5', status: 'In Progress', priority: 'Medium', due: 'Tomorrow 10AM', worker: 'Shyam' },
      { id: 3, title: 'Pest Control F19', status: 'Pending', priority: 'Critical', due: 'Today 4PM', worker: 'Mohan' },
      { id: 4, title: 'Soil Test F7-F10', status: 'Completed', priority: 'Low', due: 'Yesterday', worker: 'Sita' }
    ],
    inventory: [
      { name: 'DAP Fertilizer', stock: '450 Kg', used: '320 Kg', reorder: false, expiry: 'Apr 2026' },
      { name: 'Urea 46%', stock: '280 Kg', used: '210 Kg', reorder: true, expiry: 'Mar 2026' },
      { name: 'Imidacloprid', stock: '25 L', used: '18 L', reorder: false, expiry: 'Jun 2026' },
      { name: 'Mancozeb', stock: '15 Kg', used: '12 Kg', reorder: true, expiry: 'Feb 2026' }
    ],
    livestock: [
      { type: 'Cows', count: 12, health: 94, milk: '120 L/day', vaccine: 'Due Mar 2026' },
      { type: 'Buffaloes', count: 8, health: 88, milk: '85 L/day', vaccine: 'Done Jan 2026' },
      { type: 'Goats', count: 25, health: 91, weight: '28 Kg avg', vaccine: 'Due Feb 2026' }
    ]
  });

  return (
    <div className="farm-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo-section">
          <div className="logo-icon">🌾</div>
          <h1>NextAfield Precision Farming</h1>
          <div className="intern-badge">
            NAI25NOV01 | {farmData.season} | Project 8 | Shivam Singh
          </div>
        </div>
        <div className="farm-details">
          <h2>{farmData.name}</h2>
          <div className="farm-meta">
            <span>📏 {farmData.totalArea} | {farmData.fields} Fields</span>
            <span>📍 {farmData.location}</span>
            <span>⏰ {farmData.lastUpdate}</span>
            <span>📅 Next Harvest: {farmData.nextHarvest}</span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="stats-section">
        <h2 className="section-title">📊 Farm Performance (12 Key Metrics)</h2>
        <div className="stats-grid">
          {dashboardData.stats.map((stat, index) => (
            <FarmStatCard key={index} stat={stat} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="action-grid">
          <button className="action-btn primary">🚜 Deploy Drones (92%)</button>
          <button className="action-btn secondary">💧 Irrigation (68% Fields)</button>
          <button className="action-btn secondary">🌱 Fertilizer Schedule</button>
          <button className="action-btn secondary">📱 View 3 Alerts</button>
          <button className="action-btn primary">🛰️ Satellite Imagery</button>
          <button className="action-btn secondary">👨‍🌾 Assign 28 Workers</button>
        </div>
      </section>

      <main className="dashboard-content">
        {/* Yield Forecast */}
        <section className="chart-section">
          <h2>📈 Yield Forecast Q1 2026 (All 8 Crops)</h2>
          <div className="yield-charts">
            <YieldForecastChart />
            <TopPerformingCrops crops={dashboardData.crops.slice(0, 4)} />
          </div>
        </section>

        {/* Crops */}
        <section className="crops-section">
          <h2>🌾 Crops Dashboard (8 Active Crops • 245 Acres)</h2>
          <div className="crops-grid">
            {dashboardData.crops.map((crop, index) => (
              <EnhancedCropCard key={index} crop={crop} />
            ))}
          </div>
        </section>

        {/* Soil - FIXED */}
        <section className="soil-section">
          <h2>💧 Soil Health ({farmData.fields} Fields • Detailed Analysis)</h2>
          <div className="soil-content">
            <SoilStatusChart data={dashboardData.soil} totalFields={farmData.fields} />
            <div className="soil-details">
              <div className="soil-legend">
                {dashboardData.soil.map((soil, i) => (
                  <SoilLegendItem key={i} soil={soil} />
                ))}
              </div>
            </div>
            <div className="field-tiles-grid">
              {Array.from({ length: farmData.fields }, (_, i) => (
                <FieldTile key={i} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Weather */}
        <section className="weather-section">
          <h2>🌤️ 10-Day Weather Forecast</h2>
          <div className="weather-grid">
            {dashboardData.weather.map((day, index) => (
              <EnhancedWeatherCard key={index} day={day} />
            ))}
          </div>
        </section>

        {/* Market */}
        <section className="market-section">
          <h2>💰 Market Prices + Local Mandis (Today)</h2>
          <div className="market-grid">
            {dashboardData.market.map((price, index) => (
              <EnhancedMarketCard key={index} price={price} />
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="tasks-section">
          <h2>📋 Today's Farm Tasks (4 Active)</h2>
          <div className="tasks-grid">
            {dashboardData.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* Inventory */}
        <section className="inventory-section">
          <h2>📦 Fertilizer & Pesticide Inventory</h2>
          <div className="inventory-grid">
            {dashboardData.inventory.map((item, index) => (
              <InventoryCard key={index} item={item} />
            ))}
          </div>
        </section>

        {/* Livestock */}
        <section className="livestock-section">
          <h2>🐄 Livestock Health (45 Animals)</h2>
          <div className="livestock-grid">
            {dashboardData.livestock.map((animal, index) => (
              <LivestockCard key={index} animal={animal} />
            ))}
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>🌾 NextAfield Precision Farming | Shivam Organic Farm</p>
          <p>📊 245 Acres • 19 Fields • 8 Crops • 45 Livestock | NAI25NOV01</p>
          <p>⚡ Real-time IoT Data • Project 8 Complete • Jan 15, 2026</p>
        </div>
      </footer>
    </div>
  );
}

// FIXED Components - All Errors Resolved
const FarmStatCard = ({ stat }) => (
  <div className="farm-stat-card" style={{ borderTopColor: stat.color }}>
    <div className="stat-icon-container" style={{ backgroundColor: stat.color + '20' }}>
      <span className="stat-icon">{stat.icon}</span>
    </div>
    <div className="stat-details">
      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.title}</div>
      <div className="stat-progress">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${stat.progress}%`, 
              backgroundColor: stat.color 
            }} 
          />
        </div>
        <span className="progress-text">{stat.progress}%</span>
      </div>
      <div className={`stat-trend ${stat.trend.includes('+') ? 'positive' : ''}`}>
        {stat.trend} {stat.unit}
      </div>
    </div>
  </div>
);

const EnhancedCropCard = ({ crop }) => (
  <div className="crop-card" style={{ borderLeftColor: crop.color }}>
    <div className="crop-header">
      <span className="crop-icon">🌾</span>
      <h3>{crop.name}</h3>
      <span className={`status-badge ${crop.status.toLowerCase()}`}>
        {crop.status}
      </span>
    </div>
    <div className="crop-metrics">
      <div className="metric">
        <span>{crop.yield} Qt/Ac</span>
        <small>Yield</small>
      </div>
      <div className="metric">
        <span>{crop.area} Ac</span>
        <small>Area</small>
      </div>
      <div className="metric">
        <span>{crop.stage}</span>
        <small>Growth Stage</small>
      </div>
    </div>
    <div className="crop-status">
      <span>{crop.irrigated ? '💧 Irrigated' : '🌵 Rainfed'}</span>
      <span>🐛 {crop.pest}</span>
      <span>{crop.fertilizer}</span>
    </div>
  </div>
);
const YieldForecastChart = () => {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
  const primaryData = [22, 25, 28, 32, 35, 38];
  const secondaryData = [18, 20, 24, 27, 30, 34];
  const maxValue = 40;

  return (
    <div className="yield-chart">
      <div className="chart-title">
        📈 Q1 2026 Yield Forecast (8 Crops • Qt/Ac)
      </div>
      
      <div className="svg-chart-container">
        <svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet" className="yield-svg">
          {/* Clipping Path - FIXES OVERFLOW */}
          <defs>
            <clipPath id="chart-clip">
              <rect x="50" y="20" width="550" height="260"/>
            </clipPath>
          </defs>

          <g clipPath="url(#chart-clip)">
            {/* Grid Lines */}
            <g className="grid-lines">
              {[10, 20, 30, 40].map((value) => (
                <g key={value}>
                  <line 
                    x1="70" y1={60 + (1 - value/maxValue) * 220} 
                    x2="570" y2={60 + (1 - value/maxValue) * 220}
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="1"
                  />
                </g>
              ))}
            </g>

            {/* Primary Line (Paddy/Wheat) */}
            <polyline 
              points={primaryData.map((value, i) => 
                `${85 + i * 85},${60 + (1 - value/maxValue) * 220}`
              ).join(' ')}
              fill="none" 
              stroke="var(--accent-blue)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="primary-line"
            />
            
            {/* Secondary Line (Soybean/Cotton) */}
            <polyline 
              points={secondaryData.map((value, i) => 
                `${85 + i * 85},${60 + (1 - value/maxValue) * 220}`
              ).join(' ')}
              fill="none" 
              stroke="var(--primary-blue)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="secondary-line"
            />

            {/* Data Points - Primary (INSIDE BOUNDS) */}
            {primaryData.map((value, i) => (
              <g key={`p-${i}`}>
                <circle 
                  cx={85 + i * 85} 
                  cy={60 + (1 - value/maxValue) * 220}
                  r="6" 
                  fill="var(--accent-blue)"
                  stroke="white"
                  strokeWidth="2"
                  className="data-point primary-point"
                />
                {/* Label ABOVE point, INSIDE bounds */}
                <text 
                  x={85 + i * 85} 
                  y={45 + (1 - value/maxValue) * 220}
                  fontSize="11" 
                  fill="var(--white-text)"
                  textAnchor="middle"
                  fontWeight="700"
                  className="data-label"
                >
                  {value}
                </text>
              </g>
            ))}

            {/* Data Points - Secondary */}
            {secondaryData.map((value, i) => (
              <g key={`s-${i}`}>
                <circle 
                  cx={85 + i * 85} 
                  cy={60 + (1 - value/maxValue) * 220}
                  r="5" 
                  fill="var(--primary-blue)"
                  stroke="white"
                  strokeWidth="1.5"
                  className="data-point secondary-point"
                />
              </g>
            ))}
          </g>

          {/* X-Axis (Outside clip) */}
          <g className="x-axis">
            <line x1="70" y1="290" x2="570" y2="290" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            {weeks.map((week, i) => (
              <g key={week}>
                <line 
                  x1={85 + i * 85} 
                  y1="290" 
                  x2={85 + i * 85} 
                  y2="300" 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth="2"
                />
                <text 
                  x={85 + i * 85} 
                  y="310" 
                  fontSize="12" 
                  fill="var(--light-text)"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {week}
                </text>
              </g>
            ))}
          </g>

          {/* Y-Axis Labels */}
          <g>
            {[10, 20, 30, 40].map((value) => (
              <text 
                key={value}
                x="60" 
                y={60 + (1 - value/maxValue) * 220}
                fontSize="11" 
                fill="var(--light-text)"
                textAnchor="end"
              >
                {value}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item primary">
          <div className="legend-line primary"></div>
          <span>🌾 Paddy/Wheat</span>
          <span className="legend-trend">+18%</span>
        </div>
        <div className="legend-item secondary">
          <div className="legend-line secondary"></div>
          <span>🌱 Soybean/Cotton</span>
          <span className="legend-trend">+12%</span>
        </div>
      </div>
    </div>
  );
};


const TopPerformingCrops = ({ crops }) => (
  <div className="top-crops">
    <h4>🏆 Top 4 Crops</h4>
    {crops.map((crop, i) => (
      <div key={i} className="top-crop-item">
        <span>{i+1}.</span> {crop.name}: <strong>{crop.yield} Qt/Ac</strong>
      </div>
    ))}
  </div>
);

// ✅ FIXED SoilStatusChart - No more farmData error
const SoilStatusChart = ({ data, totalFields = 19 }) => (
  <div className="soil-doughnut">
    {data.map((item, index) => (
      <div key={index} className="doughnut-segment" style={{ '--color': item.color }} />
    ))}
    <div className="doughnut-center">
      <div>{totalFields} Fields</div>
      <div>{data.find(s => s.name.includes('Optimal'))?.fields || 12} Optimal</div>
    </div>
  </div>
);

const SoilLegendItem = ({ soil }) => (
  <div className="soil-legend-item" style={{ borderLeftColor: soil.color }}>
    <span>{soil.name}</span>
    <span>{soil.fields} Fields</span>
  </div>
);

const FieldTile = ({ index }) => {
  const statuses = ['optimal', 'dry', 'wet', 'critical'];
  const status = statuses[index % 4];
  return (
    <div className={`field-tile ${status}`}>
      <span>F{index + 1}</span>
    </div>
  );
};

const EnhancedWeatherCard = ({ day }) => (
  <div className="weather-card">
    <div>{day.condition}</div>
    <div>{day.day}</div>
    <div>{day.temp}°C</div>
    <div>🌧️ {day.rain}%</div>
    <div>💧 {day.humidity}%</div>
    <div>💨 {day.wind}</div>
  </div>
);

const EnhancedMarketCard = ({ price }) => (
  <div className="market-card">
    <h3>{price.crop}</h3>
    <div>MSP: ₹{price.msp}/Qt</div>
    <div>Market: ₹{price.market}/Qt</div>
    <div>{price.mandi}</div>
    <div>📦 {price.volume}</div>
    <span className={`trend ${price.trend.startsWith('+') ? 'positive' : 'negative'}`}>
      {price.trend}
    </span>
  </div>
);

const TaskCard = ({ task }) => (
  <div className={`task-card ${task.status.toLowerCase().replace(' ', '-')}`}>
    <h4>{task.title}</h4>
    <div className="task-meta">
      <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
      <span>Due: {task.due}</span>
      <span>👨‍🌾 {task.worker}</span>
    </div>
  </div>
);

const InventoryCard = ({ item }) => (
  <div className="inventory-card">
    <h4>{item.name}</h4>
    <div>📦 Stock: <strong>{item.stock}</strong></div>
    <div>✅ Used: {item.used}</div>
    <div className={item.reorder ? 'reorder-alert' : ''}>
      {item.reorder ? '⚠️ REORDER NOW' : '✅ In Stock'}
    </div>
    <div>📅 Expiry: {item.expiry}</div>
  </div>
);

const LivestockCard = ({ animal }) => (
  <div className="livestock-card">
    <h4>{animal.type}</h4>
    <div>🐄 Count: <strong>{animal.count}</strong></div>
    <div>❤️ Health: {animal.health}%</div>
    <div>{animal.milk || animal.weight}</div>
    <div>💉 {animal.vaccine}</div>
  </div>
);

export default App;
