const express = require('express');
const cors = require('cors');
const path = require('path');
const QRCode = require('qrcode');
const multer = require('multer');
const fs = require('fs');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));
// Serve uploads from explicit API endpoint as well
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// --- DB setup ---
const dbFile = path.join(__dirname,'db.sqlite');
const db = new Database(dbFile);

// create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS tourist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT,
  phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS city (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS place (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city_id INTEGER,
  name TEXT,
  description TEXT,
  image_url TEXT,
  address TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(city_id) REFERENCES city(id)
);
CREATE TABLE IF NOT EXISTS amenity_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  icon TEXT
);
CREATE TABLE IF NOT EXISTS amenity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place_id INTEGER,
  city_id INTEGER,
  amenity_type_id INTEGER,
  name TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  website_url TEXT,
  google_maps_url TEXT,
  price_range TEXT,
  rating REAL,
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(place_id) REFERENCES place(id),
  FOREIGN KEY(city_id) REFERENCES city(id),
  FOREIGN KEY(amenity_type_id) REFERENCES amenity_type(id)
);
CREATE TABLE IF NOT EXISTS review (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tourist_id INTEGER,
  amenity_id INTEGER,
  rating INTEGER,
  comment TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(tourist_id) REFERENCES tourist(id),
  FOREIGN KEY(amenity_id) REFERENCES amenity(id)
);
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tourist_id INTEGER,
  comment TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(tourist_id) REFERENCES tourist(id)
);
`);

// Seed amenity types
const amenityTypes = ['Bus Service', 'Flight', 'Train', 'Hotel', 'Restaurant', 'Cafe/Bar', 'Temple', 'Mall', 'Museum'];
amenityTypes.forEach(type => {
  const exists = db.prepare('SELECT COUNT(*) as c FROM amenity_type WHERE name = ?').get(type).c;
  if (!exists) {
    db.prepare('INSERT INTO amenity_type (name) VALUES (?)').run(type);
  }
});

// Seed admin if none
const adminCount = db.prepare('SELECT COUNT(*) as c FROM admin').get().c;
if (adminCount === 0) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin (username,password,email) VALUES (?,?,?)').run('admin', hashedPassword, 'admin@cultural-heritage.com');
  console.log('✓ Seeded admin (admin/admin123)');
}

// Seed test tourist account
const touristCount = db.prepare('SELECT COUNT(*) as c FROM tourist WHERE username = ?').get('testuser').c;
if (touristCount === 0) {
  const hashedPassword = bcrypt.hashSync('test123', 10);
  db.prepare('INSERT INTO tourist (name, username, password, email, phone) VALUES (?,?,?,?,?)').run('Test User', 'testuser', hashedPassword, 'test@cultural-heritage.com', '+91-9999999999');
  console.log('✓ Seeded test tourist (testuser/test123)');
}

// Seed Bengaluru example data
const cityCount = db.prepare('SELECT COUNT(*) as c FROM city WHERE name = ?').get('Bengaluru').c;
if (cityCount === 0) {
  const cityInfo = db.prepare(`
    INSERT INTO city (name, description, image_url) VALUES (?,?,?)
  `).run(
    'Bengaluru',
    'The Silicon Valley of India - A vibrant metropolis blending IT innovation with rich cultural heritage, famous for its IT parks, gardens, palaces, and modern infrastructure.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Vidhana_Soudha.JPG/1024px-Southwest_corner_of_Vidhana_Soudha.JPG'
  );
  
  const bengaluruCityId = cityInfo.lastInsertRowid;
  console.log('✓ Seeded Bengaluru city');

  // Add heritage places
  const places = [
    { name: 'Vidhana Soudha', desc: 'Iconic neo-Dravidian architecture housing the Karnataka State Legislature', addr: 'Vidhana Soudha, Bengaluru' },
    { name: 'Tippu Sultan\'s Palace', desc: 'Historic wooden palace of Tippu Sultan, a symbol of Mysore royal heritage', addr: 'Tippu Sultan Road, Bengaluru' },
    { name: 'Sri Ranganathaswamy Temple', desc: 'Ancient Hindu temple dedicated to Lord Ranganatha', addr: 'Basavanagudi, Bengaluru' },
    { name: 'Cubbon Park', desc: 'Victorian-era urban park with museums and monuments', addr: 'Kasturba Road, Bengaluru' },
    { name: 'Bangalore Fort', desc: 'Historical fort built by Kempegowda I, the founder of Bangalore', addr: 'Fort Area, Bengaluru' }
  ];

  places.forEach(place => {
    const placeInfo = db.prepare(`
      INSERT INTO place (city_id, name, description, address, image_url) VALUES (?,?,?,?,?)
    `).run(bengaluruCityId, place.name, place.desc, place.addr, 'https://via.placeholder.com/400x300');
    console.log(`  ✓ Added place: ${place.name}`);
  });

  // Get place IDs for amenities
  const placeIds = db.prepare('SELECT id FROM place WHERE city_id = ? LIMIT 5').all(bengaluruCityId).map(p => p.id);
  
  // Get amenity type IDs
  const busTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Bus Service').id;
  const flightTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Flight').id;
  const trainTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Train').id;
  const hotelTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Hotel').id;
  const restaurantTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Restaurant').id;
  const cafeTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Cafe/Bar').id;
  const templeTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Temple').id;
  const mallTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Mall').id;
  const museumTypeId = db.prepare('SELECT id FROM amenity_type WHERE name = ?').get('Museum').id;

  // Bus Services
  const busServices = [
    { name: 'Bengaluru Metropolitan Transport Corporation (BMTC)', type: busTypeId, desc: 'Main public transport operator for buses in Bengaluru', addr: 'BMTC Head Office, Shantinagar, Bengaluru', phone: '+91-80-2235-7777', web: 'https://www.bmtckarnataka.com', maps: 'https://goo.gl/maps/BMTC', price: 'Free-50₹', rating: 4.2 },
    { name: 'Volvo Air-Conditioned Buses (BMTC AC)', type: busTypeId, desc: 'Premium air-conditioned bus service with reserved seats', addr: 'BMTC Bus Stands - Multiple locations', phone: '+91-80-2235-7777', web: 'https://www.bmtckarnataka.com', maps: 'https://goo.gl/maps/BMTC', price: '50-100₹', rating: 4.5 },
    { name: 'Shuttle Service to Airport', type: busTypeId, desc: 'Direct shuttle service from city center to Kempegowda Airport', addr: 'Bengaluru City Railway Station', phone: '+91-80-6666-6666', web: 'https://kempegowdaairport.com', maps: 'https://goo.gl/maps/Airport', price: '200-400₹', rating: 4.6 }
  ];

  busServices.forEach(bus => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[0] || null, bengaluruCityId, bus.type, bus.name, bus.desc, bus.addr, bus.phone, bus.web, bus.maps, bus.price, bus.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added bus: ${bus.name}`);
  });

  // Flights
  const flights = [
    { name: 'Kempegowda International Airport - IndiGo', type: flightTypeId, desc: 'Major domestic and international flights with IndiGo airline', addr: 'Kempegowda International Airport, Bengaluru', phone: '+91-80-6666-6666', web: 'https://www.indigo.in', maps: 'https://goo.gl/maps/Indigo', price: '3000-15000₹', rating: 4.7 },
    { name: 'Kempegowda International Airport - Air India', type: flightTypeId, desc: 'National carrier with extensive network of flights', addr: 'Kempegowda International Airport, Bengaluru', phone: '+91-80-6666-6666', web: 'https://www.airindia.in', maps: 'https://goo.gl/maps/AirIndia', price: '3500-20000₹', rating: 4.5 },
    { name: 'Kempegowda International Airport - SpiceJet', type: flightTypeId, desc: 'Budget airline with competitive prices', addr: 'Kempegowda International Airport, Bengaluru', phone: '+91-80-6666-6666', web: 'https://www.spicejet.com', maps: 'https://goo.gl/maps/SpiceJet', price: '2500-12000₹', rating: 4.3 }
  ];

  flights.forEach(flight => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[1] || null, bengaluruCityId, flight.type, flight.name, flight.desc, flight.addr, flight.phone, flight.web, flight.maps, flight.price, flight.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added flight: ${flight.name}`);
  });

  // Trains
  const trains = [
    { name: 'Bangalore City Railway Station', type: trainTypeId, desc: 'Main railway station with trains to major Indian cities', addr: 'Bangalore City Station, Nampally, Bengaluru', phone: '+91-80-2287-0000', web: 'https://www.indianrailways.gov.in', maps: 'https://goo.gl/maps/BCity', price: '100-2000₹', rating: 4.1 },
    { name: 'Krantiveera Sangolli Rayanna Railway Station', type: trainTypeId, desc: 'Major railway hub with express trains and sleeping coaches', addr: 'Krantiveera Sangolli Rayanna Station, Bengaluru', phone: '+91-80-2287-0000', web: 'https://www.indianrailways.gov.in', maps: 'https://goo.gl/maps/KSRStation', price: '150-3000₹', rating: 4.2 },
    { name: 'Shatabdi Express to Chennai', type: trainTypeId, desc: 'Fast intercity express connecting Bengaluru to Chennai', addr: 'Bangalore City Station, Bengaluru', phone: '+91-80-2287-0000', web: 'https://www.indianrailways.gov.in', maps: 'https://goo.gl/maps/Shatabdi', price: '500-800₹', rating: 4.4 }
  ];

  trains.forEach(train => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[2] || null, bengaluruCityId, train.type, train.name, train.desc, train.addr, train.phone, train.web, train.maps, train.price, train.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added train: ${train.name}`);
  });

  // Hotels
  const hotels = [
    { name: 'The Leela Palace Bengaluru', type: hotelTypeId, desc: 'Luxurious 5-star palace hotel with world-class amenities', addr: 'Race Course Road, Bengaluru', phone: '+91-80-2521-1111', web: 'https://www.theleela.com', maps: 'https://goo.gl/maps/LeelaHotel', price: '₹15000-30000', rating: 4.9 },
    { name: 'JW Marriott Bengaluru', type: hotelTypeId, desc: 'Premium 5-star hotel in the heart of Bengaluru', addr: 'Vittal Mallya Road, Bengaluru', phone: '+91-80-4095-5555', web: 'https://www.marriott.com', maps: 'https://goo.gl/maps/Marriott', price: '₹12000-25000', rating: 4.8 },
    { name: 'Radisson Blu Hotel Bengaluru', type: hotelTypeId, desc: 'Modern 4-star hotel with excellent service and facilities', addr: 'Residency Road, Bengaluru', phone: '+91-80-4242-4242', web: 'https://www.radissonblu.com', maps: 'https://goo.gl/maps/Radisson', price: '₹8000-15000', rating: 4.7 },
    { name: 'The Oberoi Bengaluru', type: hotelTypeId, desc: 'Elegant luxury hotel with traditional Indian hospitality', addr: '39-40, Golf Avenue, St. Marks Road, Bengaluru', phone: '+91-80-2532-5858', web: 'https://www.theoberoihotels.com', maps: 'https://goo.gl/maps/Oberoi', price: '₹10000-20000', rating: 4.8 }
  ];

  hotels.forEach(hotel => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[3] || null, bengaluruCityId, hotel.type, hotel.name, hotel.desc, hotel.addr, hotel.phone, hotel.web, hotel.maps, hotel.price, hotel.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added hotel: ${hotel.name}`);
  });

  // Restaurants
  const restaurants = [
    { name: 'Karavali by Vivanta', type: restaurantTypeId, desc: 'Fine dining with authentic coastal cuisine from Kerala', addr: 'Bangalore Hilton, White Field, Bengaluru', phone: '+91-80-6804-4444', web: 'https://www.karavali.com', maps: 'https://goo.gl/maps/Karavali', price: '₹800-2000', rating: 4.6 },
    { name: 'Nagarjuna', type: restaurantTypeId, desc: 'Traditional Andhra cuisine with famous biryani and curries', addr: 'Indiranagar, Bengaluru', phone: '+91-80-2527-8188', web: 'https://nagarjuna.in', maps: 'https://goo.gl/maps/Nagarjuna', price: '₹400-1200', rating: 4.5 },
    { name: 'Mavalli Tiffin Room (MTR)', type: restaurantTypeId, desc: 'Iconic restaurant serving traditional South Indian breakfast since 1924', addr: 'Lalbagh Road, Bengaluru', phone: '+91-80-2222-0022', web: 'https://www.mtrg.in', maps: 'https://goo.gl/maps/MTR', price: '₹200-600', rating: 4.7 },
    { name: 'Biere Club', type: restaurantTypeId, desc: 'German brewery and grill restaurant with craft beers and steaks', addr: 'Indiranagar, Bengaluru', phone: '+91-80-4000-9999', web: 'https://www.biereclub.com', maps: 'https://goo.gl/maps/BiereClub', price: '₹1000-2500', rating: 4.5 }
  ];

  restaurants.forEach(restaurant => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[4] || null, bengaluruCityId, restaurant.type, restaurant.name, restaurant.desc, restaurant.addr, restaurant.phone, restaurant.web, restaurant.maps, restaurant.price, restaurant.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added restaurant: ${restaurant.name}`);
  });

  // Cafes/Bars
  const cafes = [
    { name: 'Cafe Coffee Day', type: cafeTypeId, desc: 'India\'s largest coffee chain with cozy ambiance', addr: 'Multiple locations across Bengaluru', phone: '+91-80-4142-4142', web: 'https://www.cafecoffeeday.com', maps: 'https://goo.gl/maps/CCD', price: '₹100-300', rating: 4.4 },
    { name: 'The Black Sheep Bakery', type: cafeTypeId, desc: 'Artisanal bakery with fresh pastries and specialty coffees', addr: 'Indiranagar, Bengaluru', phone: '+91-80-2527-2288', web: 'https://theblacksheepcafe.com', maps: 'https://goo.gl/maps/BlackSheep', price: '₹150-400', rating: 4.7 },
    { name: 'Toit Brewpub', type: cafeTypeId, desc: 'Popular microbrewery with craft beers and pub food', addr: 'Indiranagar, Bengaluru', phone: '+91-80-4141-4141', web: 'https://www.toitbrew.com', maps: 'https://goo.gl/maps/Toit', price: '₹300-800', rating: 4.6 },
    { name: 'Arbor Brewing Company', type: cafeTypeId, desc: 'Craft brewery with experimental beers and gastropub menu', addr: 'Koramangala, Bengaluru', phone: '+91-80-5555-0000', web: 'https://arborbrewing.com', maps: 'https://goo.gl/maps/Arbor', price: '₹400-1000', rating: 4.5 }
  ];

  cafes.forEach(cafe => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[0] || null, bengaluruCityId, cafe.type, cafe.name, cafe.desc, cafe.addr, cafe.phone, cafe.web, cafe.maps, cafe.price, cafe.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added cafe: ${cafe.name}`);
  });

  // Temples
  const temples = [
    { name: 'Sri Ranganathaswamy Temple', type: templeTypeId, desc: 'Ancient Hindu temple with intricate Dravidian architecture', addr: 'Basavanagudi, Bengaluru', phone: '+91-80-2661-2287', web: 'https://ranganathaswamytemple.org', maps: 'https://goo.gl/maps/Ranganatha', price: 'Free', rating: 4.6 },
    { name: 'Sri Krishnarajendra Temple', type: templeTypeId, desc: 'Historic temple dedicated to Lord Krishna with beautiful carvings', addr: 'Puttenhalli, Bengaluru', phone: '+91-80-2660-6587', web: 'https://krishnarajendra.org', maps: 'https://goo.gl/maps/KrishnaTem', price: 'Free', rating: 4.5 },
    { name: 'Sri Veerabhadreshwara Temple', type: templeTypeId, desc: 'Ancient Shiva temple with spiritual significance', addr: 'Kempegowda Nagar, Bengaluru', phone: '+91-80-2667-4455', web: 'https://veerabhadra.org', maps: 'https://goo.gl/maps/Veerabhadra', price: 'Free', rating: 4.4 }
  ];

  temples.forEach(temple => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[1] || null, bengaluruCityId, temple.type, temple.name, temple.desc, temple.addr, temple.phone, temple.web, temple.maps, temple.price, temple.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added temple: ${temple.name}`);
  });

  // Malls
  const malls = [
    { name: 'Phoenix Market City', type: mallTypeId, desc: 'Premium shopping mall with international and local brands', addr: 'Whitefield, Bengaluru', phone: '+91-80-4903-9999', web: 'https://www.phoenixmarketcity.com', maps: 'https://goo.gl/maps/Phoenix', price: 'Free', rating: 4.6 },
    { name: 'Garuda Mall', type: mallTypeId, desc: 'Upscale shopping destination with luxury brands and dining', addr: 'Koramangala, Bengaluru', phone: '+91-80-2552-5999', web: 'https://garudamall.com', maps: 'https://goo.gl/maps/Garuda', price: 'Free', rating: 4.5 },
    { name: 'Forum Value Mall', type: mallTypeId, desc: 'Budget-friendly shopping mall with popular retail outlets', addr: 'Whitefield, Bengaluru', phone: '+91-80-4903-7777', web: 'https://www.forumvaluemall.com', maps: 'https://goo.gl/maps/ForumValue', price: 'Free', rating: 4.4 },
    { name: 'UB City', type: mallTypeId, desc: 'Iconic business and entertainment destination with premium stores', addr: 'Minsk Square, Bengaluru', phone: '+91-80-2218-4444', web: 'https://ubcitybangalore.com', maps: 'https://goo.gl/maps/UBCity', price: 'Free', rating: 4.7 }
  ];

  malls.forEach(mall => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[2] || null, bengaluruCityId, mall.type, mall.name, mall.desc, mall.addr, mall.phone, mall.web, mall.maps, mall.price, mall.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added mall: ${mall.name}`);
  });

  // Museums
  const museums = [
    { name: 'Visvesvaraya Industrial and Technological Museum', type: museumTypeId, desc: 'Museum showcasing Indian science and technology achievements', addr: 'Kasturba Road, Bengaluru', phone: '+91-80-2286-4947', web: 'https://visvesvaraya.nic.in', maps: 'https://goo.gl/maps/Visvesvaraya', price: '₹40-200', rating: 4.5 },
    { name: 'Government Museum', type: museumTypeId, desc: 'Historic museum with artifacts from medieval and Mughal periods', addr: 'Cubbon Park, Bengaluru', phone: '+91-80-2286-8891', web: 'https://bengalurumuseum.gov.in', maps: 'https://goo.gl/maps/GovMuseum', price: '₹50-150', rating: 4.4 },
    { name: 'Innovative Film City', type: museumTypeId, desc: 'Museum celebrating Indian cinema with interactive exhibits', addr: 'Bidadi, Bengaluru', phone: '+91-80-2722-2333', web: 'https://innovativefilmcity.com', maps: 'https://goo.gl/maps/FilmCity', price: '₹100-300', rating: 4.3 }
  ];

  museums.forEach(museum => {
    db.prepare(`
      INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(placeIds[3] || null, bengaluruCityId, museum.type, museum.name, museum.desc, museum.addr, museum.phone, museum.web, museum.maps, museum.price, museum.rating, 'https://via.placeholder.com/300x200');
    console.log(`    ✓ Added museum: ${museum.name}`);
  });

  console.log('✓ Seeded complete Bengaluru data with 30+ amenities across all categories');
}

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    req.user = user;
    next();
  });
};

