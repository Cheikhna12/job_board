'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

const developers = [
  {
    name: 'Développeur Un',
    role: 'Lead Developer & Architect',
    bio: 'Architecte de solutions, je conçois des systèmes robustes et évolutifs. Ma passion est de transformer des idées complexes en réalités techniques performantes, en construisant les fondations solides sur lesquelles reposent nos projets.',
    quote: 'La meilleure architecture est celle qui semble invisible.',
    imageUrl: '/dev1.jpeg',
  },
  {
    name: 'Développeur Deux',
    role: 'Frontend Specialist & UI/UX Enthusiast',
    bio: 'Focalisé sur l\'expérience utilisateur, je donne vie aux interfaces. Je m\'efforce de créer des parcours intuitifs et esthétiques, où chaque détail et chaque animation contribuent à une interaction mémorable et fluide.',
    quote: 'Un bon design est un design qui sert l\'humain.',
    imageUrl: '/dev2.JPG',
  },
  {
    name: 'Développeur Trois',
    role: 'Backend Engineer & DevOps Pro',
    bio: 'Gardien de la performance et de la fiabilité, je travaille en coulisses pour que tout fonctionne sans accroc. De la base de données à l\'infrastructure, ma mission est d\'assurer une exécution rapide et sécurisée.',
    quote: 'La complexité en backend doit aboutir à la simplicité en frontend.',
    imageUrl: '/dev3.JPG',
  },
]

const useIsVisible = (ref: React.RefObject<HTMLElement | null>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isVisible;
};

const DeveloperSection = ({ dev, index }: { dev: typeof developers[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);
  const isEven = index % 2 === 0;

  return (
    <div 
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className={`relative aspect-[4/5] w-full max-w-md mx-auto ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <Image
          src={dev.imageUrl}
          alt={`Photo de ${dev.name}`}
          fill
          quality={100}
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 448px"
          className="object-cover rounded-2xl shadow-2xl"
        />
      </div>
      <div className={`text-center lg:text-left ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <p className="text-lg font-semibold text-sky-600">{dev.role}</p>
        <h3 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">{dev.name}</h3>
        <p className="mt-6 text-lg text-slate-600 leading-relaxed">{dev.bio}</p>
        <blockquote className="mt-8 pl-4 border-l-4 border-slate-300 italic text-slate-700 font-medium">
          {dev.quote}
        </blockquote>
      </div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* En-tête */}
        <header className="py-24 sm:py-32 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Les artisans de votre expérience.
          </h1>
          <p className="mt-8 max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed">
            Nous sommes une équipe de trois développeurs passionnés, dédiés à la création de solutions numériques performantes, intuitives et élégantes. Notre force réside dans notre collaboration et notre engagement commun pour l'excellence technique.
          </p>
        </header>

        {/* Sections des développeurs */}
        <div className="space-y-24 sm:space-y-32 py-16">
          {developers.map((dev, index) => (
            <DeveloperSection key={dev.name} dev={dev} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
