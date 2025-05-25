/**
 * Asset Path Mapping - Comprehensive list of all project images and their correct URLs
 * This file serves as the single source of truth for all asset paths used across the portfolio
 */

// Main project thumbnails (already correct GitHub URLs in projects.ts)
export const projectThumbnails = {
  heroicDefense: 'https://github.com/user-attachments/assets/80ad6adb-8497-4416-8a0e-cdd0bda4c0e2',
  iceBreakingBattle: 'https://github.com/user-attachments/assets/b45f3c89-d0ca-4e6a-a540-85f2ac8cc764',
  metameAmusementPark: 'https://github.com/Long18/long18.github.io/assets/28853225/d78990f0-2b48-4635-bf33-7ed637940f63',
  cryptoQuest: 'https://github.com/Long18/long18.github.io/assets/28853225/5f87b8cc-1f5d-4b41-a65b-edbf5aae5c8e',
  fireFireFire: 'https://github.com/Long18/long18.github.io/assets/28853225/7cc38bed-a36c-40ea-8a3f-8323b1a939fc',
  rpgRun: 'https://github.com/Long18/long18.github.io/assets/28853225/3e3a8224-9e92-4f64-b44f-22f6726bac81',
  pinoRacing: 'https://github.com/Long18/long18.github.io/assets/28853225/47ed817b-0cc5-431e-84a6-2af7cab8f9f6',
  hutingAnimal: 'https://github.com/Long18/long18.github.io/assets/28853225/6d597614-b8a8-4737-b31f-4045c3cab5e4',
  toiletTapTap: 'https://github.com/Long18/long18.github.io/assets/28853225/87ee7fc3-3de9-4894-b71e-abbac380eefc',
  doggyMovement: 'https://github.com/Long18/long18.github.io/assets/28853225/f1b7915f-de09-4b10-b4ea-dc0f5bf6408d',
  mugenHorror: 'https://github.com/Long18/long18.github.io/assets/28853225/5da79431-819d-43a5-99d8-45fa79777cc3',
  matchingCasino: 'https://github.com/Long18/long18.github.io/assets/28853225/c6f83fa4-06bd-4b57-ac77-cac9e75fcd07',
  homeWithGrandma: 'https://github.com/Long18/long18.github.io/assets/28853225/c71efedd-274a-4b56-8611-8e09f30e4846',
  fitnessCare: 'https://github.com/Long18/long18.github.io/assets/28853225/9a3f3803-80ce-4dc5-9e8b-111ef7ea7084',
  ffats: 'https://github.com/Long18/long18.github.io/assets/28853225/9a3f3803-80ce-4dc5-9e8b-111ef7ea7084'
};  // Local asset paths (from assets/images directory)
export const localAssets = {
  // Core UI assets
  avatar: '/assets/images/avatar.png',
  myAvatar: '/assets/images/my-avatar.png',
  logo: '/assets/logo.ico',
  
  // Service icons
  iconDev: '/assets/images/icon-dev.svg',
  iconApp: '/assets/images/icon-app.svg',
  iconDesign: '/assets/images/icon-design.svg',
  iconPhoto: '/assets/images/icon-photo.svg',
  iconQuote: '/assets/images/icon-quote.svg',
  
  // Store icons
  googlePlayIcon: '/assets/images/GooglePlay-Icon.svg',
  appStoreIcon: '/assets/images/AppStore-Icons.svg',
  
  // Navigation icons
  chevronLeft: '/assets/images/chevron-left.svg',
  chevronRight: '/assets/images/chevron-right.svg',
  
  // Homepage scene items and background images
  sceneItems: {
    item1: '/assets/images/item1.png',
    item3: '/assets/images/item3.png',
    item4: '/assets/images/item4.png',
    item5: '/assets/images/item5.svg',
    item6: '/assets/images/item6.svg',
    item7: '/assets/images/item7.svg',
    item8: '/assets/images/item8.svg',
    myself6: '/assets/images/myself6.jpg',
    myself7: '/assets/images/myself7.jpg'
  },
  
  // Background images
  backgrounds: {
    freelance: '/assets/images/freelance.jpg'
  },
  
  // Game screenshots (local fallbacks)
  game: {
    batteryManRun: '/assets/images/game/BatteryManRun.png',
    doggyMovement: '/assets/images/game/DoggyMovement.png',
    homeWithGrandma: '/assets/images/game/HWG.png',
    homeWithGrandmaBG: '/assets/images/game/BG_HWG.png',
    toiletTapTap: '/assets/images/game/ToiletTapTap.png',
    animalHunting: '/assets/images/game/animal_huting.png',
    boombang: '/assets/images/game/boombang.png',
    menuBoombang: '/assets/images/game/menu_boombang.png',
    cryptoQuest: '/assets/images/game/cryptoquest.png',
    mugenHorror: '/assets/images/game/mugenhorror.jpeg',
    playButton: '/assets/images/game/play.png'
  },
  
  // Blog and certificate images
  blog: {
    certification: '/assets/images/blog/Cerfitication.jpg'
  },
  
  // Application screenshots
  application: {
    fitnessHome: '/assets/images/application/fn_home.png',
    fitnessRecent: '/assets/images/application/fn_recent.png',
    applicationIcon: '/assets/images/application/icon_application.png',
    ffats: {
      client: '/assets/images/application/ffats/client.png',
      home: '/assets/images/application/ffats/home.png',
      logo: '/assets/images/application/ffats/logo.png',
      map: '/assets/images/application/ffats/map.png',
      server: '/assets/images/application/ffats/server.png',
      shipper: '/assets/images/application/ffats/shipper.png'
    }
  },
  
  // Video assets
  videos: {
    cryptoQuest: '/assets/videos/CryptoQuest.mp4',
    machingBaccarat: '/assets/videos/machingbaccarat.mp4',
    machingBaccaratThumb: '/assets/videos/machingbaccarat.jpg',
    mugenHorror: '/assets/videos/mugenhorror.mp4',
    pinoRacing: '/assets/videos/pinoracing.mp4',
    pinoRacingThumb: '/assets/videos/pinoracing.jpg'
  },
  
  // Downloadable files
  downloads: {
    apk: {
      boombang: '/assets/apk/Boombang.apk',
      doggyMovement: '/assets/apk/DoggyMovement.apk',
      ffatsClient: '/assets/apk/FFATS_Client.apk',
      fitnessCare: '/assets/apk/Fitnesscare.apk',
      homeWithGrandma: '/assets/apk/HomeWithGrandma.apk',
      huntingAnimal: '/assets/apk/HuntingAnimal.apk',
      toiletTapTap: '/assets/apk/ToiletTapTap.apk'
    },
    zip: {
      doggyMovement: '/assets/zip/DoggyMovement.zip',
      toiletTapTap: '/assets/zip/ToiletTapTap.zip'
    },
    // Games WebGL builds
    webgl: {
      doggyMovement: './Games/DoggyMovement/index.html',
      homeWithGrandma: './Games/HomeWithGrandma/index.html',
      huntingAnimal: './Games/HutingAnimal/index.html',
      toiletTapTap: './Games/ToiletTapTap/index.html'
    }
  }
};

