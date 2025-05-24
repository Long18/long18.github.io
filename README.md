# Portfolio Website - Lê Nguyễn Thành Long (William)

A modern, responsive portfolio website showcasing game development projects and professional experience. Built with Next.js 14 and TypeScript, featuring internationalization support and multiple portfolio versions.

## 🚀 Live Demo

- **Current Version (Next.js)**: [https://long18.github.io](https://long18.github.io)
- **Legacy Version 2.0**: [https://long18.github.io/v2.0](https://long18.github.io/v2.0)
- **Legacy Version 1.0**: [https://long18.github.io/v1.0](https://long18.github.io/v1.0)

## 📁 Project Structure

```
long18.github.io/
├── src/                          # Next.js application source code
│   ├── app/                      # App Router pages and layouts
│   │   ├── [locale]/            # Internationalized routes (en/vi)
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── layout/              # Layout components
│   │   ├── providers/           # Context providers
│   │   ├── sections/            # Page section components
│   │   └── ui/                  # Reusable UI components
│   ├── data/                    # Static data and content
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/                    # Internationalization configuration
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── public/                      # Static assets for Next.js
├── assets/                      # Shared assets for all versions
│   ├── css/                     # Stylesheets
│   ├── js/                      # JavaScript files
│   ├── images/                  # Images and icons
│   ├── videos/                  # Video files
│   ├── fonts/                   # Custom fonts
│   ├── apk/                     # Android app files
│   └── zip/                     # Downloadable project files
├── v2.0/                        # Legacy HTML portfolio (2.0)
├── v1.0/                        # Legacy HTML portfolio (1.0)
├── Games/                       # Game project source files
└── out/                         # Next.js build output (generated)
```

## 🛠️ Technologies Used

### Current Version (Next.js)

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Custom components with Tailwind
- **Icons**: Lucide React, React Icons
- **Internationalization**: i18next, react-i18next
- **Forms**: React Hook Form with Zod validation
- **3D Graphics**: Three.js with React Three Fiber

### Legacy Versions

- **HTML5**: Semantic markup
- **CSS3**: Custom styles with animations
- **JavaScript**: Vanilla JS with jQuery
- **Icons**: Ionicons
- **Animations**: CSS transitions and keyframes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Long18/long18.github.io.git
   cd long18.github.io
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run release` - Create a new release

## 🌐 Internationalization

The website supports multiple languages:

- **English** (`en`) - Default language
- **Vietnamese** (`vi`) - Native language

Language detection is automatic based on browser preferences, with manual switching available.

## 📄 File Organization

### Assets Structure

```
assets/
├── css/           # Stylesheets for legacy versions
├── js/            # JavaScript files for legacy versions
├── images/        # Images, avatars, thumbnails
├── videos/        # Game trailers and demos
├── fonts/         # Custom web fonts
├── apk/           # Android application files
└── zip/           # Source code downloads
```

### Version Management

- **Current**: Next.js app in `/src` directory
- **v2.0**: Modern HTML/CSS/JS in `/v2.0` directory
- **v1.0**: Original portfolio in `/v1.0` directory

## 🔧 Development Guidelines

### Code Style

- ESLint configuration for consistent code style
- Prettier for code formatting
- TypeScript strict mode enabled
- Tailwind CSS for styling

### Commit Messages

Follow conventional commit format:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## 📱 Responsive Design

The portfolio is fully responsive across all devices:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Screens**: 1440px+

## 🔒 Security

- No sensitive data in repository
- Environment variables for API keys
- Secure content loading (HTTPS)
- CSP headers configured

## 📊 Performance

### Optimization Features

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Static generation for faster loading
- Minified CSS and JavaScript
- Preloading of critical resources

### Lighthouse Scores

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lê Nguyễn Thành Long (William)**

- GitHub: [@Long18](https://github.com/Long18)
- Email: [Contact through portfolio](https://long18.github.io)
- LinkedIn: [Profile](https://linkedin.com/in/long18)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Three.js community for 3D graphics support
- All contributors and users providing feedback

---

_Last updated: May 2025_