// file upload
const uploadDir = path.join(__dirname,'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, uploadDir),
  filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({storage});

// -------- AUTH APIs --------

// Admin Login
app.post('/api/auth/admin/login', (req,res)=>{
  const {username, password} = req.body;
  if (!username || !password) return res.status(400).json({error: 'Username and password required'});
  
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({error: 'Invalid credentials'});
  }
  
  const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ 
    ok: true, 
    token, 
    admin: { id: admin.id, username: admin.username, email: admin.email }
  });
});

// Tourist Register
app.post('/api/auth/tourist/register', (req,res)=>{
  const {name, username, password, email, phone} = req.body;
  if (!name || !username || !password || !email) {
    return res.status(400).json({error: 'Name, username, password, and email required'});
  }
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const info = db.prepare('INSERT INTO tourist (name, username, password, email, phone) VALUES(?,?,?,?,?)').run(name, username, hashedPassword, email, phone);
    res.json({ ok: true, id: info.lastInsertRowid });
  } catch(e){
    res.status(400).json({error: 'Username already exists'});
  }
});

// Tourist Login
app.post('/api/auth/tourist/login', (req,res)=>{
  const {username, password} = req.body;
  if (!username || !password) return res.status(400).json({error: 'Username and password required'});
  
  const tourist = db.prepare('SELECT * FROM tourist WHERE username = ?').get(username);
  if (!tourist || !bcrypt.compareSync(password, tourist.password)) {
    return res.status(401).json({error: 'Invalid credentials'});
  }
  
  const token = jwt.sign({ id: tourist.id, username: tourist.username, role: 'tourist', name: tourist.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ 
    ok: true, 
    token, 
    tourist: { id: tourist.id, name: tourist.name, username: tourist.username, email: tourist.email }
  });
});