// GitHub hosted image galleries for project details
export const projectGalleries = {
  heroicDefense: [
    'https://github.com/user-attachments/assets/80ad6adb-8497-4416-8a0e-cdd0bda4c0e2',
    'https://github.com/user-attachments/assets/79237991-15d5-4d12-a230-2ef02e009513',
    'https://github.com/user-attachments/assets/7b2b48f7-54eb-4711-9d0e-1a177bc84286',
    'https://github.com/user-attachments/assets/27c6435d-3ec5-48a5-a49d-ac4ec84f645f',
    'https://github.com/user-attachments/assets/15cab860-1208-47bf-928c-5ba763383877',
    'https://github.com/user-attachments/assets/be7e519b-1a2f-4fb6-80e7-743945762611'
  ],
  iceBreakingBattle: [
    'https://github.com/user-attachments/assets/f9591bca-b07b-4cb4-8d18-542a88b860ad',
    'https://github.com/user-attachments/assets/06e03ac3-5971-45df-89e1-320ce2bd4e19',
    'https://github.com/user-attachments/assets/a2932be6-554f-44a4-a589-8dd1012ded7a',
    'https://github.com/user-attachments/assets/b45f3c89-d0ca-4e6a-a540-85f2ac8cc764'
  ],
  metameAmusementPark: [
    'https://github.com/Long18/long18.github.io/assets/28853225/d78990f0-2b48-4635-bf33-7ed637940f63'
  ],
  cryptoQuest: [
    'https://github.com/Long18/long18.github.io/assets/28853225/ec260ea9-c07f-4775-b890-0450594b1adc',
    'https://github.com/user-attachment/assets/790edaa2-a8e6-4ab6-a6ec-b15acbe70caf',
    'https://github.com/user-attachment/assets/1ff2f712-b1d8-4f1b-9712-345a1a571b53',
    'https://github.com/user-attachment/assets/2f369a89-192e-4bc9-9356-12b65273672c',
    'https://github.com/user-attachment/assets/1c79da14-c16a-455c-8143-b31fd2b32f24',
    'https://github.com/user-attachment/assets/910ae1db-a140-44c6-bc9e-56ddcf380681',
    'https://github.com/user-attachment/assets/27c6435d-3ec5-48a5-a49d-ac4ec84f645f',
    'https://github.com/user-attachment/assets/60dc8f0e-9f30-4453-9b61-7491cebbfd10',
    'https://github.com/user-attachment/assets/e684b198-ecb5-4dc4-b6ad-522cbb8880cf'
  ],
  fireFireFire: [
    'https://github.com/Long18/long18.github.io/assets/28853225/ff590430-49d2-49f4-adad-a3c29e6360dd'
  ],
  rpgRun: [
    'https://github.com/Long18/long18.github.io/assets/28853225/6abb6842-6d73-4d75-b3d0-a58cde41d3a7'
  ],
  pinoRacing: [
    'https://github.com/Long18/long18.github.io/assets/28853225/7b43e00b-3b4d-4356-bd78-144ef5684aa3'
  ],
  hutingAnimal: [
    'https://github.com/Long18/long18.github.io/assets/28853225/6d597614-b8a8-4737-b31f-4045c3cab5e4'
  ],
  toiletTapTap: [
    'https://github.com/Long18/long18.github.io/assets/28853225/feb80801-8ec6-4404-91b5-8f6924134601'
  ],
  doggyMovement: [
    'https://github.com/Long18/long18.github.io/assets/28853225/f1b7915f-de09-4b10-b4ea-dc0f5bf6408d'
  ],
  mugenHorror: [
    'https://github.com/Long18/long18.github.io/assets/28853225/0c6c898e-f0c2-42eb-9ef7-17559136384b'
  ],
  matchingCasino: [
    'https://github.com/Long18/long18.github.io/assets/28853225/c6f83fa4-06bd-4b57-ac77-cac9e75fcd07'
  ],
  homeWithGrandma: [
    'https://github.com/Long18/long18.github.io/assets/28853225/c71efedd-274a-4b56-8611-8e09f30e4846',
    'https://github.com/Long18/long18.github.io/assets/28853225/b5aa1355-79d5-44df-835b-6733ede7852f',
    'https://github.com/Long18/long18.github.io/assets/28853225/8feda111-f926-4dda-b581-bfa08c592f5f'
  ],
  ffats: [
    'https://github.com/Long18/long18.github.io/assets/28853225/d9adb7aa-def6-4f3f-ba46-357f555e683b'
  ],
  fitnessCare: [
    'https://github.com/Long18/long18.github.io/assets/28853225/9a3f3803-80ce-4dc5-9e8b-111ef7ea7084'
  ]
};

