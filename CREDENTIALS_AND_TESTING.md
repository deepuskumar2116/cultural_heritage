# 🔐 Credentials & Testing Guide

## ✅ Servers Status
- ✅ **Backend**: http://localhost:4000 (Running)
- ✅ **Frontend**: http://localhost:5173 (Running)

---

## 📋 Default Test Credentials

### **Admin Account** (For Management)
```
Username: admin
Password: admin123
```
- Can add cities, places, and amenities
- Can view all tourist feedback
- Can see all amenities across all categories

### **Tourist Account** (For Browsing & Reviews)
```
Username: testuser
Password: test123
```
- Can browse Bengaluru city
- Can view all amenities by category
- Can submit reviews with ratings
- Can access external links (websites, Google Maps)

**These credentials are auto-seeded in the database on first startup!**

---

## 🧪 Complete Testing Workflow

### **STEP 1: Login as Admin**

1. Open http://localhost:5173 in your browser
2. Page shows **Login Page** with "Admin" and "Tourist" buttons
3. Click **Admin** button (should already be selected)
4. Enter:
   - Username: `admin`
   - Password: `admin123`
5. Click **Login**
6. **Expected Result**: Redirects to Admin Dashboard with sidebar navigation

---

### **STEP 2: Explore Admin Dashboard**

The Admin Dashboard has **4 tabs on the left sidebar**:

#### **Tab 1: Cities** 🏙️
- Shows "Bengaluru" city (already added in seed data)
- Has a form to **Add New City**
  - Name, Description, Image upload
  - Click "Add City" button

#### **Tab 2: Places** 📍
- Shows heritage places in Bengaluru:
  - Vidhana Soudha
  - Tippu Sultan's Palace
  - Sri Ranganathaswamy Temple
  - Cubbon Park
  - Bangalore Fort
- Has a form to **Add New Place**
  - Select city, add place details, upload image

#### **Tab 3: Amenities** 🏨
- Shows all 30+ amenities already added:
  - Bus Services, Flights, Trains
  - Hotels, Restaurants, Cafes/Bars
  - Temples, Malls, Museums
- Form to **Add More Amenities**
  - Select city & amenity type (9 categories)
  - Fill: name, description, address, phone
  - Website URL, Google Maps URL
  - Price range, rating, image upload

#### **Tab 4: Feedback** 💬
- Shows all reviews submitted by tourists
- Currently empty (will populate after tourists submit reviews)
- Shows tourist name, date, and review comment

---

### **STEP 3: Logout from Admin**

1. Click **Logout** button at bottom of sidebar
2. **Expected Result**: Redirected back to Login page

---

### **STEP 4: Login as Tourist**

1. You're back on Login page
2. Click **Tourist** button to switch modes
3. You'll see **Two tabs**: "Login" and "Register"
4. **Login tab** should already be active
5. Enter:
   - Username: `testuser`
   - Password: `test123`
6. Click **Login**
7. **Expected Result**: Redirects to Tourist Home page

---

### **STEP 5: Explore Tourist Home**

#### **City Selection** 🏛️
- Shows Bengaluru city card
- Click **Bengaluru** to select it
- Once selected, below shows **9 category filter buttons**:
  - 🚌 Bus Service
  - ✈️ Flight
  - 🚂 Train
  - 🏨 Hotel
  - 🍽️ Restaurant
  - ☕ Cafe/Bar
  - 🏛️ Temple
  - 🛍️ Mall
  - 🏺 Museum

#### **Browse by Category**
1. Click **🏨 Hotel** button
2. **Expected Result**: Shows all 4 hotels in Bengaluru:
   - The Leela Palace (4.9⭐)
   - JW Marriott (4.8⭐)
   - Radisson Blu (4.7⭐)
   - The Oberoi (4.8⭐)

3. Click any hotel card to open **Amenity Details Modal**

---

### **STEP 6: View Amenity Details & Links**

When you click on a hotel (or any amenity), a modal opens showing:

**Header Section**:
- Amenity name (e.g., "The Leela Palace Bengaluru")
- Rating (e.g., 4.9 ⭐)
- Price range (e.g., ₹15000-30000)

**Main Content**:
- Full description
- Address & phone number
- **🌐 Website** link (clickable - opens hotel website)
- **📍 Google Maps** link (clickable - opens location in Maps)

**Reviews Section** (Bottom):
- Form to **Add Your Review**
  - Star rating (1-5 stars)
  - Comment text box
  - Submit button
- **Existing Reviews List** showing:
  - Tourist name
  - Star rating
  - Comment
  - Submission date

---

### **STEP 7: Submit a Review**

1. While hotel modal is open, scroll down to **Reviews Section**
2. Click on **Star Rating** (1-5 stars) - let's say **4 stars**
3. In **Comment box**, type: `"Great hotel with excellent service!"`
4. Click **Submit Review** button
5. **Expected Result**:
   - Review appears in the reviews list
   - Your review shows: **"testuser"**, **4 stars**, **"Great hotel with excellent service!"**
   - Timestamp shows current date

---

### **STEP 8: Test All Categories**

Click through each category button and verify amenities appear:

