# 🚀 Quick Reference Commands

## Starting the App

### Terminal 1: Backend
```powershell
cd c:\Users\Deepu s kumar\Documents\cultural-heritage\server
npm run dev
# Should show: ✓ Server running on http://localhost:4000
```

### Terminal 2: Frontend
```powershell
cd c:\Users\Deepu s kumar\Documents\cultural-heritage\client
npm start
# Should show: ➜ Local: http://localhost:5173/
```

### Access App
```
Open browser to: http://localhost:5173
```

---

## 🔐 Default Credentials

### Admin
```
Username: admin
Password: admin123
```

### Tourist (Create Your Own)
```
Register from login page
Or create multiple for testing
```

---

## 📝 Key URLs

| Purpose | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000 |
| Login Page | http://localhost:5173/login |
| Admin Dashboard | http://localhost:5173/admin/dashboard |
| Tourist Home | http://localhost:5173/tourist/home |

---

## 🔗 Important API Endpoints

### Authentication
```
POST http://localhost:4000/api/auth/admin/login
POST http://localhost:4000/api/auth/tourist/register
POST http://localhost:4000/api/auth/tourist/login
```

### Data Management
```
GET http://localhost:4000/api/cities
POST http://localhost:4000/api/admin/cities
GET http://localhost:4000/api/amenity-types
POST http://localhost:4000/api/admin/amenities
GET http://localhost:4000/api/cities/{id}/amenities
POST http://localhost:4000/api/reviews
GET http://localhost:4000/api/amenities/{id}/reviews
```

---

## 📂 Important File Locations

### Frontend Components
```
client/src/pages/
  - Login.jsx              ← Auth page
  - AdminDashboard.jsx     ← Admin panel
  - TouristHome.jsx        ← Tourist exploration

client/src/services/
  - api.js                 ← API calls

client/src/styles/
  - auth.css               ← Login styles
  - admin.css              ← Admin styles
  - tourist.css            ← Tourist styles
```

### Backend
```
server/
  - server.js              ← All APIs & database
  - db.sqlite              ← SQLite database (auto-created)
  - uploads/               ← Uploaded images
```

---

## 🛠️ Troubleshooting

### Issue: "Cannot POST /api/auth/admin/login"
**Solution**: Backend not running
```powershell
# Check terminal 1
npm run dev
# Should show server ready
```

### Issue: "Invalid credentials" on admin login
**Solution**: Database was reset
- Username: `admin`
- Password: `admin123`

### Issue: Cities not showing for tourist
**Solution**: Refresh the page (Ctrl+R)

### Issue: Form doesn't submit
**Solution**: Check browser console (F12)
- Look for error messages
- Check network tab for API response

### Issue: Images not uploading
**Solution**: Try different image format
- Use: JPG, PNG, GIF
- Check file size < 5MB

### Issue: Port already in use
```powershell
# Kill process on port
Stop-Process -Name node -Force

# Or use different port
set PORT=5000
npm start
```

---

## 📊 Database Info

### Database File
```
Location: server/db.sqlite
Size: Auto-created on first run
Tables: 8 (admin, tourist, city, place, amenity_type, amenity, review, feedback)
```

### Reset Database
```powershell
cd server
Remove-Item db.sqlite -Force
npm run dev
# Database recreates with seeded admin account
```

---

## 🔍 Debugging

### Check Backend Logs
```
Look at terminal 1 (server running)
- See all API requests
- See database operations
- See errors
```

### Check Frontend Logs
```
Press F12 in browser
Go to Console tab
- See API response data
- See JavaScript errors
- See component logs
```

### Check Network Calls
```
Press F12 in browser
Go to Network tab
- Click an action (add city, login, etc.)
- See API request & response
- Check status codes (200 = success, 400+ = error)
```

---

## 🎨 Customization

### Change Colors
```
File: client/src/styles/*.css

Primary: #667eea (purple)
Secondary: #764ba2 (dark purple)
Background: #f5f5f5 (light gray)

Search & replace color codes
```

### Change API Base URL
```
File: client/src/services/api.js
Line: const API_BASE = 'http://localhost:4000/api'

Change to your server URL if deploying
```

### Add New Amenity Type
```
File: server/server.js
Line: const amenityTypes = ['...existing...', 'New Type']

Restart server
```

---

## 📈 Performance Tips

### For Better Performance
```
1. Use reasonable image sizes (< 2MB)
2. Don't load too much data at once
3. Close unused browser tabs
4. Restart servers occasionally
```

### Monitor Performance
```
Browser DevTools → Performance tab
- Record user actions
- See performance metrics
- Identify slow operations
```

---

## 🚀 Deployment Checklist

When ready to deploy:
- [ ] Change JWT_SECRET in server.js
- [ ] Update API_BASE in api.js to production URL
- [ ] Test all features in production
- [ ] Set up proper database backups
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up error logging
- [ ] Configure CORS for production domain

---

## 📞 Quick Help

### Most Common Tasks

**Add a City:**
1. Login as admin
2. 🏙️ Manage Cities tab
3. Fill form, click Add

**Add Amenities:**
1. Login as admin
2. 🏨 Manage Amenities tab
3. Select city & type
4. Fill form, click Add

**Browse as Tourist:**
1. Logout, register
2. Login as tourist
3. Click city, select category
4. Click amenity for details

**Submit Review:**
1. In amenity modal
2. Click "✍️ Add Review"
3. Rate & comment
4. Click Submit

---

## 🎯 Next Features to Build

```javascript
// Easy to add:
1. Search amenities
2. Filter by price/rating
3. Favorites/bookmarks
4. User profile page

// Medium complexity:
1. Trip itinerary
2. Booking system
3. Admin analytics
4. User following

// Advanced:
1. Payment integration
2. Real-time notifications
3. Mobile app
4. Multi-language
```

---

**Bookmark this file for quick reference!** 📌
