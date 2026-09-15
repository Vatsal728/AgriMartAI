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
import type { TranslationKey } from "@/lib/i18n/LanguageContext";

export type NavItem = {
  label: TranslationKey;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  title: TranslationKey;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "nav.section.primary",
    items: [
      { label: "nav.item.home", href: "/dashboard", icon: Home },
      { label: "nav.item.scanLeaf", href: "/scan-leaf", icon: ScanLine },
      { label: "nav.item.chatAssistant", href: "/chat-assistant", icon: MessageCircle },
      { label: "nav.item.history", href: "/history", icon: History },
    ],
  },
  {
    title: "nav.section.advisoryTools",
    items: [
      { label: "nav.item.cropRecommendation", href: "/crop-recommendation", icon: Sprout },
      { label: "nav.item.irrigation", href: "/irrigation", icon: Droplet },
      { label: "nav.item.weather", href: "/weather", icon: CloudSun },
      { label: "nav.item.sustainabilityScore", href: "/sustainability-score", icon: BarChart3 },
      { label: "nav.item.agenticAdvisor", href: "/agentic-advisor", icon: Bot },
    ],
  },
  {
    title: "nav.section.account",
    items: [
      { label: "nav.item.profile", href: "/profile", icon: User },
      { label: "nav.item.settings", href: "/settings", icon: Settings },
      { label: "nav.item.helpCenter", href: "/help-center", icon: HelpCircle },
    ],
  },
];
