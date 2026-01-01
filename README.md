# YegnaBet - Property Rental Platform

A modern property rental platform built for Ethiopia, allowing users to find, book, and manage property rentals with ease.

## 🏠 Features

- **Property Search & Discovery**: Browse and search properties with advanced filters
- **User Authentication**: Secure login/signup for guests, owners, and admins
- **Booking System**: Complete booking flow with owner approval process
- **Wallet System**: Integrated wallet for payments and transactions
- **Multi-Role Support**: Different dashboards for guests, property owners, and administrators
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Real-time Notifications**: Stay updated on booking status and approvals

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
YegnaBet/
├── src/                    # Frontend source code
│   ├── app/               # React components and pages
│   ├── services/          # API services
│   ├── style/            # CSS styles
│   └── data/             # Mock data and constants
├── backend/               # Backend source code
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic services
│   └── scripts/          # Database scripts
├── public/               # Static assets
│   └── assets/          # Images and logos
├── documentation/        # Project documentation
└── node_modules/        # Dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your MongoDB connection string and JWT secret

# Start the server
npm start
```

## 🌐 Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yegnabet
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

## 📱 User Roles

### Guest Users
- Browse and search properties
- Create bookings
- Manage wallet and transactions
- View booking history

### Property Owners
- List and manage properties
- Approve/reject booking requests
- View earnings and analytics
- Manage property availability

### Administrators
- Oversee all platform activities
- Manage users and properties
- View system analytics
- Handle disputes and support

## 🎯 Key Features

### Booking Flow
1. **Property Selection** - Browse and select desired property
2. **Date & Guest Selection** - Choose dates and number of guests
3. **Booking Review** - Review booking details and pricing
4. **Payment Processing** - Secure wallet-based payment
5. **Owner Approval** - Property owner reviews and approves
6. **Confirmation** - Booking confirmed and property reserved

### Wallet System
- Secure balance management
- Transaction history
- Add funds functionality
- Automatic payment processing
- Earnings distribution for owners

## 📚 Documentation

Detailed documentation is available in the `documentation/` folder:

- Implementation guides
- Feature specifications
- Bug fixes and updates
- System architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For support or inquiries:
- Email: natnaelzemene21@gmail.com
- Phone: +215 921 507 548

---

**YegnaBet** - Find your perfect home in Ethiopia 🇪🇹