# 🚀 Quick Start Guide

## Current Status
✅ **Both servers running and ready to test!**
- Backend: http://localhost:4000
- Frontend: http://localhost:5173

---

## 🔐 Login Credentials

### Admin Login
- **URL**: http://localhost:5173
- **Select**: ⚙️ Admin button
- **Username**: `admin`
- **Password**: `admin123`

### Tourist Login
- **URL**: http://localhost:5173
- **Select**: 👤 Tourist button
- **Option 1**: Create new account (Click "Register here")
- **Option 2**: Use test account if created earlier

---

## 📱 What You Can Do Right Now

### As Admin:
1. ✓ Login
2. ✓ View "Manage Cities" tab
3. ✓ Add new cities with image and description
4. ✓ View added cities in a grid

### As Tourist:
1. ✓ Register new account
2. ✓ Login with credentials
3. ✓ Select a city
4. ✓ Choose amenity category (Hotel, Restaurant, etc.)
5. ✓ Click amenity to see details
6. ✓ Click "Visit Website" or "View on Maps"
7. ✓ Submit a review with rating and comment

---

## 🎯 Sample Test Flow

### Step 1: Add Data (as Admin)
```
1. Login as admin
2. Add City: "Bangalore"
   - Description: "Silicon Valley of India"
   - Upload any image
3. Add City: "Delhi"
   - Description: "Capital of India"
   - Upload any image
```

### Step 2: Add Amenities (as Admin)
```
1. Go to "Manage Amenities" (when implemented)
2. Add Hotel in Bangalore
   - Name: "The Leela Palace"
   - Address: "White Field, Bangalore"
   - Website: https://www.theleela.com
   - Google Maps: (get URL from Google Maps)
   - Price Range: Premium
   - Rating: 4.8
```

### Step 3: Explore (as Tourist)
```
1. Register as new tourist
2. Login
3. Click on "Bangalore" city
4. Select "Hotel" category
5. Click on hotel to see details
6. Click "Visit Website" (opens in new tab)
7. Click "View on Maps" (opens Google Maps)
8. Click "Add Review" button
9. Rate 5 stars and write review
10. Submit
```

---

## 🎨 Features Overview

### Login Page
- Gradient purple background
- Admin/Tourist toggle
- Register form for tourists
- Demo credentials shown for admin

### Admin Dashboard
- Sidebar with 4 sections:
  - 🏙️ Manage Cities (Fully working)
  - 📍 Manage Places (UI ready)
  - 🏨 Manage Amenities (UI ready)
  - 💬 View Feedback (UI ready)

### Tourist Home
- City grid with images
- Category buttons (🚌 🚂 ✈️ 🏨 🍽️ ☕ 🛕 🏬 🏛️)
- Amenity cards with images
- Detail modal with:
  - Full information
  - Address, phone, website
  - Google Maps link
  - Star rating
  - Review form

---

## 📋 Testing Checklist

Test each of these:

### Authentication
- [ ] Admin login with correct credentials works
- [ ] Admin login with wrong password fails
- [ ] Tourist registration creates account
- [ ] Tourist login with correct credentials works
- [ ] Logout clears session
- [ ] Visiting /admin/dashboard without login redirects to /login
- [ ] Visiting /tourist/home without login redirects to /login

### Admin Features
- [ ] Can add city with all fields
- [ ] City appears in list after adding
- [ ] City image uploads correctly
- [ ] Can see "Coming Soon" messages for Places and Amenities

### Tourist Features
- [ ] Can see all cities
- [ ] Can click city to select it
- [ ] Can see amenity type buttons (9 categories)
- [ ] Clicking button loads amenities (if any exist)
- [ ] Can click amenity card to open modal
- [ ] Modal shows all details
- [ ] Website link opens in new tab
- [ ] Maps link opens Google Maps
- [ ] Can fill review form and submit

### Responsive Design
- [ ] Desktop (1200px+) - Full layout
- [ ] Tablet (600-1200px) - Adjusted layout
- [ ] Mobile (<600px) - Stacked layout

### Edge Cases
- [ ] Refresh page - Session persists with token
- [ ] Go back button in browser - Works correctly
- [ ] Try to access admin page as tourist - Redirects
- [ ] Try to access tourist page as admin - Redirects

---

## 🐛 Found a Bug?

### Report the following:
1. What happened
2. What you expected to happen
3. Steps to reproduce
4. Any error messages (from console or terminal)

### Example:
```
"When I try to add a city, the form doesn't submit.
Expected: City should be added and appear in the list.
Steps: 
  1. Login as admin
  2. Fill city form
  3. Click 'Add City'
Error: Console shows 'Cannot POST /api/admin/cities'"
```

---

## 🔧 If Something Breaks

### Check Terminal Logs:
```
Backend terminal: Look for error messages from server
Frontend terminal: Check if Vite is still running
Browser console: F12 -> Console tab
Network tab: F12 -> Network, check API responses
```

### Restart Servers:
```powershell
# Backend - Press Ctrl+C, then:
npm run dev

# Frontend - Press Ctrl+C, then:
npm start
```

---

## 💬 Next Steps After Testing

Once you test and provide feedback, I can:

1. **Fix any bugs** you find
2. **Complete amenities form** (Places and Amenities management)
3. **Add validation** (form field validation, error messages)
4. **Improve UX** (loading states, animations, etc.)
5. **Add features** you request
6. **Optimize performance** (pagination, caching, etc.)

---

## 🎯 Long-term Roadmap

### Phase 2 (After testing)
- Complete admin amenities form
- Complete admin places form
- Add search functionality
- Add filtering by price range, rating

### Phase 3
- QR code generation and scanning
- User favorites/bookmarks
- Itinerary planning
- User analytics

### Phase 4
- Payment integration
- Booking system
- Social features
- Admin reports/analytics

---

## ✉️ Questions?

- Check the README.md for detailed documentation
- Check BUILD_SUMMARY.md for what was built
- Look at console/terminal for error messages
- Ask me to clarify anything!

---

**Happy Testing! 🎉**

**Go to http://localhost:5173 to start exploring!**
