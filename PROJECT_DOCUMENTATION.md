# HomeDecor Indonesia - Project Documentation

## 🏠 Project Overview

**HomeDecor Indonesia** is a modern e-commerce website built with Next.js 14.2.20, specializing in home furniture, decorations, and interior design products. The platform integrates with WooCommerce for backend e-commerce functionality and provides a comprehensive shopping experience for home decor enthusiasts in Indonesia.

### 🛠️ Technology Stack

- **Framework**: Next.js 14.2.20 (App Router)
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui components
- **State Management**: React hooks with Next.js built-in features
- **E-commerce**: WooCommerce REST API integration
- **Payment Gateway**: DOKU payment integration
- **Authentication**: Custom JWT-based authentication system
- **Theme**: Dark mode support with next-themes
- **Icons**: Lucide React & React Icons
- **Animations**: Framer Motion
- **Typography**: Poppins Google Font + Futura Book local font
- **Package Manager**: npm

## 📁 Project Structure

```
homedecorindonesia/
├── app/                          # Next.js App Router structure
│   ├── api/                      # API routes (Backend integration)
│   │   ├── auth/                 # Authentication API routes
│   │   │   ├── login/            # User login endpoint
│   │   │   ├── logout/           # User logout endpoint
│   │   │   ├── me/               # Current user info
│   │   │   └── register/         # User registration
│   │   ├── categories/           # Product categories API
│   │   ├── debug/                # Debug utilities
│   │   │   └── env/              # Environment debug endpoint
│   │   ├── menu/                 # Navigation menu API
│   │   ├── order/                # Order creation API
│   │   │   └── create/           # Create new order
│   │   ├── orders/               # Order management API
│   │   │   └── [id]/             # Individual order details
│   │   ├── payment/              # Payment processing API
│   │   │   ├── doku/             # DOKU payment gateway
│   │   │   │   ├── callback/     # Payment callback handler
│   │   │   │   └── route.js      # DOKU payment processing
│   │   │   ├── webhook/          # Payment webhooks
│   │   │   └── route.js          # Main payment endpoint
│   │   ├── products/             # Product management API
│   │   │   ├── popular/          # Popular products endpoint
│   │   │   ├── route.js          # Product listing with pagination
│   │   │   └── [id]/             # Individual product API
│   │   ├── user/                 # User management API
│   │   │   └── update-address/   # Address update endpoint
│   │   ├── webhooks/             # Webhook handlers
│   │   └── test-woo/             # WooCommerce testing
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── cart/                     # Shopping cart page
│   ├── checkout/                 # Checkout process page
│   ├── cushions/                 # Cushions category
│   │   ├── rectangle-cushions/   # Rectangle cushions subcategory
│   │   ├── round-cushions/       # Round cushions subcategory
│   │   └── square-cushions/      # Square cushions subcategory
│   ├── decoration/               # Home decoration category
│   │   ├── home-accents/         # Home accents subcategory
│   │   │   ├── books-bookends/   # Books & bookends
│   │   │   ├── bowls-trays/      # Bowls & trays
│   │   │   ├── candle-holders/   # Candle holders
│   │   │   ├── decor-arts-scluptures/ # Decor arts & sculptures
│   │   │   ├── decorative-objects/ # Decorative objects
│   │   │   ├── decorative-stools/ # Decorative stools
│   │   │   ├── flower-arrangement/ # Flower arrangements
│   │   │   ├── photo-frames/     # Photo frames
│   │   │   └── vase-ceramic-jars/ # Vases & ceramic jars
│   │   └── wall-decor/           # Wall decoration subcategory
│   │       ├── clocks/           # Wall clocks
│   │       ├── mirrors/          # Wall mirrors
│   │       └── wall-arts/        # Wall arts
│   ├── fabrics/                  # Fabrics category
│   │   ├── drapery-fabrics/      # Drapery fabrics
│   │   └── promotional-fabrics/  # Promotional fabrics
│   ├── furniture/                # Furniture category
│   │   ├── accents/              # Furniture accents
│   │   │   └── display-cabinets/ # Display cabinets
│   │   ├── bedroom/              # Bedroom furniture
│   │   │   ├── bed-benches/      # Bedroom benches
│   │   │   ├── bed-side-nightstand/ # Bedside tables & nightstands
│   │   │   ├── bedsets/          # Bed sets
│   │   │   ├── chest-of-drawers-and-dressers/ # Chests & dressers
│   │   │   ├── headboards/       # Headboards
│   │   │   ├── makeup-table/     # Makeup tables
│   │   │   └── tv-cabinets/      # TV cabinets
│   │   ├── dining-room/          # Dining room furniture
│   │   ├── home-office/          # Home office furniture
│   │   └── living-room/          # Living room furniture
│   ├── lighting/                 # Lighting products category
│   ├── my-account/               # User account management
│   ├── payment/                  # Payment processing pages
│   ├── sale/                     # Sale & promotions
│   ├── test-checkout/            # Checkout testing
│   ├── test-doku-api/            # DOKU API testing
│   ├── test-payment-methods/     # Payment methods testing
│   ├── about-us/                 # About page
│   ├── all-galery/              # Gallery page
│   ├── blogs/                   # Blog page
│   ├── curtains/                # Curtains category
│   ├── product/[slug]/          # Dynamic product pages
│   ├── rugs/                    # Rugs category
│   ├── upholstery/              # Upholstery category
│   ├── wallpapers/              # Wallpapers category
│   ├── fonts/                   # Custom fonts directory
│   ├── layout.jsx               # Root layout component
│   ├── page.jsx                 # Homepage
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── Cart/                    # Shopping cart components
│   ├── Checkout/                # Checkout process components
│   │   ├── CheckoutButton.jsx   # Checkout action button
│   │   ├── CheckoutButtonTest.jsx # Checkout testing component
│   │   ├── CheckoutForm.jsx     # Main checkout form
│   │   ├── DokuPaymentSelector.jsx # DOKU payment method selector
│   │   ├── OrderSummary.jsx     # Order summary display
│   │   └── WooCommerceSetupGuide.jsx # WooCommerce setup guide
│   ├── Common/                  # Common utility components
│   ├── Compare/                 # Product comparison components
│   ├── Header/                  # Navigation components
│   │   ├── LoginDropdown.jsx    # User login dropdown
│   │   ├── MainHeader.jsx       # Main header component
│   │   ├── NavLinks.jsx         # Desktop navigation links
│   │   ├── NavLinksMobile.jsx   # Mobile navigation links
│   │   ├── SearchInput.jsx      # Product search input
│   │   ├── ShoppingCart.jsx     # Shopping cart icon
│   │   └── TopBar.jsx           # Top bar component
│   ├── Homepage/                # Homepage-specific components
│   ├── Product/                 # Product-related components
│   ├── Footer.jsx               # Footer component
│   ├── Carousel.jsx             # Hero carousel
│   ├── ProductsGrid.jsx         # Product grid display
│   ├── ProductsPage.jsx         # Product listing page
│   ├── BottomNavigation.jsx     # Mobile navigation
│   ├── WhatsappFloating.jsx     # WhatsApp contact button
│   ├── BlogSection.jsx          # Blog section component
│   ├── DropdownMenu.jsx         # Dropdown menu component
│   ├── HamburgerIcon.jsx        # Mobile menu icon
│   ├── Header.jsx               # Header wrapper
│   └── WordPressImage.jsx       # WordPress image component
├── hooks/                       # Custom React hooks
│   ├── useAuth.js               # Authentication state management
│   ├── useCart.js               # Shopping cart state management
│   └── useCompare.js            # Product comparison functionality
├── lib/                         # Utility libraries
│   ├── doku.js                  # DOKU payment gateway integration
│   ├── paymentMethods.js        # Payment methods configuration
│   ├── utils.js                 # CN utility function for styling
│   ├── woocommerce.js           # WooCommerce API integration
│   └── woocommerceCheckout.js   # WooCommerce checkout integration
├── constant/                    # Constants and configuration
│   └── index.js                 # Navigation links and menu structure
├── services/                    # Service layer
│   ├── api.js                   # API service functions
│   ├── media.js                 # Media service
│   └── pages.js                 # Page-related services
├── middleware.js                # Next.js middleware for authentication
├── public/                      # Static assets
│   └── img/                     # Images organized by category
│       ├── category/
│       ├── reviews/
│       ├── services/
│       ├── shop-by-fabrics/
│       └── shop-by-room/
├── .env.local                   # Environment variables (not tracked)
├── package.json                 # Dependencies and scripts
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # Project documentation
```