// -------- CITY APIs (Admin) --------

// Create City
app.post('/api/admin/cities', authenticateAdmin, upload.single('image'), (req,res)=>{
  const {name, description} = req.body;
  const image_url = req.file ? `/api/uploads/${req.file.filename}` : null;
  
  try {
    const info = db.prepare('INSERT INTO city (name, description, image_url) VALUES(?,?,?)').run(name, description, image_url);
    res.json({ ok: true, id: info.lastInsertRowid, image_url });
  } catch(e){
    res.status(400).json({error: 'City already exists'});
  }
});

// Get all cities
app.get('/api/cities', (req,res)=>{
  const cities = db.prepare('SELECT * FROM city ORDER BY name').all();
  res.json(cities);
});

// Get city details
app.get('/api/cities/:id', (req,res)=>{
  const city = db.prepare('SELECT * FROM city WHERE id = ?').get(req.params.id);
  if (!city) return res.status(404).json({error: 'City not found'});
  res.json(city);
});

// -------- PLACE APIs (Admin) --------

// Create Place
app.post('/api/admin/places', authenticateAdmin, upload.single('image'), (req,res)=>{
  const {city_id, name, description, address} = req.body;
  const image_url = req.file ? `/api/uploads/${req.file.filename}` : null;
  
  try {
    const info = db.prepare('INSERT INTO place (city_id, name, description, image_url, address) VALUES(?,?,?,?,?)').run(city_id, name, description, image_url, address);
    res.json({ ok: true, id: info.lastInsertRowid });
  } catch(e){
    res.status(400).json({error: e.message});
  }
});

