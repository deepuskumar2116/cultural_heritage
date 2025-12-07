# 🏛️ Cultural Heritage Tourism App

A full-stack application for exploring and managing cultural heritage sites across India with comprehensive tourist information including transportation, dining, accommodations, and attractions.

## 🚀 Quick Start

### Backend Setup
```bash
cd server
npm install
npm run dev    # Runs on http://localhost:4000
```

### Frontend Setup
```bash
cd client
npm install
npm start      # Runs on http://localhost:5173
```

---

## 📋 Features Overview

### 🔐 Authentication
- **Admin Login**: Username: `admin` | Password: `admin123`
- **Tourist Registration**: Create new account with email and phone
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different dashboards for admin and tourists

### 👨‍💼 Admin Dashboard Features

#### 1. **Manage Cities**
- Add new cities/destinations
- Upload city images
- Write detailed city descriptions
- View all cities in the system

#### 2. **Manage Places** (Coming Soon)
- Add heritage sites/places within cities
- Link places to cities
- Upload place images
- Add detailed descriptions

#### 3. **Manage Amenities**
Categories include:
- 🚌 **Bus Services**: Local & inter-city bus routes with timings
- ✈️ **Flights**: Flight routes and schedules
- 🚂 **Trains**: Train services and timetables
- 🏨 **Hotels**: Accommodation options with pricing
- 🍽️ **Restaurants**: Dining establishments & famous food itineraries
- ☕ **Cafes/Bars**: Coffee shops and bars
- 🛕 **Temples**: Religious and heritage temples
- 🏬 **Malls**: Shopping destinations
- 🏛️ **Museums**: Cultural museums and galleries

For each amenity, admins can add:
- Name and description
- Address and phone number
- Website URL (for official websites)
- Google Maps URL (for easy navigation)
- Price range (e.g., Budget, Mid-range, Premium)
- Rating (1-5 stars)
- Images

#### 4. **View Feedback**
- See all tourist reviews and feedback
- Submitted feedback with timestamps
- Tourist names and feedback details

### 👤 Tourist Dashboard Features

#### 1. **Explore Cities**
- Browse all available cities
- View city images and descriptions
- Select a city to explore

#### 2. **Browse by Category**
Once a city is selected:
- 🚌 View all bus routes and timings
- ✈️ Browse flight options
- 🚂 Check train schedules
- 🏨 Find hotels and accommodations
- 🍽️ Discover restaurants and food specialties
- ☕ Locate cafes and bars
- 🛕 Find temples and religious sites
- 🏬 Browse shopping malls
- 🏛️ Explore museums

#### 3. **View Details & Links**
For each amenity, tourists can:
- 📍 View full address
- 📞 See contact phone number
- 💰 Check price range
- ⭐ View community ratings
- 🌐 Visit official website
- 🗺️ Open Google Maps for directions

#### 4. **Leave Reviews**
- Rate amenities (1-5 stars)
- Write detailed reviews
- Share experiences with other travelers
- View reviews from other tourists

---

## 🗄️ Database Schema

### Tables

**admin** - Admin user accounts
- id, username, password (hashed), email, created_at

**tourist** - Tourist user accounts
- id, name, username, password (hashed), email, phone, created_at

**city** - Cities/Destinations
- id, name, description, image_url, created_at

**place** - Heritage sites/Places (within cities)
- id, city_id, name, description, image_url, address, created_at

**amenity_type** - Categories of amenities
- id, name, icon

**amenity** - Individual amenities
- id, place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url, created_at

**review** - Tourist reviews
- id, tourist_id, amenity_id, rating, comment, created_at

**feedback** - General feedback/suggestions
- id, tourist_id, comment, created_at

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/tourist/register` - Tourist registration
- `POST /api/auth/tourist/login` - Tourist login

### Cities
- `GET /api/cities` - Get all cities
- `GET /api/cities/:id` - Get city details
- `POST /api/admin/cities` - Create city (Admin)

### Places
- `GET /api/cities/:city_id/places` - Get places in a city
- `POST /api/admin/places` - Create place (Admin)

### Amenities
- `GET /api/amenity-types` - Get all amenity categories
- `GET /api/cities/:city_id/amenities?type_id=X` - Get amenities by city and type
- `GET /api/amenities/:id` - Get amenity details
- `POST /api/admin/amenities` - Create amenity (Admin)

### Reviews
- `POST /api/reviews` - Add review (Tourist)
- `GET /api/amenities/:amenity_id/reviews` - Get reviews for amenity

### Feedback
- `POST /api/feedback` - Submit feedback (Tourist)
- `GET /api/admin/feedback` - View all feedback (Admin)

---

## 🎨 UI Features

### Login Page
- Beautiful gradient background
- Toggle between Admin and Tourist modes
- Register form with validation
- Demo credentials display for admin

### Admin Dashboard
- Sidebar navigation with 4 main sections
- Form-based city creation
- Responsive grid layouts
- Admin user profile with logout

### Tourist Home
- City card selection with images
- Category-based amenity browsing
- Detailed modal with full amenity information
- Review submission form
- Direct links to websites and Google Maps
- Responsive mobile-friendly design

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with gradients and animations
- **Vite** - Development server and bundler

---

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (600px - 1200px)
- Mobile (< 600px)

---

## 🔒 Security Features

- Passwords hashed using bcryptjs
- JWT token-based authentication
- Protected routes for authenticated users
- Role-based access control (admin vs tourist)
- Token stored in localStorage with 7-day expiry

---

## 📝 Example Data Flow

### Admin Adding a City
1. Admin logs in with credentials
2. Goes to "Manage Cities" tab
3. Fills city name, description, and uploads image
4. City appears in tourist's city list

### Tourist Exploring
1. Tourist logs in
2. Selects a city
3. Chooses an amenity category
4. Views amenities and clicks on one
5. See details and external links
6. Can submit a review with rating

---

## 🚧 Future Enhancements

- [ ] Advanced search and filtering
- [ ] Favorites/bookmarks
- [ ] Trip planning itineraries
- [ ] Interactive maps integration
- [ ] Photo gallery with tourist uploads
- [ ] Real-time notifications
- [ ] Social features (follow, messaging)
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration for bookings

---

## 🤝 Development Notes

### Project Structure
```
cultural-heritage/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # React components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS files
│   │   └── app.jsx        # Main app component
│   └── package.json
│
└── server/                 # Node.js backend
    ├── server.js          # Express app
    ├── db.sqlite          # SQLite database
    └── uploads/           # Image/file storage
```

### Making Changes

When updating API endpoints:
1. Update server.js API route
2. Update API service in client/src/services/api.js
3. Update frontend component to use new API

---

## 🎯 Testing Checklist

- [ ] Admin login works
- [ ] Tourist registration works
- [ ] Tourist login works
- [ ] Admin can add cities
- [ ] Admin can add amenities
- [ ] Tourist can view cities
- [ ] Tourist can browse amenities by type
- [ ] Tourist can view amenity details
- [ ] Tourist can submit reviews
- [ ] External links (website, maps) work
- [ ] Responsive design on mobile
- [ ] Token persists on refresh
- [ ] Logout clears session

---

## 📞 Support

For issues or questions, refer to:
- Backend logs in terminal running server
- Browser console for frontend errors
- API endpoint responses in network tab

---

**Made with ❤️ for Cultural Heritage Tourism**