## 🌐 Website Sitemap

### Primary Navigation
- **Home** (`/`) - Main landing page with hero carousel and featured sections
- **Furniture** (`/furniture`) - Main furniture category with multi-level dropdown
- **Lighting** (`/lighting`) - Lighting products category
- **Decoration** (`/decoration`) - Home decoration items
- **Cushions** (`/cushions`) - Various types of cushions
- **Fabrics** (`/fabrics`) - Drapery and promotional fabrics
- **Rugs** (`/rugs`) - Rugs collection
- **Curtains** (`/curtains`) - Curtains collection
- **Upholstery** (`/upholstery`) - Upholstery services
- **Wallpapers** (`/wallpapers`) - Wallpaper collection
- **Flooring** (`/flooring`) - Flooring options
- **Catalogues** (`/catalogues`) - Product catalogs
- **Photo Gallery** (`/all-galery`) - Visual gallery
- **Blog** (`/blogs`) - Articles and inspiration
- **SALE** (`/sale`) - Discounted items and promotions

### User Account & Shopping
- **Login** (`/auth/login`) - User authentication
- **Register** (`/auth/register`) - New user registration
- **My Account** (`/my-account`) - User account management
- **Shopping Cart** (`/cart`) - Cart management
- **Checkout** (`/checkout`) - Order checkout process
- **Payment** (`/payment`) - Payment processing