// Get places by city
app.get('/api/cities/:city_id/places', (req,res)=>{
  const places = db.prepare('SELECT * FROM place WHERE city_id = ? ORDER BY name').all(req.params.city_id);
  res.json(places);
});

// -------- AMENITY APIs --------

// Create Amenity (Admin)
app.post('/api/admin/amenities', authenticateAdmin, upload.single('image'), (req,res)=>{
  const {place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating} = req.body;
  const image_url = req.file ? `/api/uploads/${req.file.filename}` : null;
  
  try {
    const info = db.prepare(`INSERT INTO amenity (place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url) 
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).run(place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url);
    res.json({ ok: true, id: info.lastInsertRowid });
  } catch(e){
    res.status(400).json({error: e.message});
  }
});

// Get amenities by city and type
app.get('/api/cities/:city_id/amenities', (req,res)=>{
  const { type_id } = req.query;
  let query = 'SELECT a.*, at.name as type_name FROM amenity a LEFT JOIN amenity_type at ON a.amenity_type_id = at.id WHERE a.city_id = ?';
  let params = [req.params.city_id];
  
  if (type_id) {
    query += ' AND a.amenity_type_id = ?';
    params.push(type_id);
  }
  
  query += ' ORDER BY a.name';
  const amenities = db.prepare(query).all(...params);
  res.json(amenities);
});

// Get amenity details
app.get('/api/amenities/:id', (req,res)=>{
  const amenity = db.prepare(`SELECT a.*, at.name as type_name FROM amenity a 
    LEFT JOIN amenity_type at ON a.amenity_type_id = at.id 
    WHERE a.id = ?`).get(req.params.id);
  if (!amenity) return res.status(404).json({error: 'Amenity not found'});
  res.json(amenity);
});

// Get amenity types
app.get('/api/amenity-types', (req,res)=>{
  const types = db.prepare('SELECT * FROM amenity_type ORDER BY name').all();
  res.json(types);
});

// -------- REVIEW APIs --------

// Add Review
app.post('/api/reviews', authenticateToken, (req,res)=>{
  const {amenity_id, rating, comment} = req.body;
  
  try {
    const info = db.prepare('INSERT INTO review (tourist_id, amenity_id, rating, comment) VALUES(?,?,?,?)').run(req.user.id, amenity_id, rating, comment);
    res.json({ ok: true, id: info.lastInsertRowid });
  } catch(e){
    res.status(400).json({error: e.message});
  }
});

// Get reviews for amenity
app.get('/api/amenities/:amenity_id/reviews', (req,res)=>{
  const reviews = db.prepare(`SELECT r.*, t.name as tourist_name FROM review r 
    LEFT JOIN tourist t ON r.tourist_id = t.id 
    WHERE r.amenity_id = ? 
    ORDER BY r.created_at DESC`).all(req.params.amenity_id);
  res.json(reviews);
});

// -------- FEEDBACK API --------

// Submit feedback
app.post('/api/feedback', authenticateToken, (req,res)=>{
  const {comment} = req.body;
  
  try {
    const info = db.prepare('INSERT INTO feedback (tourist_id, comment) VALUES(?,?)').run(req.user.id, comment);
    res.json({ ok: true, id: info.lastInsertRowid });
  } catch(e){
    res.status(400).json({error: e.message});
  }
});

// Get all feedback (Admin)
app.get('/api/admin/feedback', authenticateAdmin, (req,res)=>{
  const feedback = db.prepare(`SELECT f.*, t.name as tourist_name FROM feedback f 
    LEFT JOIN tourist t ON f.tourist_id = t.id 
    ORDER BY f.created_at DESC`).all();
  res.json(feedback);
});

// -------- START SERVER --------
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`✓ Server running on http://localhost:${PORT}`));
