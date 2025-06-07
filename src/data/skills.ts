// === SINGLE SOURCE OF TRUTH FOR ALL DATA ===

// Professional Statistics (used across multiple components)
export const professionalStats = {
  yearsExperience: '3+',
  projectsCompleted: '15+',
  clientSatisfaction: '100%',
  supportAvailability: '24/7',
  technologies: '20+',
  teamProjects: '10+',
  codePassion: '24/7',
  responseTime: '< 24h',
  availability: '24/7',
  languages: 'EN/VI',
  projectsReady: 'Ready'
};

// Skills Database
export const skillCategories = [
  {
    title: 'Language',
    skills: [
      { id: 'csharp', name: 'C#', category: 'programming' as const, description: 'C Sharp - Object-oriented programming language' },
      { id: 'cpp', name: 'Modern C/C++', category: 'programming' as const, description: 'C/C++ - High-performance system programming languages' },
      { id: 'java', name: 'Java', category: 'programming' as const, description: 'Java - Cross-platform object-oriented programming language' },
      { id: 'html5', name: 'HTML5', category: 'programming' as const, description: 'HyperText Markup Language 5 - Web content structure' },
      { id: 'typescript', name: 'TypeScript', category: 'programming' as const, description: 'TypeScript - JavaScript with static type definitions' },
      { id: 'javascript', name: 'JavaScript', category: 'programming' as const, description: 'JavaScript - Dynamic programming language for web development' },
      { id: 'php', name: 'PHP', category: 'programming' as const, description: 'PHP: Hypertext Preprocessor - Server-side scripting language' },
      { id: 'lua', name: 'Lua', category: 'programming' as const, description: 'Lua - Lightweight scripting language' }
    ]
  },
  {
    title: 'Engine',
    skills: [
      { id: 'unity', name: 'Unity', category: 'game-engines' as const, description: 'Unity - Cross-platform game development engine' },
      { id: 'unreal', name: 'Unreal', category: 'game-engines' as const, description: 'Unreal Engine - AAA game development platform' }
    ]
  },
  {
    title: 'Tools',
    skills: [
      { id: 'git', name: 'Git', category: 'tools' as const, description: 'Git - Distributed version control system' },
      { id: 'github', name: 'Github Project', category: 'tools' as const, description: 'GitHub - Web-based Git repository hosting service' },
      { id: 'trello', name: 'Trello', category: 'tools' as const, description: 'Trello - Kanban-style project management tool' },
      { id: 'ai', name: 'Generative AI', category: 'tools' as const, description: 'Artificial Intelligence - Machine learning for content generation' },
      { id: 'notion', name: 'Notion', category: 'tools' as const, description: 'Notion - All-in-one workspace for notes and collaboration' },
      { id: 'blender', name: 'Blender', category: 'tools' as const, description: 'Blender - 3D modeling and animation software' },
      { id: 'jira', name: 'Jira', category: 'tools' as const, description: 'Jira - Agile project management and issue tracking' },
      { id: 'photoshop', name: 'Photoshop', category: 'tools' as const, description: 'Adobe Photoshop - Digital image editing software' },
      { id: 'office', name: 'Offices', category: 'tools' as const, description: 'Microsoft Office - Productivity software suite' },
      { id: 'obsidian', name: 'Obsidian', category: 'tools' as const, description: 'Obsidian - Knowledge base and note-taking app' }
    ]
  },
  {
    title: 'Principle',
    skills: [
      { id: 'oop', name: 'OOP', category: 'programming' as const, description: 'Object-Oriented Programming - Programming paradigm based on objects' },
      { id: 'design-patterns', name: 'Design Patterns', category: 'programming' as const, description: 'Design Patterns - Reusable solutions to common software problems' },
      { id: 'solid', name: 'SOLID', category: 'programming' as const, description: 'SOLID Principles - Five design principles for maintainable software' },
      { id: 'tdd', name: 'TDD', category: 'programming' as const, description: 'Test-Driven Development - Development process driven by tests' },
      { id: 'dry', name: 'DRY', category: 'programming' as const, description: 'Don\'t Repeat Yourself - Software development principle' },
      { id: 'kiss', name: 'KISS', category: 'programming' as const, description: 'Keep It Simple, Stupid - Design principle favoring simplicity' },
      { id: 'yagni', name: 'YAGNI', category: 'programming' as const, description: 'You Aren\'t Gonna Need It - Principle of extreme programming' }
    ]
  },
  {
    title: 'IDE',
    skills: [
      { id: 'rider', name: 'Rider', category: 'tools' as const, description: 'JetBrains Rider - Cross-platform .NET IDE' },
      { id: 'vs', name: 'Visual Studio', category: 'tools' as const, description: 'Microsoft Visual Studio - Integrated development environment' },
      { id: 'vscode', name: 'VS Code', category: 'tools' as const, description: 'Visual Studio Code - Lightweight source code editor' },
      { id: 'android-studio', name: 'Android Studio', category: 'tools' as const, description: 'Android Studio - Official IDE for Android development' },
      { id: 'xcode', name: 'Xcode', category: 'tools' as const, description: 'Xcode - IDE for macOS and iOS development' },
      { id: 'dotpeek', name: 'dotPeek', category: 'tools' as const, description: 'dotPeek - .NET decompiler and assembly browser' }
    ]
  },
  {
    title: 'Soft Skills',
    skills: [
      { id: 'teamwork', name: 'Teamwork', category: 'soft-skills' as const, description: 'Teamwork - Collaborative work within a group to achieve goals' },
      { id: 'leadership', name: 'Leadership', category: 'soft-skills' as const, description: 'Leadership - Ability to guide and motivate teams' },
      { id: 'communication', name: 'Communication', category: 'soft-skills' as const, description: 'Communication - Effective information exchange and interaction' },
      { id: 'critical-thinking', name: 'Critical Thinking', category: 'soft-skills' as const, description: 'Critical Thinking - Objective analysis and evaluation of issues' },
      { id: 'problem-solving', name: 'Problem Solving', category: 'soft-skills' as const, description: 'Problem Solving - Identifying and resolving complex challenges' }
    ]
  }
];

// Main Skills for Hero Section (derived from skillCategories)
export const mainSkills = [
  {
    title: 'Language',
    skills: skillCategories.find(cat => cat.title === 'Language')?.skills.filter(skill =>
      ['csharp', 'cpp'].includes(skill.id)
    ).map(skill => ({ id: skill.id, name: skill.name })) || []
  },
  {
    title: 'Engine',
    skills: skillCategories.find(cat => cat.title === 'Engine')?.skills.map(skill =>
      ({ id: skill.id, name: skill.name })
    ) || []
  },
  {
    title: 'Principle',
    skills: skillCategories.find(cat => cat.title === 'Principle')?.skills.filter(skill =>
      ['oop', 'solid', 'tdd'].includes(skill.id)
    ).map(skill => ({ id: skill.id, name: skill.name })) || []
  }
];
