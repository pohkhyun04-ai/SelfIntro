/**
 * Strongly-typed content for the personal website.
 * Edit the values below to make the site your own — no component
 * changes required. The UI reads everything from here.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface Skill {
  name: string;
  level: number; // 0 - 100
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface PortfolioProfile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  available: boolean;
  summary: string;
}

export const profile: PortfolioProfile = {
  name: "Qia Chung",
  role: "Software Engineer",
  tagline: "I build fast, accessible, and delightful web experiences.",
  location: "Cheras, Kuala Lumpur",
  email: "chungpohkhyun1234@gmail.com",
  available: true,
  summary:
    "I am a software engineer with a passion for crafting clean, user-centric products. " +
    "Over the past 6 years I have worked across the stack — from pixel-perfect interfaces to " +
    "scalable backend systems — always with a focus on performance and developer experience.",
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/pohkhyun04-ai", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/qiachung04/",
    icon: "linkedin",
  },
  { label: "Email", href: `mailto:${profile.email}`, icon: "mail" },
];

export const skills: Skill[] = [
  { name: "AI-Assisted Development", level: 90 },
  { name: "Prompt Engineering", level: 75 },
  { name: "HTML", level: 80 },
  { name: "PHP", level: 75 },
  { name: "CSS", level: 72 },
  { name: "JavaScript", level: 60 },
  { name: "Vue.js", level: 52 },
  { name: "Python", level: 65 },
  { name: "C#", level: 68 },
  { name: "C++", level: 65 },
  { name: "MySQL", level: 72 },
  { name: "REST APIs", level: 70 },
];

export const projects: Project[] = [
  {
    title: "FYP - Web Application",
    description:
      "A full-stack web application for browsing, purchasing, and managing purebred pets. Customers can search pets, book appointments, and purchase pets. Administrators manage pets, appointments, inventory, sales reports, and riders through a comprehensive dashboard. The system also integrates AI-powered pet breed recognition using a ResNet50 deep learning model.",
    tags: [
      "Laravel",
      "PHP",
      "MySQL",
      "JavaScript",
      "Python",
      "Chart.js",
    ],
    link: "https://example.com",
    repo: "https://github.com",
  },
  {
    title: "Orbit Task Manager",
    description:
      "A collaborative task manager with offline-first sync and a keyboard-driven interface.",
    tags: ["React", "IndexedDB", "PWA"],
    link: "https://example.com",
    repo: "https://github.com",
  },
  {
    title: "Palette UI",
    description:
      "An open-source component library and design-token system used by 3k+ developers.",
    tags: ["Design System", "CSS", "Accessibility"],
    link: "https://example.com",
    repo: "https://github.com",
  },
  {
    title: "DevFlow CLI",
    description:
      "A developer toolchain that automates release notes, changelogs, and version bumps.",
    tags: ["Node.js", "CLI", "Automation"],
    repo: "https://github.com",
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "Full Stack Engineer Intern",
    company: "Flexinfra AI Sdn Bhd",
    period: "15 June - 29 November 2026",
    description:
      "Lead the frontend platform team, shipping a design system adopted across 8 product teams.",
  }
];