### Cushions Category Structure
- **Rectangle Cushions** (`/cushions/rectangle-cushions`)
- **Round Cushions** (`/cushions/round-cushions`)
- **Square Cushions** (`/cushions/square-cushions`)

### Decoration Category Structure

#### Home Accents (`/decoration/home-accents/`)
- **Books & Bookends** (`/decoration/home-accents/books-bookends`)
- **Bowls & Trays** (`/decoration/home-accents/bowls-trays`)
- **Candle Holders** (`/decoration/home-accents/candle-holders`)
- **Decor Arts & Sculptures** (`/decoration/home-accents/decor-arts-scluptures`)
- **Decorative Objects** (`/decoration/home-accents/decorative-objects`)
- **Decorative Stools** (`/decoration/home-accents/decorative-stools`)
- **Flower Arrangements** (`/decoration/home-accents/flower-arrangement`)
- **Photo Frames** (`/decoration/home-accents/photo-frames`)
- **Vases & Ceramic Jars** (`/decoration/home-accents/vase-ceramic-jars`)

#### Wall Decor (`/decoration/wall-decor/`)
- **Clocks** (`/decoration/wall-decor/clocks`)
- **Mirrors** (`/decoration/wall-decor/mirrors`)
- **Wall Arts** (`/decoration/wall-decor/wall-arts`)

### Fabrics Category Structure
- **Drapery Fabrics** (`/fabrics/drapery-fabrics`)
- **Promotional Fabrics** (`/fabrics/promotional-fabrics`)

### Furniture Category Structure

#### Living Room (`/furniture/living-room/`)
- **Sofas** (`/furniture/living-room/sofas`)
- **Sectional & Corner Sofas** (`/furniture/living-room/sectional-corner-sofas`)
- **Day Bed / Cleopatra** (`/furniture/living-room/cleopatra-day-beds`)
- **Arm Chairs** (`/furniture/living-room/arm-chairs`)
- **Side Table** (`/furniture/living-room/side-table`)
- **Coffee Table** (`/furniture/living-room/coffee-table`)
- **Bench** (`/furniture/living-room/bench`)
- **Ottoman & Pouf** (`/furniture/living-room/ottoman-pouf`)
- **Decorative Stool** (`/furniture/living-room/decorative-stools`)
- **Console Table** (`/furniture/living-room/console-tables`)
- **Chest Drawer** (`/furniture/living-room/chests`)
- **Sideboard & Buffet** (`/furniture/living-room/buffet`)
- **TV Stand** (`/furniture/living-room/tv-stands`)
- **Room Deviders** (`/furniture/living-room/room-deviders`)

#### Bedroom (`/furniture/bedroom/`)
- **Beds** (`/furniture/bedroom/bedsets`)
- **Headboards** (`/furniture/bedroom/headboards`)
- **Bed Side Table** (`/furniture/bedroom/bed-side-nightstand`)
- **Make Up Table** (`/furniture/bedroom/makeup-table`)
- **Chest Of Drawers and Dressers** (`/furniture/bedroom/chest-of-drawers-and-dressers`)
- **TV Cabinets** (`/furniture/bedroom/tv-cabinets`)
- **Bed Benches** (`/furniture/bedroom/bed-benches`)

