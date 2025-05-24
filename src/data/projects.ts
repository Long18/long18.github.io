import { Project } from '../types';

export const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'unity', label: 'Unity Games' },
  { id: 'unreal', label: 'Unreal Games' },
  { id: 'web', label: 'Web Apps' },
  { id: 'mobile', label: 'Mobile Apps' },
  { id: 'ai', label: 'AI Projects' }
];

export const projects: Project[] = [
  {
    id: 'heroicDefense',
    title: 'Heroic Defense',
    category: 'unity',
    image: 'https://github.com/user-attachments/assets/80ad6adb-8497-4416-8a0e-cdd0bda4c0e2',
    description: 'A tower defense game with strategic gameplay mechanics.',
    technologies: ['Unity', 'C#'],
    featured: true,
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.ibb.heroic.defense',
      appStore: 'https://apps.apple.com/app/heroic-defense/id6742034673'
    },
    details: {
      period: 'May/2023 — Feb/2024',
      description: 'This game, inspired by Dragon Quest, operates in turns and incorporates various intricate elements such as abilities, levels, quests, inventory, battles, levels, NPCs, cutscenes, and more. The entire gameplay experience is enriched by an immersive storyline.',
      responsibilities: [
        'Developed complex enemy behaviors, including intelligent movement and attack strategies.',
        'Implemented power-up systems like bombs, special discs, and enhanced player abilities.',
        'Designed and balanced multiple levels with distinct challenges and environments.',
        'Built dynamic reward systems, including currency synchronization and gem-to-coin conversion.',
        'Enhanced gameplay mechanics with physics-based collision handling and power disc effects.'
      ],
      achievements: [
        'Task Management: Successfully divided tasks clearly among the team members, ensuring efficiency and accountability.',
        'Agile Process: Followed Agile/Scrum methodologies to ensure smooth project development and delivery.',
        'Gameplay Enhancements: Delivered innovative enemy behaviors and combat systems, providing a more engaging experience.',
        'Performance Optimization: Optimized game mechanics, ensuring high performance and stability during gameplay.',
        'Global Success: Achieved 10K - 50K downloads: A significant milestone as of January 2025.',
        'Global Success: Achieved over 200K downloads: A significant milestone after one month of release.'
      ],
      images: [
        'https://github.com/user-attachments/assets/80ad6adb-8497-4416-8a0e-cdd0bda4c0e2',
        'https://github.com/user-attachments/assets/79237991-15d5-4d12-a230-2ef02e009513',
        'https://github.com/user-attachments/assets/7b2b48f7-54eb-4711-9d0e-1a177bc84286',
        'https://github.com/user-attachments/assets/27c6435d-3ec5-48a5-a49d-ac4ec84f645f',
        'https://github.com/user-attachments/assets/15cab860-1208-47bf-928c-5ba763383877',
        'https://github.com/user-attachments/assets/be7e519b-1a2f-4fb6-80e7-743945762611'
      ]
    }
  },
  {
    id: 'iceBreakingBattle',
    title: 'Ice Breaking Battle',
    category: 'unity',
    image: 'https://github.com/user-attachments/assets/b45f3c89-d0ca-4e6a-a540-85f2ac8cc764',
    description: 'An ice-breaking battle game with physics-based gameplay.',
    technologies: ['Unity', 'C#'],
    featured: true,
    links: {
      playStore: 'https://play.google.com/store/apps/details?id=com.ibb.ice.breaking.battle'
    },
    details: {
      period: 'Jan/2023 — June/2024',
      description: 'A physics-based ice breaking battle game with strategic elements.',
      responsibilities: [
        'Developed core gameplay mechanics',
        'Implemented physics systems',
        'Created user interface'
      ],
      achievements: [
        'Successfully implemented complex physics interactions',
        'Optimized performance for mobile devices'
      ],
      images: [
        'https://github.com/user-attachments/assets/b45f3c89-d0ca-4e6a-a540-85f2ac8cc764'
      ]
    }
  },
  {
    id: 'metameAmusementPark',
    title: 'Metame Amusement Park',
    category: 'unreal',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/d78990f0-2b48-4635-bf33-7ed637940f63',
    description: 'An Unreal Engine amusement park simulation.',
    technologies: ['Unreal Engine', 'C++', 'Blueprint'],
    featured: true,
    links: {
      website: 'https://kantan.game/easygame'
    },
    details: {
      period: 'Jan/2023 — June/2024',
      description: 'A virtual amusement park experience built with Unreal Engine.',
      responsibilities: [
        'Developed VR experiences',
        'Created interactive environments',
        'Implemented character systems'
      ],
      achievements: [
        'Successfully reduced the complexity of 3D object meshes, resulting in a 40% improvement in game performance and a 25% decrease in loading times.'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/d78990f0-2b48-4635-bf33-7ed637940f63'
      ]
    }
  },
  {
    id: 'cryptoquest',
    title: 'Crypto Quest',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/5f87b8cc-1f5d-4b41-a65b-edbf5aae5c8e',
    description: 'A Dragon Quest-inspired turn-based RPG with blockchain elements.',
    technologies: ['Unity', 'C#'],
    featured: true,
    links: {
      website: 'https://crypto-quest.org/',
      demo: 'https://games.indigames.link/crypto-quest/stg/'
    },
    details: {
      period: 'May/2023 — Feb/2024',
      description: 'This game, inspired by Dragon Quest, operates in turns and incorporates various intricate elements such as abilities, levels, quests, inventory, battles, levels, NPCs, cutscenes, and more. The entire gameplay experience is enriched by an immersive storyline.',
      responsibilities: [
        'Implemented core gameplay mechanics including ability system, quest system, audio system',
        'Developed inventory system, dialog system, cheat system',
        'Created inn system, settings system timeline, and cutscene system',
        'Built turn-based combat mechanics',
        'Designed character progression systems'
      ],
      achievements: [
        'Successfully implemented comprehensive RPG systems',
        'Delivered a fully functional turn-based combat system',
        'Created immersive cutscene experiences',
        'Recognized for outstanding teamwork and contributions during project development'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/ec260ea9-c07f-4775-b890-0450594b1adc',
        'https://github.com/Long18/long18.github.io/assets/28853225/73ff3c78-9475-48d1-9f99-7cc686e618f7',
        'https://github.com/Long18/long18.github.io/assets/28853225/957fb9ae-cb17-44a0-8ff5-dbca4a03cfa9',
        'https://github.com/Long18/long18.github.io/assets/28853225/60bd840f-9942-49ec-929c-9497b0d7717a',
        'https://github.com/Long18/long18.github.io/assets/28853225/aae1b3d5-0aaa-492c-87e3-1016088ed903',
        'https://github.com/Long18/long18.github.io/assets/28853225/643fa9c6-025b-4120-b703-7580ce6617bf',
        'https://github.com/Long18/long18.github.io/assets/28853225/ba6adc74-b14c-4884-99b2-69968bacdf2b'
      ],
      videos: [
        {
          poster: 'https://github.com/Long18/long18.github.io/assets/28853225/2aa03da8-cdf0-4c39-857a-a53e6478a2ac',
          src: 'assets/videos/CryptoQuest.mp4'
        }
      ]
    }
  },
  {
    id: 'fireFireFire',
    title: 'Fire Fire Fire',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/7cc38bed-a36c-40ea-8a3f-8323b1a939fc',
    description: 'A casual game designed for Kantan Game platform.',
    technologies: ['Unity', 'C#'],
    featured: false,
    links: {
      website: 'https://kantan.game/easygame',
      demo: 'https://kantan.game/easygame/game/489'
    },
    details: {
      period: 'Jan/2023 — June/2024',
      description: 'Kantan Game is a website offering a variety of casual games and daily quizzes. It features easy-to-play games designed for quick entertainment.',
      responsibilities: [
        'Developed a new inventory system to enhance gameplay functionality',
        'Reduced the complexity of 3D object meshes to optimize performance',
        'Integrated an ad system to enhance monetization'
      ],
      achievements: [
        'Successfully reduced the complexity of 3D object meshes, resulting in a 40% improvement in game performance and a 25% decrease in loading times.',
        'Integrated an ad system, increasing game monetization and boosting revenue.',
        'Developed a item rewards to improve gaming functionality, resulting in a more seamless user experience and more player retention.'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/ff590430-49d2-49f4-adad-a3c29e6360dd'
      ],
      videos: [
        {
          poster: 'https://github.com/Long18/long18.github.io/assets/28853225/2d8ea356-74db-4ce6-8c06-e205b4439fe4',
          src: 'assets/videos/FireFireFire.mp4'
        }
      ]
    }
  },
  {
    id: 'rpgRun',
    title: 'The Brave',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/3e3a8224-9e92-4f64-b44f-22f6726bac81',
    description: 'An RPG runner game with adventure elements.',
    technologies: ['Unity', 'C#'],
    featured: false,
    details: {
      period: 'Personal Project',
      description: 'An RPG-style runner game featuring adventure mechanics and character progression.',
      responsibilities: [
        'Designed core gameplay mechanics',
        'Implemented character progression',
        'Created level designs'
      ],
      achievements: [
        'Successfully implemented RPG mechanics in a runner format'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/6abb6842-6d73-4d75-b3d0-a58cde41d3a7'
      ]
    }
  },
  {
    id: 'pinoRacing',
    title: 'Pino Racing',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/47ed817b-0cc5-431e-84a6-2af7cab8f9f6',
    description: 'A promotional AR racing game developed with Unity.',
    technologies: ['Unity', 'C#', 'AR'],
    featured: false,
    links: {
      demo: 'https://long18.github.io/StrippedPino-Racing/'
    },
    details: {
      period: 'May/2022 — Sep/2022',
      description: 'Pino Racing is a promotion game developed with Unity like AR Game.',
      responsibilities: [
        'Created maps using PathCreator and integrated Twitter sharing features',
        'Customized WebGL builds with WebGLTemplates to align precisely with client requirements',
        'Managed item spawning mechanics, including the Stick item, with precise fall trajectory calculations',
        'Innovated the development of AI-controlled racing cars (CPU) for engaging player experiences'
      ],
      achievements: [
        'Successfully integrated PathCreator for dynamic map creation and integrated Twitter sharing',
        'Customized WebGL builds using WebGLTemplates to align precisely with client specifications',
        'Implemented advanced item spawning management with intricate fall trajectory calculations'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/7b43e00b-3b4d-4356-bd78-144ef5684aa3'
      ]
    }
  },
  {
    id: 'hutingAnimal',
    title: 'Huting Animal',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/6d597614-b8a8-4737-b31f-4045c3cab5e4',
    description: 'A hunting simulation game.',
    technologies: ['Unity', 'C#'],
    featured: false,
    links: {
      demo: './Games/HutingAnimal/index.html',
      apk: './assets/apk/HuntingAnimal.apk',
      windows: './assets/zip/HuntingAnimal.zip'
    },
    details: {
      period: 'Personal Project',
      description: 'A hunting simulation game with various animal targets.',
      responsibilities: [
        'Developed hunting mechanics',
        'Created animal AI behaviors',
        'Implemented weapon systems'
      ],
      achievements: [
        'Successfully created realistic hunting simulation'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/6d597614-b8a8-4737-b31f-4045c3cab5e4'
      ]
    }
  },
  {
    id: 'toiletTapTap',
    title: 'Toilet Tap Tap',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/87ee7fc3-3de9-4894-b71e-abbac380eefc',
    description: 'A casual tapping game.',
    technologies: ['Unity', 'C#'],
    featured: false,
    links: {
      demo: './Games/ToiletTapTap/index.html',
      apk: './assets/apk/ToiletTapTap.apk',
      windows: './assets/zip/ToiletTapTap.zip'
    },
    details: {
      period: '18 June 2020',
      description: 'A casual tapping game with simple mechanics.',
      responsibilities: [
        'Developed core tapping mechanics',
        'Created user interface',
        'Implemented scoring system'
      ],
      achievements: [
        'Successfully created engaging casual gameplay'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/feb80801-8ec6-4404-91b5-8f6924134601'
      ]
    }
  },
  {
    id: 'doggyMovement',
    title: 'Doggy Movement',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/f1b7915f-de09-4b10-b4ea-dc0f5bf6408d',
    description: 'A game featuring doggy movement mechanics.',
    technologies: ['Unity', 'C#'],
    featured: false,
    links: {
      demo: './Games/DoggyMovement/index.html',
      apk: './assets/apk/DoggyMovement.apk',
      windows: './assets/zip/DoggyMovement.zip'
    },
    details: {
      period: 'Personal Project',
      description: 'A game showcasing advanced movement mechanics for a dog character.',
      responsibilities: [
        'Developed movement systems',
        'Created character animations',
        'Implemented physics interactions'
      ],
      achievements: [
        'Successfully created smooth character movement mechanics'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/f1b7915f-de09-4b10-b4ea-dc0f5bf6408d'
      ]
    }
  },
  {
    id: 'mugenHorror',
    title: 'Mugen Horror',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/mugenhorror.jpeg',
    description: 'A multi-genre horror game with exploration and combat elements.',
    technologies: ['Unity', 'C#'],
    featured: true,
    details: {
      period: 'Jun/2022 — Nov/2022',
      status: 'The platform has been shut down',
      description: 'This multi-genre game allows players to explore haunted locations, uncover their stories, and defeat main ghosts. In each level, players begin by searching and solving puzzles to find the key to the room where the main ghost resides. Upon entering that room, players engage in combat mode with the ghost.',
      responsibilities: [
        'Separated scenes (addition of a loading scene) with a scene loading system',
        'Implemented enemy stats with an already available game ability system',
        'Created new skills for enemies/bosses based on the game ability system',
        'Wrote unit tests for new skills'
      ],
      achievements: [
        'Developed and implemented a scene loading system that significantly improved game flow and reduced loading times',
        'Successfully integrated enemy stats using the existing game ability system',
        'Implemented new enemy and boss skills that leveraged the game ability system',
        'Developed comprehensive unit tests for the newly created skills'
      ],
      teamSize: '18 individuals: 8 front-end, 3 back-end, 1 project owner, 1 director, 4 designers, 1 tester',
      images: []
    }
  },
  {
    id: 'matchingCasino',
    title: 'Matching Casino',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/c6f83fa4-06bd-4b57-ac77-cac9e75fcd07',
    description: 'A casino-style matching game with live streaming integration.',
    technologies: ['Unity', 'C#'],
    featured: false,
    links: {
      demo: 'https://kantan.game/easygame/game/483'
    },
    details: {
      period: 'Development Period',
      description: 'A casino-style matching game designed to complement the live streaming experience. Viewers receive gifts from the streamer within the game, amplifying interactivity and engagement during live streams.',
      responsibilities: [
        'Developed a feature to calculate and display player rankings',
        'Implemented chip distribution system based on performance',
        'Created live streaming integration features'
      ],
      achievements: [
        'Successfully integrated live streaming features',
        'Enhanced viewer engagement through interactive elements'
      ],
      teamSize: 'Over 4 members: 2 front-end, 1+ back-end, 1 tester',
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/c6f83fa4-06bd-4b57-ac77-cac9e75fcd07'
      ]
    }
  },
  {
    id: 'homeWithGrandma',
    title: 'Home With Grandma',
    category: 'unity',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/c71efedd-274a-4b56-8611-8e09f30e4846',
    description: 'A GameJam 2020 survival game about caring for grandmother.',
    technologies: ['Unity', 'C#'],
    featured: false,
    links: {
      demo: './Games/HomeWithGrandma/index.html',
      apk: './assets/apk/HomeWithGrandma.apk'
    },
    details: {
      period: 'GameJam 2020',
      description: 'Players must navigate around the house to collect rescue chests and emergency kits containing equipment and essential items to accompany their grandmother for as long as possible.',
      responsibilities: [
        'Developed core gameplay mechanics',
        'Implemented survival systems',
        'Created character movement controls'
      ],
      achievements: [
        'Successfully completed GameJam 2020 project',
        'Created engaging survival gameplay mechanics'
      ],
      teamSize: '3 individuals: 3 Unity engine developers for GameJam 2020 of GameLoft',
      gameplay: [
        'Movement is controlled using two arrow buttons located on the left side of the screen',
        'To jump, players can tap the jump button provided on the right side of the screen',
        'Collect rescue chests and emergency kits to survive longer'
      ],
      images: [
        'https://github.com/Long18/long18.github.io/assets/28853225/c71efedd-274a-4b56-8611-8e09f30e4846',
        'https://github.com/Long18/long18.github.io/assets/28853225/fa7cb095-18ed-4cf6-860f-a644a2f1155c',
        'https://github.com/Long18/long18.github.io/assets/28853225/3656510c-2e07-4dcb-b1f4-eeaec129fd81',
        'https://github.com/Long18/long18.github.io/assets/28853225/e6f0ff9f-9d04-4a00-8642-10aa6500ba76'
      ]
    }
  },
  {
    id: 'ffats',
    title: 'FFATS - Fast Food Delivery App',
    category: 'application',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/9a3f3803-80ce-4dc5-9e8b-111ef7ea7084',
    description: 'A fast food delivery application with route optimization.',
    technologies: ['Android Studio', 'Java', 'Google Maps API'],
    featured: false,
    links: {
      github: 'https://github.com/Long18/FFAST_Food_Delivering',
      apk: './assets/apk/FFATS_Client.apk'
    },
    details: {
      period: 'Academic Project',
      description: 'FFATS quick booking food app with advanced route optimization using Dijkstra\'s algorithm.',
      responsibilities: [
        'Data system design and building',
        'Design of functions and data processing',
        'Dijkstra\'s algorithm implementation',
        'Priority queue implementation',
        'Map direction integration',
        'Design UX/UI'
      ],
      achievements: [
        'Research and use map data retrieved from OpenStreetMap',
        'Understand how to use Google Map API',
        'Understand Dijkstra\'s algorithm implementation',
        'Successfully created efficient delivery route system'
      ],
      technologies_detailed: [
        'Data system design and building',
        'Google Maps API integration',
        'Dijkstra\'s algorithm for route optimization',
        'Priority queue implementation',
        'OpenStreetMap data integration'
      ],
      images: []
    }
  },
  {
    id: 'fitnessCare',
    title: 'Fitness Scheduler & Time Management',
    category: 'application',
    image: 'https://github.com/Long18/long18.github.io/assets/28853225/9a3f3803-80ce-4dc5-9e8b-111ef7ea7084',
    description: 'A comprehensive fitness scheduling and time management application.',
    technologies: ['Android Studio', 'Java'],
    featured: false,
    details: {
      period: 'Academic Project',
      description: 'A comprehensive fitness application for scheduling workouts and managing fitness routines.',
      responsibilities: [
        'Developed scheduling systems',
        'Created workout tracking features',
        'Implemented user management'
      ],
      achievements: [
        'Successfully created comprehensive fitness management system'
      ],
      images: []
    }
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};