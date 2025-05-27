import React from 'react';
import { 
    IconBrandCSharp,
    IconBrandCpp,
    IconBrandJavascript,
    IconBrandTypescript,
    IconBrandHtml5,
    IconBrandPhp,
    IconBrandUnity,
    IconBrandGit,
    IconBrandGithub,
    IconBrandVscode,
    IconBrandNotion,
    IconBrandTrello,
    IconBrandBlender,
    IconBrandAndroid,
    IconCoffee,
    IconMoon,
    IconRocket,
    IconRobot,
    IconFileSpreadsheet,
    IconPuzzle,
    IconShield,
    IconFlask,
    IconRefresh,
    IconCut,
    IconTarget,
    IconGenderGenderfluid,
    IconBrandVisualStudio,
    IconUsers,
    IconCrown,
    IconMessage,
    IconBrain,
    IconTool,
    IconBuildingArch
} from '@tabler/icons-react';

interface SkillIconProps {
  skillId: string;
  className?: string;
  size?: number;
}

// Mapping from skill IDs to Tabler Icon components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const skillTablerIcons: Record<string, React.ComponentType<any>> = {
  // Programming Languages
  'csharp': IconBrandCSharp,
  'cpp': IconBrandCpp,
  'java': IconCoffee,
  'html5': IconBrandHtml5,
  'typescript': IconBrandTypescript,
  'javascript': IconBrandJavascript,
  'php': IconBrandPhp,
  'lua': IconMoon,

  // Game Engines
  'unity': IconBrandUnity,
  'unreal': IconRocket,

  // Tools
  'git': IconBrandGit,
  'github': IconBrandGithub,
  'trello': IconBrandTrello,
  'ai': IconRobot,
  'notion': IconBrandNotion,
  'blender': IconBrandBlender,
  'jira': IconTool,
  'office': IconFileSpreadsheet,

  // Programming Principles
  'oop': IconBuildingArch,
  'design-patterns': IconPuzzle,
  'solid': IconShield,
  'tdd': IconFlask,
  'dry': IconRefresh,
  'kiss': IconCut,
  'yagni': IconTarget,

  // IDEs
  'rider': IconGenderGenderfluid,
  'vs': IconBrandVisualStudio,
  'vscode': IconBrandVscode,
  'android-studio': IconBrandAndroid,

  // Soft Skills
  'teamwork': IconUsers,
  'leadership': IconCrown,
  'communication': IconMessage,
  'critical-thinking': IconBrain,
  'problem-solving': IconTool
};

export const SkillIcon: React.FC<SkillIconProps> = ({ 
  skillId, 
  className = "w-5 h-5",
  size = 20
}) => {
  const IconComponent = skillTablerIcons[skillId];

  if (!IconComponent) {
    // Fallback to a default icon if skill not found
    return <IconTool className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};

export default SkillIcon;
