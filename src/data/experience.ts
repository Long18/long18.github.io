import { Experience, Education } from '@/types';

export const experiences: Experience[] = [
  {
    id: 'amanotes-2025',
    company: 'Amanotes Pte. Ltd.',
    position: 'Unity Developer',
    startDate: '2025-01',
    endDate: undefined,
    current: true,
    description: 'Amanotes is a Vietnamese mobile game developer that combines music and technology to make engaging games for people worldwide. They were identified by the Google Play team at Indie Game Developer Day in Vietnam in early 2017 as a high-potential indie, and now they have over 100 million installs on the Play Store.',
    achievements: [],
    technologies: ['Unity', 'C#'],
    location: 'Ho Chi Minh City'
  },
  {
    id: 'playad-2024',
    company: 'PlayAd Co., Ltd.',
    position: 'Game Engineer',
    startDate: '2024-05',
    endDate: '2025-01',
    current: false,
    description: 'PlayAd specializes in developing high-quality casual, hybrid-casual, hyper-casual, and mid core games. We foster innovation and collaboration, helping developers bring creative visions to life in a dynamic and supportive environment.',
    achievements: [
      'Use GitHub Projects to manage Product and Sprint Backlogs. Create cards for each backlog item and move them through columns representing different stages of development.',
      'Use GitHub Issues to track specific tasks or bugs, and link them to your project board for better visibility.',
      'Conduct code reviews using GitHub Pull Requests to ensure code quality and facilitate team collaboration.',
      'Applied SOLID principles and OOP techniques to create a codebase that is both scalable and easy to maintain.',
      'Conduct regular code reviews with your team to share knowledge and improve code quality.',
      'Worked closely with a Game Designer to customize game levels and improve the gaming experience.',
      'Utilized Git for team collaboration.'
    ],
    technologies: ['Unity', 'C#', 'Git', 'GitHub'],
    location: 'Ho Chi Minh City'
  },
  {
    id: 'indigames-2022-2024',
    company: 'Indigames Inc.',
    position: 'Game Developer',
    startDate: '2022-06',
    endDate: '2024-04',
    current: false,
    description: 'Indigames provides an easy-to-use game engine, high performance services, and high-quality game assets to enable anyone to create their own dreaming games, aiming to success in the game market.',
    achievements: [
      'Skilled in Unreal Engine, with experience in customizing, creating blueprints, and coding in C++.',
      'Experienced in leveraging Unity for various game genres such as RPGs, idle, runners, and hypercasual games.',
      'Applied porting and optimization techniques to adapt games for various platforms and improve overall performance.',
      'Created sophisticated gameplay mechanics for a mid-core RPG, including intricate systems for quests, maps, battles, abilities, loot, and cutscenes.',
      'Employed SOLID principles and Object-Oriented Programming (OOP) concepts to design and execute a scalable and easily maintainable codebase.',
      'Engaged in close collaboration with cross-functional teams within an Agile Scrum environment to ensure timely delivery of high-quality game features.',
      'Established Continuous Integration/Continuous Deployment (CI/CD) pipelines using GitHub Actions, AWS CodePipeline, and Jenkins for streamlined automated builds, tests, and deployments.',
      'Collaborated with a Game Designer to customize game levels and enhance gameplay.',
      'Actively participated in game design training courses to expand knowledge and expertise.',
      'Collaborated with a Game Designer to tailor game levels and enhance gaming experience.',
      'Acquainted myself with the intricacies of game development stages, encompassing pre-production, production, and post-production phases.',
      'Employed git for team collaboration purposes.'
    ],
    technologies: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Git', 'AWS', 'Jenkins'],
    location: 'Ho Chi Minh City'
  },
  {
    id: 'indigames-trainee-2022',
    company: 'Indigames Inc.',
    position: 'Trainee Game Developer',
    startDate: '2022-04',
    endDate: '2022-06',
    current: false,
    description: 'Trainee position at Indigames Inc.',
    achievements: [
      'Collaborated with a Game Designer to tailor game levels and enhance gaming experience.',
      'Familiarized myself with the complexities of the various stages of game development, including pre-production, production, and post-production phases.',
      'Employed git for team collaboration purposes.',
      'Developed mini-games inspired by Unity Learn tutorials to assess proficiency.',
      'Engaged in training sessions focusing on game design.',
      'Completed all Unity Learn courses as part of ongoing learning endeavors.'
    ],
    technologies: ['Unity', 'C#', 'Git'],
    location: 'Ho Chi Minh City'
  }
];

export const education: Education[] = [
  {
    id: 'hutech-2018-2023',
    institution: 'HO CHI MINH CITY UNIVERSITY OF TECHNOLOGY - HUTECH',
    degree: "Engineer's degree",
    field: 'Information Technology',
    startDate: '2018-09',
    endDate: '2023-09',
    gpa: '3.14/4.0',
    description: 'Specialized: Software Engineer.',
    achievements: []
  }
];
