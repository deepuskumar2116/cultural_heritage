# 🏛️ Cultural Heritage Tourism App - GitHub Deployment Guide

## 📋 Project Overview

A full-stack web application for exploring and managing cultural heritage sites. Admins can add cities, places, and amenities. Tourists can browse, view details, and submit reviews.

**Live Features**:
- 🔐 Admin & Tourist authentication
- 🏙️ City management (add, view, edit)
- 🏛️ Heritage place management
- 🏨 9 amenity categories (hotels, restaurants, temples, malls, etc.)
- ⭐ Review & rating system
- 📍 Google Maps integration
- 🌐 External links support

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/cultural-heritage.git
cd cultural-heritage
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

4. **Start the backend server** (Terminal 1)
```bash
cd server
npm run dev
# Backend runs on http://localhost:4000
```

5. **Start the frontend server** (Terminal 2)
```bash
cd client
npm start
# Frontend runs on http://localhost:5173
```

### Default Test Credentials
```
Admin:   admin / admin123
Tourist: testuser / test123
```

---

## 🏗️ Project Structure

```
cultural-heritage/
├── server/
│   ├── server.js              # Express backend with all APIs
│   ├── package.json
│   ├── db.sqlite              # SQLite database (auto-created)
│   └── uploads/               # Image storage for cities/places/amenities
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Admin/Tourist login & registration
│   │   │   ├── AdminDashboard.jsx  # Admin management panel
│   │   │   └── TouristHome.jsx     # Tourist browsing interface
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── services/
│   │   │   └── api.js         # API client with all endpoints
│   │   └── styles/            # CSS for all pages
│   ├── package.json
│   └── index.html
```

---

## 🔐 Admin Features After Deployment

After deploying to production, admins can:

### 1. **Add New Cities**
- Login with admin credentials
- Go to "Cities" section in dashboard
- Click "Add City"
- Enter name, description, upload image
- Save

### 2. **Add Heritage Places**
- Go to "Places" section
- Select city from dropdown
- Enter place name, description, address
- Upload place image
- Save

### 3. **Add Amenities** (9 Categories)
- Go to "Amenities" section
- Select city & amenity type (Bus, Flight, Train, Hotel, Restaurant, Cafe, Temple, Mall, Museum)
- Fill all details:
  - Name, description, address
  - Phone number
  - Website URL
  - Google Maps URL
  - Price range, rating
  - Upload image
- Save

### 4. **View Tourist Feedback**
- Go to "Feedback" section
- See all reviews/comments from tourists
- Manage feedback

---

## 📊 Database Schema

The app uses **SQLite** with automatic schema creation:

```
admin (id, username, password_hash, email)
tourist (id, name, username, password_hash, email, phone)
city (id, name, description, image_url)
place (id, city_id, name, description, address, image_url)
amenity_type (id, name) [9 pre-seeded types]
amenity (id, place_id, city_id, amenity_type_id, name, description, address, phone, website_url, google_maps_url, price_range, rating, image_url)
review (id, tourist_id, amenity_id, rating, comment)
feedback (id, tourist_id, comment)
```

Database is **auto-initialized** on first server start - no manual setup needed!

---

## 🎯 Image Upload Format

### Supported Formats
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ GIF (.gif)
- ✅ SVG (.svg)

### File Size Recommendation
- **Max**: 5MB per image
- **Recommended**: 1-3MB for faster loading
- **Optimal dimensions**: 800x600px or larger

### Upload Location
- Images are stored in `server/uploads/` directory
- Automatically served at `http://localhost:4000/api/uploads/filename`
- Persists across server restarts

---

## 🌐 Deployment Options

### **Option 1: Heroku (Recommended for Full Stack)**

1. **Create Heroku account** at https://heroku.com

2. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

3. **Create Procfile** in root directory
```
web: cd server && npm start
```

4. **Deploy**
```bash
heroku create YOUR-APP-NAME
git push heroku main
```

### **Option 2: Railway.app (Easy Deployment)**

1. **Connect GitHub repo** at https://railway.app
2. **Add Node environment**
3. **Set start command**: `cd server && npm start`
4. **Deploy automatically on push**

### **Option 3: Netlify (Frontend) + Railway (Backend)**

**Frontend (Netlify)**:
- Connect GitHub repo
- Build command: `npm run build`
- Publish directory: `dist`

**Backend (Railway)**:
- Connect GitHub repo
- Set start command: `cd server && npm start`

### **Option 4: Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

Deploy to Docker Hub, AWS ECS, or any container service.

---

## 🔑 Environment Variables (Optional)

Create `.env` in server directory for production:

```env
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=production
PORT=4000
```

---

## 📱 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/tourist/register` - Tourist registration
- `POST /api/auth/tourist/login` - Tourist login

### Cities (Admin)
- `GET /api/cities` - Get all cities
- `POST /api/admin/cities` - Create city (admin only)
- `GET /api/cities/:id` - Get city details

### Places (Admin)
- `GET /api/cities/:city_id/places` - Get places in city
- `POST /api/admin/places` - Create place (admin only)

### Amenities
- `GET /api/amenity-types` - Get all amenity types
- `GET /api/cities/:city_id/amenities?type_id=X` - Filter amenities
- `GET /api/amenities/:id` - Get amenity details
- `POST /api/admin/amenities` - Create amenity (admin only)

### Reviews
- `POST /api/reviews` - Submit review (tourist)
- `GET /api/amenities/:amenity_id/reviews` - Get reviews

### Feedback
- `POST /api/feedback` - Submit feedback (tourist)
- `GET /api/admin/feedback` - View all feedback (admin)

---

## 🛡️ Security Features

✅ **Implemented**:
- JWT token-based authentication
- Password hashing with bcryptjs (10 salt rounds)
- Protected routes (admin/tourist role-based access)
- CORS enabled for frontend access
- Input validation on backend

🔒 **Recommended for Production**:
- Use HTTPS only
- Set strong `JWT_SECRET` environment variable
- Implement rate limiting
- Add request validation
- Use HTTPS for external links
- Consider adding database encryption

---

## 📈 Performance Tips

1. **Image Optimization**
   - Compress images before upload (use ImageOptim or similar)
   - Use WebP format for modern browsers
   - Resize images to 800x600px minimum

2. **Database**
   - Add indexes on frequently queried columns (city_id, amenity_type_id)
   - Archive old reviews after N days

3. **Frontend**
   - Enable Vite build optimization
   - Lazy load images using `loading="lazy"`
   - Use React.memo for components

4. **Backend**
   - Enable gzip compression
   - Implement caching headers
   - Use connection pooling

---

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: |
          git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check backend is running on port 4000
- Verify CORS is enabled
- Check browser console (F12) for errors

### Images not displaying
- Verify image file format is supported
- Check file size is under 5MB
- Ensure image URL path is correct in database

### Admin login fails
- Check database has seeded admin account
- Verify password is hashed correctly
- Clear browser localStorage and try again

### Tourist can't register
- Check email format is valid
- Ensure username is unique
- Check phone number format

---

## 📞 Support & Contribution

### Report Issues
Create a GitHub Issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs

### Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎉 Ready to Deploy!

1. ✅ Push to GitHub
2. ✅ Connect to deployment platform
3. ✅ Deploy with one click
4. ✅ Admin can add content after deployment
5. ✅ Tourists can browse and review

**Happy deploying!** 🚀