#### Dining Room (`/furniture/dining-room/`)
- **Dining Table** (`/furniture/dining-room/dining-tables`)
- **Dining Chairs** (`/furniture/dining-room/dining-chairs`)
- **Bar Chair** (`/furniture/dining-room/bar-chairs`)
- **Trolleys & Bar Carts** (`/furniture/dining-room/trolleys-bar-carts`)

#### Home Office (`/furniture-office/`)
- **Study Tables** (`/product-category/study-tables`)
- **Study Chairs** (`/product-category/office-chairs`)
- **Bookcase** (`/product-category/furniture/bookcases`)

#### Accents
- **Display Accent** (`/product-category/display-cabinets`)

### Dynamic Pages
- **Product Details** (`/product/[slug]`) - Individual product pages
- **Category Pages** - Dynamic category-based product listings

### Information Pages
- **About Us** (`/about-us`) - Company information and story
- **Blog** (`/blogs`) - Articles, tips, and inspiration
- **Gallery** (`/all-galery`) - Visual showcase of products

## 🎯 Key Features

### E-commerce Functionality
- **WooCommerce Integration**: Full backend integration for product management
- **Product Catalog**: Dynamic product listings with categories and filters
- **Shopping Cart**: Advanced cart functionality with state management
- **Search**: Product search with WooCommerce API integration
- **Product Details**: Detailed product pages with images and specifications
- **Related Products**: Automated product recommendations
- **Order Management**: API endpoints for order processing
- **Payment Processing**: DOKU payment gateway integration with multiple payment methods
- **User Authentication**: Complete user registration and login system
- **Order Tracking**: Real-time order status updates and tracking
- **Product Comparison**: Side-by-side product comparison functionality
- **Checkout System**: Multi-step checkout process with form validation

### User Experience
- **Responsive Design**: Mobile-first approach with dedicated bottom navigation
- **Dark Mode**: Theme switching capability
- **WhatsApp Integration**: Floating WhatsApp button for customer support
- **Carousel**: Hero banner showcasing featured products
- **Interactive Navigation**: Multi-level dropdown menus
- **Performance**: Optimized with Next.js image optimization and caching

### Homepage Sections
1. **Hero Carousel** - Featured products and promotions
2. **Shop By Category** - Category-based browsing
3. **Shop By Room** - Room-based product organization
4. **Shop By Fabrics** - Fabric-based product filtering
5. **Services** - Company services showcase
6. **Luxury Accordion** - Product features and benefits
7. **Customer Reviews** - Testimonials and social proof
8. **Showrooms** - Physical location information

## 🔧 Configuration

### Environment Variables
Required environment variables for WooCommerce integration:

```env
NEXT_PUBLIC_WC_STORE_URL=your-store-url.com
WC_READ_KEY=your-read-consumer-key
WC_READ_SECRET=your-read-consumer-secret
WC_WRITE_KEY=your-write-consumer-key
WC_WRITE_SECRET=your-write-consumer-secret
WC_FULL_KEY=your-full-consumer-key
WC_FULL_SECRET=your-full-consumer-secret
```

### WooCommerce API Clients
The project provides three levels of API access:
- **Read Client** (`createWooClientRead()`) - For fetching products and categories
- **Write Client** (`createWooClientWrite()`) - For creating and updating orders
- **Full Client** (`createWooClientFull()`) - Full administrative access

## 🎨 Design System

### Typography
- **Primary**: Poppins Google Font
- **Secondary**: Futura Book (local font)
- **Variable**: CSS custom properties for dynamic theming

### Color Scheme
- Custom CSS variables for consistent theming
- Dark mode support with next-themes
- Tailwind CSS integration with custom color palette

### Components
- **Shadcn/ui** components for consistent UI
- **Framer Motion** for smooth animations
- **Lucide React** icons for modern iconography

## 📱 Responsive Features

### Mobile Optimization
- **Bottom Navigation**: Dedicated mobile navigation bar
- **Touch-friendly**: Optimized for touch interactions
- **Responsive Grid**: Adaptive product grid layouts
- **Mobile Menu**: Hamburger menu for mobile devices

### Performance Optimization
- **Image Optimization**: Next.js Image component with remote patterns
- **Caching**: API response caching with configurable revalidation
- **Code Splitting**: Automatic code splitting with Next.js
- **SSR/SSG**: Server-side rendering with static generation where appropriate

## 🔌 API Integration

