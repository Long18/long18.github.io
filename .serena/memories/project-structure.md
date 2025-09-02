# Project Structure

## Root Directory
```
long18.github.io/
├── src/                    # Next.js application source
├── public/                 # Static assets for Next.js
├── assets/                 # Shared assets for all versions
├── Games/                  # Unity WebGL games
├── v1.0/                   # Legacy HTML portfolio v1.0
├── v2.0/                   # Legacy HTML portfolio v2.0
├── out/                    # Next.js build output
├── scripts/                # Build and utility scripts
├── docs/                   # Documentation
└── utils/                  # Portfolio extraction utilities
```

## Source Code Structure (src/)
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes (en/vi)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layout/           # Header, Footer, Layout
│   ├── providers/        # I18n, Theme providers
│   ├── sections/         # Home, About, Portfolio, Contact
│   ├── ui/               # Reusable UI components
│   └── templates/        # Page templates
├── data/                 # Static data and content
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization config
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Assets Structure
```
assets/
├── css/                   # Stylesheets for legacy versions
├── js/                    # JavaScript for legacy versions
├── images/                # Images, avatars, thumbnails
│   ├── application/       # App screenshots
│   ├── blog/             # Blog images
│   ├── game/             # Game assets
│   └── myself*.jpg       # Personal photos
├── videos/                # Game trailers and demos
├── fonts/                 # Custom web fonts
├── apk/                   # Android application files
└── zip/                   # Source code downloads
```

## Games Directory
```
Games/
├── DoggyMovement/         # Unity WebGL game
├── HomeWithGrandma/       # Unity WebGL game
├── HutingAnimal/          # Unity WebGL game
└── ToiletTapTap/          # Unity WebGL game
```

## Build Output
```
out/                       # Next.js static export
├── _next/                 # Next.js assets
├── assets/                # Copied from assets/
├── Games/                 # Copied from Games/
├── v1.0/                  # Copied from v1.0/
├── v2.0/                  # Copied from v2.0/
├── index.html             # Main page
└── *.html                 # Other pages
```