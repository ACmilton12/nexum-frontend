export interface PublicPortfolio {
  id: number;
  first_name: string;
  last_name: string;
  profession: string;
  location: string;
  avatar_url: string | null;
  skills: string[];
  area: string;
  updated_at: string;
}

export const MOCK_PORTFOLIOS: PublicPortfolio[] = [
  {
    id: 1,
    first_name: "Juan",
    last_name: "Pérez",
    profession: "Full Stack Developer",
    location: "Ing. de Sistemas",
    avatar_url: "https://i.pravatar.cc/150?u=juan",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    area: "Desarrollo de Software",
    updated_at: "2024-05-01",
  },
  {
    id: 2,
    first_name: "Ana Lía",
    last_name: "Ramos",
    profession: "Data Scientist",
    location: "Ing. Informática",
    avatar_url: "https://i.pravatar.cc/150?u=ana",
    skills: ["Python", "Machine Learning", "SQL"],
    area: "Data Science",
    updated_at: "2024-05-02",
  },
  {
    id: 3,
    first_name: "Carlos",
    last_name: "Méndez",
    profession: "Mobile Developer",
    location: "Lic. Sistemas",
    avatar_url: "https://i.pravatar.cc/150?u=carlos",
    skills: ["Flutter", "Firebase", "UI/UX", "Dart"],
    area: "Desarrollo de Software",
    updated_at: "2024-05-03",
  },
  {
    id: 4,
    first_name: "María",
    last_name: "García",
    profession: "UX/UI Designer",
    location: "Ing. de Sistemas",
    avatar_url: "https://i.pravatar.cc/150?u=maria",
    skills: ["Figma", "Adobe XD", "CSS", "HTML"],
    area: "Diseño UX/UI",
    updated_at: "2024-05-04",
  },
  {
    id: 5,
    first_name: "Roberto",
    last_name: "Sánchez",
    profession: "Backend Developer",
    location: "Ing. Informática",
    avatar_url: "https://i.pravatar.cc/150?u=roberto",
    skills: ["Go", "Docker", "Kubernetes", "Redis"],
    area: "Desarrollo de Software",
    updated_at: "2024-05-05",
  },
  {
    id: 6,
    first_name: "Lucía",
    last_name: "Torres",
    profession: "Frontend Developer",
    location: "Lic. Sistemas",
    avatar_url: "https://i.pravatar.cc/150?u=lucia",
    skills: ["Vue", "TailwindCSS", "JavaScript"],
    area: "Desarrollo de Software",
    updated_at: "2024-05-06",
  },
];
