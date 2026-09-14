import {
  Home,
  ScanLine,
  MessageCircle,
  History,
  Sprout,
  Droplet,
  CloudSun,
  BarChart3,
  Bot,
  User,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "Primary",
    items: [
      { label: "Home", href: "/dashboard", icon: Home },
      { label: "Scan Leaf", href: "/scan-leaf", icon: ScanLine },
      { label: "Chat Assistant", href: "/chat-assistant", icon: MessageCircle },
      { label: "History", href: "/history", icon: History },
    ],
  },
  {
    title: "Advisory Tools",
    items: [
      { label: "Crop Recommendation", href: "/crop-recommendation", icon: Sprout },
      { label: "Irrigation", href: "/irrigation", icon: Droplet },
      { label: "Weather", href: "/weather", icon: CloudSun },
      { label: "Sustainability Score", href: "/sustainability-score", icon: BarChart3 },
      { label: "Agentic Advisor", href: "/agentic-advisor", icon: Bot },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help Center", href: "/help-center", icon: HelpCircle },
    ],
  },
];