// External links mapping
export const externalLinks = {
  playStore: {
    heroicDefense: 'https://play.google.com/store/apps/details?id=com.hd.heroic.defense',
    iceBreakingBattle: 'https://play.google.com/store/apps/details?id=com.ibb.ice.breaking.battle'
  },
  appStore: {
    heroicDefense: 'https://apps.apple.com/app/heroic-defense/id6742034673'
  },
  websites: {
    metameAmusementPark: 'https://www.metame.ne.jp/start',
    matchingCasino: 'https://kantan.game/easygame/game/483',
    pinoRacing: 'https://long18.github.io/StrippedPino-Racing/'
  },
  social: {
    matchingCasino: 'https://twitter.com/finggerOfficial/status/1727871840939594009'
  }
};

// Utility function to get asset path with fallback
export const getAssetPath = (assetKey: string, fallback?: string): string => {
  // Split the key by dots to access nested objects
  const keys = assetKey.split('.');
  let current: Record<string, unknown> = localAssets;
  
  for (const key of keys) {
    if (current[key] !== undefined && typeof current[key] === 'object') {
      current = current[key] as Record<string, unknown>;
    } else if (typeof current[key] === 'string') {
      return current[key] as string;
    } else {
      return fallback || '/assets/images/placeholder.png';
    }
  }
  
  return typeof current === 'string' ? current : fallback || '/assets/images/placeholder.png';
};

// Utility function to get project gallery images
export const getProjectGallery = (projectId: string): string[] => {
  return projectGalleries[projectId as keyof typeof projectGalleries] || [];
};

// Utility function to check if an asset exists
export const assetExists = (assetKey: string): boolean => {
  const keys = assetKey.split('.');
  let current: Record<string, unknown> = localAssets;
  
  for (const key of keys) {
    if (current[key] !== undefined && typeof current[key] === 'object') {
      current = current[key] as Record<string, unknown>;
    } else if (typeof current[key] === 'string') {
      return true;
    } else {
      return false;
    }
  }
  
  return typeof current === 'string';
};

const defaultExport = {
  projectThumbnails,
  localAssets,
  projectGalleries,
  externalLinks,
  getAssetPath,
  getProjectGallery,
  assetExists
};

export default defaultExport;