### WooCommerce REST API
- **Products API**: Fetch products, categories, and variations
- **Orders API**: Create and manage customer orders
- **Store API**: Public-facing store endpoints
- **Fallback System**: Graceful degradation between API versions

### Custom API Routes
- `/api/auth/login` - User authentication endpoint
- `/api/auth/logout` - User logout endpoint
- `/api/auth/me` - Current user information
- `/api/auth/register` - User registration endpoint
- `/api/categories` - Product categories listing
- `/api/products` - Product listing with pagination
- `/api/products/[id]` - Individual product details
- `/api/products/popular` - Popular products endpoint
- `/api/orders` - Order management
- `/api/orders/[id]` - Individual order details
- `/api/order/create` - Create new order
- `/api/payment` - Main payment processing endpoint
- `/api/payment/doku` - DOKU payment gateway processing
- `/api/payment/doku/callback` - DOKU payment callback handler
- `/api/payment/webhook` - Payment webhook handlers
- `/api/user/update-address` - User address management
- `/api/menu` - Navigation menu structure
- `/api/webhooks/info` - Webhook information endpoint
- `/api/debug/env` - Environment debugging utility

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- WooCommerce store with REST API access

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd homedecorindonesia
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local` file with WooCommerce API credentials:
```env
NEXT_PUBLIC_WC_STORE_URL=https://your-store.com
WC_READ_KEY=your-read-key
WC_READ_SECRET=your-read-secret
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 📊 Project Status

### Recent Updates
- ✅ Complete authentication system with JWT tokens
- ✅ DOKU payment gateway integration
- ✅ Advanced checkout system with multi-step forms
- ✅ Shopping cart with state management
- ✅ Product comparison functionality
- ✅ User account management system
- ✅ Order processing and tracking
- ✅ Payment callback handling and webhooks
- ✅ Comprehensive API endpoints for all e-commerce functions
- ✅ Cushions category with subcategories (rectangle, round, square)
- ✅ Decoration category with home accents and wall decor sections
- ✅ Fabrics category with drapery and promotional fabrics
- ✅ Modern e-commerce features implementation
- ✅ Product components enhancement
- ✅ Wallpapers page addition
- ✅ About-us page development
- ✅ WooCommerce integration improvements
- ✅ Mobile responsiveness enhancements
- ✅ Dark mode theme support

### Current Features
- ✅ Full e-commerce functionality with payment processing
- ✅ Complete user authentication and account management
- ✅ Responsive design with mobile-first approach
- ✅ Modern UI components with Shadcn/ui
- ✅ Advanced search functionality
- ✅ Category-based browsing with detailed subcategories
- ✅ Product detail pages with related products
- ✅ Shopping cart with persistent state
- ✅ Multi-step checkout process
- ✅ Multiple payment methods via DOKU gateway
- ✅ Order tracking and management
- ✅ Product comparison tools
- ✅ WhatsApp integration for customer support
- ✅ Blog section with articles
- ✅ Customer reviews and testimonials
- ✅ Gallery showcase
- ✅ Custom middleware for route protection

### Future Enhancements
- 🔄 Advanced filtering and sorting options
- 🔄 Wishlist functionality for saved items
- 🔄 Advanced search with AI-powered recommendations
- 🔄 Multi-language support for international markets
- 🔄 Email marketing integration
- 🔄 Product reviews and rating system
- 🔄 Live chat support integration
- 🔄 Analytics and reporting dashboard
- 🔄 SEO optimization enhancements
- 🔄 Progressive Web App (PWA) capabilities

## 🤝 Contributing

### Development Guidelines
1. Follow Next.js App Router conventions
2. Use Tailwind CSS for styling
3. Maintain responsive design principles
4. Test on multiple devices and browsers
5. Follow JavaScript ES6+ standards

### Code Structure
- Use components for reusable UI elements
- Implement proper error handling
- Optimize images and assets
- Maintain consistent naming conventions
- Document new features and components

## 📞 Support

### Customer Support
- **WhatsApp**: Floating WhatsApp button for instant support
- **Contact**: Through website contact forms
- **Showrooms**: Physical locations for in-person assistance

### Technical Support
- **Documentation**: Comprehensive code documentation
- **API Reference**: WooCommerce API integration details
- **Performance**: Optimized for speed and user experience

---

*Last Updated: December 13, 2025*
*Version: 0.1.0*
*Framework: Next.js 14.2.20*