| Button | Should Show | Count |
|--------|------------|-------|
| 🚌 Bus | Bus Services | 3 |
| ✈️ Flight | Airlines | 3 |
| 🚂 Train | Train Stations | 3 |
| 🏨 Hotel | Hotels | 4 |
| 🍽️ Restaurant | Restaurants | 4 |
| ☕ Cafe/Bar | Cafes & Brewpubs | 4 |
| 🏛️ Temple | Temples | 3 |
| 🛍️ Mall | Shopping Malls | 4 |
| 🏺 Museum | Museums | 3 |

**Total: 31 amenities** ✅

---

### **STEP 9: Test External Links**

1. Open any amenity modal
2. Look for blue links in the details:
   - **🌐 Website URL** - Click to verify it opens the official website
   - **📍 Google Maps** - Click to verify it opens location in Maps

Example:
- Hotel: Clicking website link opens `marriott.com`
- Clicking Maps link opens Google Maps showing the hotel location

---

### **STEP 10: Register New Tourist (Optional)**

1. Logout from current tourist account
2. Back on login page, click **Tourist** button
3. Click **Register** tab
4. Fill in:
   - Name: `John Doe`
   - Username: `johndoe`
   - Password: `john123`
   - Confirm Password: `john123`
   - Email: `john@example.com`
   - Phone: `9876543210`
5. Click **Register** button
6. **Expected Result**: Success message, redirects to login
7. Now login with new credentials: `johndoe` / `john123`
8. **New account is saved permanently** - you won't need to register again!

---

## 🔄 Data Persistence Test

### **Before (Old Behavior)**
- Tourist account loses credentials on refresh
- Need to register every time

### **After (Fixed Behavior)**
- Tourist credentials are **saved in database permanently**
- Test accounts (`testuser/test123`) exist automatically
- New registrations are persisted
- Can login anytime with any registered account

---

## ✨ Features to Verify

- ✅ Admin login works
- ✅ Tourist login works
- ✅ Bengaluru city displays with 5 heritage places
- ✅ All 9 amenity categories show correct items
- ✅ Tourist reviews are saved and displayed
- ✅ External website links are clickable and functional
- ✅ Google Maps links open correct locations
- ✅ Category filtering works correctly
- ✅ New tourist registrations are persistent

---

## 🐛 Troubleshooting

### **Problem: "Bengaluru not showing"**
- Restart backend server
- Check if server logs show seed messages
- Database might be corrupted - delete `server/db.sqlite`

### **Problem: "Can't login with testuser/test123"**
- Backend server must be running on port 4000
- Database might not have seeded properly
- Clear browser localStorage (F12 → Application → Clear All)

### **Problem: "Reviews not saving"**
- Make sure you're logged in as a tourist
- Check browser console (F12) for error messages
- Verify backend is running

### **Problem: "External links not working"**
- Links should open in new tabs
- Check if website URLs are correct
- Try a different amenity

---

## 📊 Database Content After Seeding

```
📦 Database (db.sqlite)
├── 🔐 Admin Table
│   └── admin (username: admin, password: admin123)
├── 👤 Tourist Table
│   └── testuser (username: testuser, password: test123)
├── 🏙️ City Table
│   └── Bengaluru (with description & image)
├── 📍 Place Table
│   ├── Vidhana Soudha
│   ├── Tippu Sultan's Palace
│   ├── Sri Ranganathaswamy Temple
│   ├── Cubbon Park
│   └── Bangalore Fort
├── 🏷️ Amenity Type Table (9 types)
│   ├── Bus Service
│   ├── Flight
│   ├── Train
│   ├── Hotel
│   ├── Restaurant
│   ├── Cafe/Bar
│   ├── Temple
│   ├── Mall
│   └── Museum
├── 🏨 Amenity Table (31 items across all types)
│   ├── Hotels (4)
│   ├── Restaurants (4)
│   ├── Cafes (4)
│   ├── Temples (3)
│   ├── Malls (4)
│   ├── Museums (3)
│   ├── Trains (3)
│   ├── Buses (3)
│   └── Flights (3)
└── ⭐ Review Table (will populate as tourists add reviews)
```

---

## 🚀 Quick Start Summary

1. **Open App**: http://localhost:5173
2. **Login as Admin**: `admin` / `admin123`
3. **Explore Dashboard**: View cities, places, amenities, feedback
4. **Logout & Login as Tourist**: `testuser` / `test123`
5. **Browse Bengaluru**: Click city and filter by categories
6. **Submit Reviews**: Click amenity → Add review with rating
7. **Test Links**: Click website and Google Maps links
8. **Register New Account** (optional): Try adding your own tourist account

---

## ✅ SUCCESS CRITERIA

All items below should work without errors:

- [x] Admin login successful
- [x] Tourist login with existing credentials successful
- [x] Bengaluru city visible with all 31 amenities
- [x] All 9 categories display correct items
- [x] Amenity details modal shows complete information
- [x] External links are clickable
- [x] Can submit and view reviews
- [x] Tourist registration saves permanently
- [x] No need to register every time
- [x] Both servers running without errors

**Once all criteria are met, the app is PRODUCTION READY! 🎉**

