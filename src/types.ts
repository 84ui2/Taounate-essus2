export interface ArticleSection {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  theme: 'intro' | 'roads' | 'water' | 'questions' | 'demands' | 'human';
  icon: string;
  audioPrompt?: string;
}

export interface DouarStory {
  id: string;
  douarName: string;
  commune: string;
  circle: string; // دائرة (غفساي، تاونات، قرية با محمد، تيسة)
  roadStatus: string;
  roadDifficulty: 'حرج' | 'صعب' | 'شبه مقطوع شتاءً';
  waterStatus: string;
  waterDifficulty: 'نقص حاد وعطش' | 'جلب من عيون بعيدة' | 'انقطاع مستمر';
  schoolDistanceKm: number;
  waterDistanceKm: number;
  quote: string;
  citizenName: string;
  role: string;
}

export interface SolidaritySigner {
  id: string;
  name: string;
  origin: string;
  message: string;
  timestamp: string;
  verified?: boolean;
}

export interface MapDouar {
  id: string;
  name: string;
  commune: string;
  circle: 'دائرة غفساي' | 'دائرة تاونات' | 'دائرة قرية با محمد' | 'دائرة تيسة';
  crisisLevel: 'critical' | 'high' | 'moderate';
  primaryCrisis: 'both' | 'roads' | 'water';
  roadStatus: string;
  roadDifficulty: 'شبه مقطوع شتاءً' | 'صعب ووعر' | 'حرج';
  waterStatus: string;
  waterDifficulty: 'نقص حاد وعطش' | 'جلب من عيون بعيدة' | 'انقطاع مستمر';
  schoolDistanceKm: number;
  waterDistanceKm: number;
  familiesCount: number;
  keyNeeds: string[];
  summary: string;
  coordinates: { x: number; y: number }; // Percentage (0 - 100) for province map layout
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'female' | 'male';
}
