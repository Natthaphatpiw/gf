import {
  Sunrise,
  Sun,
  BedDouble,
  MoonStar,
  Leaf,
  Coffee,
  Sprout,
  GlassWater,
  Waves,
  Wind,
  CloudRain,
  CloudLightning,
  TreePalm,
  Footprints,
  Phone,
  ListChecks,
  Anchor,
  Activity,
  EyeOff,
  Moon,
  Smile,
  Laugh,
  CalendarDays,
  CloudFog,
  Sparkles,
  Mountain,
  Cat,
  Telescope,
  Droplets,
  User,
  HeartHandshake,
  Users,
  Home,
  Map,
  Flower2,
  MessageCircle,
  CircleDot,
  Flame,
  BookOpen,
  MessagesSquare,
  Zap,
  ShieldCheck,
  Circle,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
 * Explicit name -> lucide icon map.
 * Covers every icon name used in data/questions.ts options,
 * plus the icon names used by data/goals.ts (for the result page).
 * Named imports only — no dynamic icon resolution.
 * ============================================================ */

export const ICONS: Record<string, LucideIcon> = {
  // Scene 01 — first light
  Sunrise,
  Sun,
  BedDouble,
  MoonStar,
  // Scene 02 — first glass
  Leaf,
  Coffee,
  Sprout,
  GlassWater,
  // Scene 03 — sea inside
  Waves,
  Wind,
  CloudRain,
  CloudLightning,
  // Scene 04 — found hour
  TreePalm,
  Footprints,
  Phone,
  ListChecks,
  // Scene 05 — body language
  Anchor,
  Activity,
  EyeOff,
  Moon,
  Smile,
  // Scene 07 — last laugh
  Laugh,
  CalendarDays,
  CloudFog,
  Sparkles,
  // Scene 09 — last night
  Mountain,
  Cat,
  Telescope,
  Droplets,
  // Scene 10 — company
  User,
  HeartHandshake,
  Users,
  Home,
  // Scene 11 — crossroads
  Map,
  Flower2,
  MessageCircle,
  CircleDot,
  // Scene 12 — recharge
  Flame,
  BookOpen,
  MessagesSquare,
  // Goals (result page)
  Zap,
  ShieldCheck,
};

/** Resolve an icon name to a component, falling back to a neutral dot. */
export function iconFor(name: string): LucideIcon {
  return ICONS[name] ?? Circle;
}
