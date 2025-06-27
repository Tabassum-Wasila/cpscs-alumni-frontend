
import { Sprout, Users, Lightbulb, Wrench, Network } from 'lucide-react';

export interface GoalData {
  id: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  orbitRadius: number;
  speed: number;
  size: string;
  position: { angle: number };
  note: string;
}

export const createGoalsData = (isMobile: boolean): GoalData[] => [
  {
    id: 'inspire-growth',
    icon: Sprout,
    title: "Inspire Growth",
    description: "For students, alumni, and the school.",
    color: "from-green-400 to-emerald-600",
    orbitRadius: 120 * (isMobile ? 0.5 : 1),
    speed: 1,
    size: isMobile ? 'w-8 h-8' : 'w-16 h-16',
    position: { angle: 0 },
    note: 'C4'
  },
  {
    id: 'strengthen-bonds',
    icon: Users,
    title: "Strengthen Bonds",
    description: "Across batches, borders, and generations.",
    color: "from-blue-400 to-cyan-600",
    orbitRadius: 160 * (isMobile ? 0.5 : 1),
    speed: 0.8,
    size: isMobile ? 'w-7 h-7' : 'w-14 h-14',
    position: { angle: Math.PI * 0.4 },
    note: 'D4'
  },
  {
    id: 'fuel-impact',
    icon: Lightbulb,
    title: "Fuel Impact",
    description: "Through knowledge, action, and giving.",
    color: "from-yellow-400 to-orange-600",
    orbitRadius: 200 * (isMobile ? 0.5 : 1),
    speed: 0.6,
    size: isMobile ? 'w-9 h-9' : 'w-18 h-18',
    position: { angle: Math.PI * 0.8 },
    note: 'E4'
  },
  {
    id: 'build-together',
    icon: Wrench,
    title: "Build Together",
    description: "Infrastructure, opportunity, and legacy.",
    color: "from-orange-400 to-red-600",
    orbitRadius: 240 * (isMobile ? 0.5 : 1),
    speed: 0.4,
    size: isMobile ? 'w-8 h-8' : 'w-16 h-16',
    position: { angle: Math.PI * 1.2 },
    note: 'G4'
  },
  {
    id: 'evolve-forward',
    icon: Network,
    title: "Evolve Forward",
    description: "Digitally, socially, and sustainably.",
    color: "from-purple-400 to-indigo-600",
    orbitRadius: 280 * (isMobile ? 0.5 : 1),
    speed: 0.3,
    size: isMobile ? 'w-7 h-7' : 'w-14 h-14',
    position: { angle: Math.PI * 1.6 },
    note: 'A4'
  }
];
