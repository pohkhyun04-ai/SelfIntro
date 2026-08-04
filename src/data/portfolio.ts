/**
 * Strongly-typed content for the personal website.
 * Edit the values below to make the site your own — no component
 * changes required. The UI reads everything from here.
 */

export interface NavLink {
  label: string;
  href: string;
  /** i18n key under "nav." prefix, e.g. "about", "skills" */
  i18nKey: string;
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
  school: string;
  languages: string[];
  hobbies: string[];
  available: boolean;
  summary: string;
}

export const profile: PortfolioProfile = {
  name: "Qia Chung",
  role: "Software Engineer Freshgraduate",
  tagline: "Powered by curiosity and Ctrl + Z.",
  location: "Cheras, Kuala Lumpur",
  email: "chungpohkhyun1234@gmail.com",
  school: "Tunku Abdul Rahman University of Management and Technology (KL Branch)",
  languages: ["Mandarin", "English", "Malay"],
  hobbies: ["Cooking", "Traveling", "UI/UX Design"],
  available: true,
summary:
  "I'm a Software Engineering graduate from Sabah with one dream — to build my career, live, and one day own a home in Kuala Lumpur. " +
  "I love creating websites, improving existing features, and turning new ideas into real products. " + 
  "Curious by nature, I'm always learning new technologies and excited to contribute to real-world projects that make a meaningful impact. " 
  ,
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about", i18nKey: "about" },
  { label: "Skills", href: "#skills", i18nKey: "skills" },
  { label: "Projects", href: "#projects", i18nKey: "projects" },
  { label: "Experience", href: "#experience", i18nKey: "experience" },
  { label: "Contact", href: "#contact", i18nKey: "contact" },
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
  { name: "Java", level: 68 },
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
    title: "Self Intro Website",
    description:
      "A personal introduction website to showcase my skills and projects.",
    tags: ["HTML", "Vue.js", "JavaScript", "TypeScript"],
    link: "https://example.com",
    repo: "https://github.com/pohkhyun04-ai/SelfIntro.git",
  }
];

export const experience: ExperienceItem[] = [
  {
    role: "Full Stack Engineer Intern",
    company: "Flexinfra AI Sdn Bhd",
    period: "15 June - 29 November 2026 (6 months)",
    description:
      "Worked on the Flextoken AI platform by developing frontend and backend features, improving user interfaces, integrating APIs, designing system architecture diagrams, writing technical documentation, and assisting with Docker-based deployment and testing.",
  }
];
