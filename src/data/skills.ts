export const skillCategories = [
  {
    title: 'Language',
    skills: [
      { id: 'csharp', name: 'C#', category: 'programming' as const, level: 'expert' as const },
      { id: 'cpp', name: 'Modern C/C++', category: 'programming' as const, level: 'advanced' as const },
      { id: 'java', name: 'Java', category: 'programming' as const, level: 'intermediate' as const },
      { id: 'html5', name: 'HTML5', category: 'programming' as const, level: 'intermediate' as const },
      { id: 'typescript', name: 'TypeScript', category: 'programming' as const, level: 'intermediate' as const },
      { id: 'javascript', name: 'JavaScript', category: 'programming' as const, level: 'intermediate' as const },
      { id: 'php', name: 'PHP', category: 'programming' as const, level: 'beginner' as const },
      { id: 'lua', name: 'Lua', category: 'programming' as const, level: 'beginner' as const }
    ]
  },
  {
    title: 'Engine',
    skills: [
      { id: 'unity', name: 'Unity', category: 'game-engines' as const, level: 'expert' as const },
      { id: 'unreal', name: 'Unreal', category: 'game-engines' as const, level: 'advanced' as const }
    ]
  },
  {
    title: 'Tools',
    skills: [
      { id: 'git', name: 'Git', category: 'tools' as const, level: 'advanced' as const },
      { id: 'github', name: 'Github Project', category: 'tools' as const, level: 'advanced' as const },
      { id: 'trello', name: 'Trello', category: 'tools' as const, level: 'intermediate' as const },
      { id: 'ai', name: 'Generative AI', category: 'tools' as const, level: 'intermediate' as const },
      { id: 'notion', name: 'Notion', category: 'tools' as const, level: 'intermediate' as const },
      { id: 'blender', name: 'Blender', category: 'tools' as const, level: 'beginner' as const },
      { id: 'jira', name: 'Jira', category: 'tools' as const, level: 'intermediate' as const },
      { id: 'photoshop', name: 'Photoshop', category: 'tools' as const, level: 'beginner' as const },
      { id: 'office', name: 'Offices', category: 'tools' as const, level: 'intermediate' as const }
    ]
  },
  {
    title: 'Principle',
    skills: [
      { id: 'oop', name: 'OOP', category: 'programming' as const, level: 'expert' as const },
      { id: 'design-patterns', name: 'Design Patterns', category: 'programming' as const, level: 'advanced' as const },
      { id: 'solid', name: 'SOLID', category: 'programming' as const, level: 'advanced' as const },
      { id: 'tdd', name: 'TDD', category: 'programming' as const, level: 'intermediate' as const },
      { id: 'dry', name: 'DRY', category: 'programming' as const, level: 'advanced' as const },
      { id: 'kiss', name: 'KISS', category: 'programming' as const, level: 'advanced' as const },
      { id: 'yagni', name: 'YAGNI', category: 'programming' as const, level: 'advanced' as const }
    ]
  },
  {
    title: 'IDE',
    skills: [
      { id: 'rider', name: 'Rider', category: 'tools' as const, level: 'advanced' as const },
      { id: 'vs', name: 'Visual Studio', category: 'tools' as const, level: 'advanced' as const },
      { id: 'vscode', name: 'VS Code', category: 'tools' as const, level: 'advanced' as const },
      { id: 'android-studio', name: 'Android Studio', category: 'tools' as const, level: 'intermediate' as const }
    ]
  },
  {
    title: 'Soft Skills',
    skills: [
      { id: 'teamwork', name: 'Teamwork', category: 'soft-skills' as const, level: 'advanced' as const },
      { id: 'leadership', name: 'Leadership', category: 'soft-skills' as const, level: 'intermediate' as const },
      { id: 'communication', name: 'Communication', category: 'soft-skills' as const, level: 'advanced' as const },
      { id: 'critical-thinking', name: 'Critical Thinking', category: 'soft-skills' as const, level: 'advanced' as const },
      { id: 'problem-solving', name: 'Problem Solving', category: 'soft-skills' as const, level: 'advanced' as const }
    ]
  }
];

export const mainSkills = [
  {
    title: 'Language',
    skills: ['C#', 'Modern C/C++']
  },
  {
    title: 'Engine', 
    skills: ['Unity', 'Unreal']
  },
  {
    title: 'Principle',
    skills: ['OOP', 'SOLID', 'TDD']
  }
];
