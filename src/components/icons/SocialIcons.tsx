import React from 'react'
import { Link as LinkIcon } from 'lucide-react'

// ── Iconos SVG reutilizables ─────────────────────────────────────

export const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export const GitlabIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 5.11 2a.43.43 0 0 1 .4.27l2.89 8.89h7.2l2.89-8.89a.43.43 0 0 1 .4-.27.42.42 0 0 1 .4.22l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94Z" />
  </svg>
)

export const FigmaIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zM5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5zM12 9h3.5a3.5 3.5 0 1 1 0 7H12V9zM8.5 16A3.5 3.5 0 1 1 8.5 23a3.5 3.5 0 0 1 0-7z" />
  </svg>
)

export const DribbbleIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
)

export const BehanceIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7v2h7V7zM11.5 14.5c0-3-2.5-5.5-5.5-5.5H0v14h6c3 0 5.5-2.5 5.5-5.5zm-5.5-3v2H4v-2h2c1.1 0 2 .9 2 2s-.9 2-2 2H4v2h2c1.1 0 2-.9 2-2s-.9-2-2-2H4v-2h2zM24 15.5c0-3-2.5-5.5-5.5-5.5s-5.5 2.5-5.5 5.5 2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5zm-8-1.5h5c0-1.1-.9-2-2-2s-2 .9-2 2zm2 4c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
  </svg>
)

export const VercelIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
)

export const NetlifyIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.8 24l-3-6.1L.5 15l6.5-.4-2.8-5L9 9v15h-3.2zM21 0l-3.3 5.4-6.4-1-.5 10.6H23l-2-15zm-9.3 16H1l6.7-7L9 6v10zm1.7-1.1V4h8.3l-8.3 10.9zM23.5 16h-11l5-8.5L23.5 16z" />
  </svg>
)

export const BitbucketIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.78 2.45L2.9 21.46c.07.64.6 1.14 1.25 1.14h15.7c.65 0 1.18-.5 1.25-1.14l2.12-19.01a1.27 1.27 0 0 0-1.25-1.4H2.03a1.27 1.27 0 0 0-1.25 1.4zm13.97 12.1H9.25l-1.35-7.53h8.2l-1.35 7.53z" />
  </svg>
)

export const MediumIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

export const DevToIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41-.01.73-.08.96-.2.4-.21.62-.48.62-1.03 0-.58-.22-.92-.78-1.41zm15.65-4.8v13.5c0 1.05-.85 1.9-1.9 1.9H2.9A1.9 1.9 0 0 1 1 18.75V5.25C1 4.2 1.85 3.35 2.9 3.35h18.27c1.05 0 1.9.85 1.9 1.9z" />
  </svg>
)

// ── Mapa de plataformas con iconos y colores ─────────────────────

const PLATFORM_ICONS: Record<string, { svg: React.ReactNode; color: string; hoverColor: string }> = {
  github: { svg: <GithubIcon size={14} />, color: 'text-slate-600 dark:text-slate-300', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  linkedin: { svg: <LinkedinIcon size={14} />, color: 'text-[#0077b5]', hoverColor: 'hover:text-[#00a0dc]' },
  gitlab: { svg: <GitlabIcon />, color: 'text-[#fc6d26]', hoverColor: 'hover:text-[#fd8c52]' },
  figma: { svg: <FigmaIcon />, color: 'text-[#F24E1E]', hoverColor: 'hover:text-[#f26e47]' },
  dribbble: { svg: <DribbbleIcon />, color: 'text-[#EA4C89]', hoverColor: 'hover:text-[#f082ac]' },
  behance: { svg: <BehanceIcon />, color: 'text-[#1769ff]', hoverColor: 'hover:text-[#4d8eff]' },
  vercel: { svg: <VercelIcon />, color: 'text-slate-900 dark:text-slate-100', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  netlify: { svg: <NetlifyIcon />, color: 'text-[#00C7B7]', hoverColor: 'hover:text-[#00E5D3]' },
  bitbucket: { svg: <BitbucketIcon />, color: 'text-[#0052CC]', hoverColor: 'hover:text-[#2684FF]' },
  medium: { svg: <MediumIcon />, color: 'text-slate-900 dark:text-slate-100', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  devto: { svg: <DevToIcon />, color: 'text-slate-900 dark:text-slate-100', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  kaggle: { svg: <span className="font-black text-[12px] italic leading-none">k</span>, color: 'text-[#20BEFF]', hoverColor: 'hover:text-[#4bd1ff]' },
  huggingface: { svg: <span className="font-bold text-[12px] leading-none tracking-tighter">HF</span>, color: 'text-[#FFD21E]', hoverColor: 'hover:text-[#ffde53]' },
  heroku: { svg: <span className="font-bold text-[10px] leading-none uppercase">Hrk</span>, color: 'text-[#430098]', hoverColor: 'hover:text-[#6a34ba]' },
  website: { svg: <LinkIcon size={14} />, color: 'text-[#003087] dark:text-cyan-400', hoverColor: 'hover:text-[#003087] dark:hover:text-cyan-300' },
}

export default PLATFORM_ICONS