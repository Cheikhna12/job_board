import Link from 'next/link'

const LogoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="group-hover:rotate-12 transition-transform duration-300 ease-in-out"
  >
    <rect width="32" height="32" rx="8" fill="#1E293B" />
    <path
      d="M12 10V22H15.5V17.5H19C20.933 17.5 22.5 15.933 22.5 14C22.5 12.067 20.933 10.5 19 10.5H12V10Z"
      fill="white"
    />
  </svg>
)

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <LogoIcon />
      <span className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
        PortailTalent
      </span>
    </Link>
  )
}
