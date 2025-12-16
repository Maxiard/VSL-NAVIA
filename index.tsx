import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Icons (Inline SVGs for reliability) ---
// Updated to accept props for flexible sizing
const Icons = {
  ChevronRight: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>,
  ChevronLeft: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>,
  X: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Check: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>,
  Clock: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Zap: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  TrendingUp: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Calendar: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Brain: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Message: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  CreditCard: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
  Bell: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Flame: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Loop: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 20h80m-5-5 5 5-5 5M15 25l-5-5 5-5"/></svg>,
  NaviaLogo: (props: any) => (
    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M50 0L61 39L100 50L61 61L50 100L39 61L0 50L39 39L50 0Z" fill="#A78BFA" className="drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]" />
    </svg>
  ),
  ArrowRight: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
};

// --- Slide Data Definitions ---
const slides = [
  {
    id: 1,
    type: 'opening',
    headline: 'NO TE FALTAN CLIENTES.',
    subheadline: 'Te falta velocidad.',
  },
  {
    id: 2,
    type: 'split-graph',
    headline: 'LA REGLA DE LOS 5 MINUTOS',
    content: { percentage: 80, label: 'De los pacientes eligen al que responde primero.' }
  },
  {
    id: 3,
    type: 'list',
    headline: 'EL COSTO DE LA DEMORA',
    items: [
      '5-10 Turnos perdidos / día',
      'Chats sin responder',
      'Olvido de recordatorios',
      'Respuestas apuradas'
    ]
  },
  {
    id: 4,
    type: 'equation',
    headline: 'TU PÉRDIDA MENSUAL INVISIBLE',
    equation: { part1: '[ERRORES]', part2: '[DEMORAS]', result: '$$$' }
  },
  {
    id: 5,
    type: 'chaos',
    headline: 'EL CAOS OPERATIVO',
  },
  {
    id: 6,
    type: 'cycle',
    headline: 'TU ROL ACTUAL:',
    subheadline: 'SECRETARIA 24/7'
  },
  {
    id: 7,
    type: 'paradigm',
    headline: 'EL MITO DE LA ATENCIÓN',
    left: 'Atención Personalizada',
    right: 'Respuesta Inmediata'
  },
  {
    id: 8,
    type: 'hub',
    headline: 'ECOSISTEMA DE I.A.',
    items: ['Agendamiento', 'Ventas', 'Soporte', 'Cobros']
  },
  {
    id: 9,
    type: 'grid',
    headline: 'CAPACIDADES DEL AGENTE',
    cards: [
      { icon: 'Zap', title: 'Respuesta Instantánea' },
      { icon: 'Brain', title: 'Calificación de Leads' },
      { icon: 'Calendar', title: 'Agendamiento Auto' },
      { icon: 'CreditCard', title: 'Cobro de Señas' },
      { icon: 'Message', title: 'Atención 24/7' },
      { icon: 'Bell', title: 'Recordatorios' },
    ]
  },
  {
    id: 10,
    type: 'timeline',
    headline: 'FLUJO DE CONVERSIÓN AUTOMÁTICA',
  },
  {
    id: 11,
    type: 'crm',
    headline: 'VISIBILIDAD TOTAL DEL NEGOCIO',
    subheadline: 'CRM Integrado & Clasificación Automática'
  },
  {
    id: 12,
    type: 'table',
    headline: 'RENDIMIENTO',
    headers: ['Humano', 'Sistema NAVIA'],
    rows: [
      ['8hs Turno', '24hs Activo'],
      ['Errores Posibles', '0 Errores'],
      ['Demoras', 'Inmediato'],
      ['Se enferma', 'Siempre Online']
    ]
  },
  {
    id: 13,
    type: 'before-after',
    headline: 'TU NUEVA REALIDAD',
    before: ['34 chats pendientes', 'Estrés operativo', 'Turnos perdidos'],
    after: ['Inbox Cero', 'Agenda Llena', 'Control Total']
  },
  {
    id: 14,
    type: 'stats',
    headline: 'RESULTADOS PROMEDIO',
    stats: [
      { value: '+32%', label: 'Reservas' },
      { value: '0', label: 'Msj Perdidos' },
      { value: '-80%', label: 'Ausencias' }
    ]
  },
  {
    id: 15,
    type: 'check-list',
    headline: 'ESTE SISTEMA ES PARA VOS SI:',
    items: [
      'Tenés alto volumen de mensajes',
      'Tu negocio ya está consolidado',
      'Querés automatizar sin contratar',
      'Buscás escalar la facturación'
    ]
  },
  {
    id: 16,
    type: 'disqualify',
    headline: 'ESTO NO ES PARA VOS SI:',
    items: [
      'Buscas soluciones mágicas',
      'Querés un chatbot genérico y barato',
      'No estás dispuesto a invertir en tecnología',
      'Preferís seguir respondiendo manualmente'
    ]
  },
  {
    id: 17,
    type: 'offer',
    headline: 'LO QUE VAS A LOGRAR',
    items: [
      { icon: 'Zap', title: 'Automatización' },
      { icon: 'Clock', title: 'Libertad' },
      { icon: 'TrendingUp', title: 'Escalabilidad' }
    ]
  },
  {
    id: 18,
    type: 'cta',
    headline: 'AGENDA TU AUDITORÍA DE IA',
    subheadline: 'Sesión de Estrategia de 30 Minutos (Gratis)'
  }
];

// --- Sub-Components ---

const LayoutWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full h-full p-16 flex flex-col relative navia-gradient overflow-hidden animate-fade-in ${className}`}>
    {/* Subtle grid background */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
    {/* Navia logo watermark */}
    <div className="absolute top-8 left-8 opacity-50 flex items-center gap-2 z-20">
      <div className="w-4 h-4 bg-violet-400 rotate-45"></div>
      <span className="text-white/40 font-bold tracking-[0.2em] text-sm">NAVIA</span>
    </div>
    {children}
  </div>
);

const SlideOpening = ({ slide }) => (
  <LayoutWrapper className="justify-center items-center text-center">
    <h1 className="text-8xl font-black text-white mb-6 uppercase tracking-tight leading-[0.9] drop-shadow-2xl">
      {slide.headline}
    </h1>
    <h2 className="text-7xl font-bold text-[#A78BFA] lilac-glow uppercase tracking-tight animate-pulse-soft">
      {slide.subheadline}
    </h2>
  </LayoutWrapper>
);

const SlideSplitGraph = ({ slide }) => (
  <LayoutWrapper>
    <div className="flex items-center h-full gap-20">
      <div className="flex-1 flex justify-center">
        <div className="relative w-96 h-96 animate-float">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(167,139,250,0.3)]">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#A78BFA" strokeWidth="2" strokeDasharray={`${slide.content.percentage}, 100`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-white">{slide.content.percentage}%</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h2 className="text-5xl font-bold mb-8 uppercase text-white/90">{slide.headline}</h2>
        <p className="text-4xl font-light text-[#A78BFA] leading-tight">{slide.content.label}</p>
      </div>
    </div>
  </LayoutWrapper>
);

const SlideList = ({ slide }) => (
  <LayoutWrapper>
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto w-full">
      <h2 className="text-6xl font-bold mb-16 text-white uppercase tracking-wide border-b border-white/10 pb-6">{slide.headline}</h2>
      <ul className="space-y-8">
        {slide.items.map((item, idx) => (
          <li key={idx} className="flex items-center text-4xl font-medium text-white/80" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="mr-6 p-2 bg-red-500/10 rounded-full border border-red-500/20">
              <Icons.X />
            </div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </LayoutWrapper>
);

const SlideEquation = ({ slide }) => (
  <LayoutWrapper className="justify-center items-center">
    <h2 className="text-4xl font-medium text-gray-400 mb-20 uppercase tracking-[0.2em]">{slide.headline}</h2>
    <div className="flex items-center gap-6 text-5xl md:text-6xl font-bold text-white">
      <div className="px-10 py-6 glass-panel rounded-2xl border-red-500/30 text-red-200 animate-float-delayed">
        {slide.equation.part1}
      </div>
      <span className="text-gray-500">+</span>
      <div className="px-10 py-6 glass-panel rounded-2xl border-red-500/30 text-red-200 animate-float">
        {slide.equation.part2}
      </div>
      <span className="text-gray-500">=</span>
      <div className="px-10 py-6 bg-[#A78BFA] text-[#120E16] rounded-2xl lilac-glow transform scale-110">
        {slide.equation.result}
      </div>
    </div>
  </LayoutWrapper>
);

const SlideChaos = ({ slide }) => (
  // Change: Use justify-start and padding-top to position title at top, ensuring it doesn't get covered
  <LayoutWrapper className="justify-start pt-20 items-center relative">
    <h2 className="text-7xl font-bold text-white mb-12 z-50 relative drop-shadow-lg text-center uppercase">{slide.headline}</h2>
    
    {/* Abstract UI Chaos Elements - Improved Bubble Styling */}
    <div className="absolute top-[30%] w-[600px] h-[400px]">
      <div className="absolute top-10 left-0 w-full h-16 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/5 opacity-60 transform -rotate-3 scale-95 animate-float-delayed"></div>
      <div className="absolute top-24 right-4 w-[90%] h-16 bg-gray-700/60 backdrop-blur-sm rounded-2xl border border-white/5 opacity-60 transform rotate-2 animate-float"></div>
      <div className="absolute top-40 left-8 w-[95%] h-16 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/5 opacity-80 transform -rotate-1 animate-float-delayed"></div>
      
      {/* The "Buried" Message - Enhanced Visibility */}
      <div className="absolute top-32 left-10 right-10 h-24 bg-[#A78BFA] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center px-8 justify-between transform z-40 border border-white/50 animate-pulse-soft scale-110">
        <span className="font-bold text-[#120E16] text-2xl">TURNO $50.000 (SOLICITUD)</span>
        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">HACE 2 DÍAS</span>
      </div>

      <div className="absolute top-60 left-4 w-full h-16 bg-gray-700/60 backdrop-blur-sm rounded-2xl border border-white/5 opacity-90 transform rotate-1 z-30 animate-float"></div>
      <div className="absolute top-80 left-2 w-[90%] h-16 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/5 opacity-50 transform -rotate-2 animate-float-delayed"></div>
    </div>
  </LayoutWrapper>
);

const SlideCycle = ({ slide }) => (
  <LayoutWrapper className="justify-center items-center">
    <h2 className="text-3xl text-gray-400 uppercase tracking-widest mb-4">{slide.headline}</h2>
    <h1 className="text-8xl font-black text-white mb-24 relative">
      SECRETARIA <span className="text-red-500 animate-pulse">24/7</span>
    </h1>
    
    <div className="relative w-full max-w-4xl h-[400px] flex justify-between items-center px-20">
      
      {/* Left Node: Responder */}
      <div className="flex flex-col items-center z-10 animate-float">
        <div className="w-40 h-40 rounded-full glass-panel border border-[#A78BFA]/50 flex items-center justify-center shadow-[0_0_40px_rgba(167,139,250,0.3)] mb-6">
           <div className="text-white scale-150"><Icons.Message /></div>
        </div>
        <p className="text-2xl font-bold text-gray-200 tracking-wider">RESPONDER</p>
      </div>

      {/* Infinite Loop Arrows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] w-[600px] h-[100px] overflow-visible">
          {/* Top Arrow (Left to Right) */}
           <svg className="w-full h-full" viewBox="0 0 600 100">
             <path id="curveTop" d="M 50 80 Q 300 -50 550 80" fill="none" stroke="url(#grad1)" strokeWidth="4" strokeDasharray="20,10" className="animate-pulse" />
             <defs>
               <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
                 <stop offset="50%" stopColor="#A78BFA" stopOpacity="1" />
                 <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
               </linearGradient>
             </defs>
             <circle r="6" fill="#fff">
               <animateMotion dur="2s" repeatCount="indefinite" path="M 50 80 Q 300 -50 550 80" />
             </circle>
           </svg>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[0%] w-[600px] h-[100px] overflow-visible rotate-180">
          {/* Bottom Arrow (Right to Left) */}
           <svg className="w-full h-full" viewBox="0 0 600 100">
             <path d="M 50 80 Q 300 -50 550 80" fill="none" stroke="url(#grad2)" strokeWidth="4" strokeDasharray="20,10" className="animate-pulse" />
             <defs>
               <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                 <stop offset="50%" stopColor="#EF4444" stopOpacity="1" />
                 <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.2" />
               </linearGradient>
             </defs>
             <circle r="6" fill="#fff">
               <animateMotion dur="2s" repeatCount="indefinite" path="M 50 80 Q 300 -50 550 80" />
             </circle>
           </svg>
      </div>

      {/* Right Node: Apagar Fuego */}
      <div className="flex flex-col items-center z-10 animate-float-delayed">
        <div className="w-40 h-40 rounded-full glass-panel border border-red-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] mb-6 animate-pulse-soft">
           <div className="text-red-500 scale-150"><Icons.Flame /></div>
        </div>
        <p className="text-2xl font-bold text-red-400 tracking-wider">APAGAR FUEGO</p>
      </div>
    </div>
  </LayoutWrapper>
);

const SlideParadigm = ({ slide }) => (
  <LayoutWrapper>
    <div className="flex h-full relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-[#120E16] px-4 py-2 border border-white/10 rounded-full text-sm text-gray-500 uppercase tracking-widest">
        VS
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center opacity-30 grayscale border-r border-white/5">
        <h2 className="text-5xl font-bold text-center line-through decoration-red-500 decoration-4">{slide.left}</h2>
        <p className="mt-4 text-xl">Modelo Antiguo</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#A78BFA]/5 animate-pulse-soft"></div>
        <h2 className="text-6xl font-black text-center text-[#A78BFA] lilac-glow leading-tight scale-105">{slide.right}</h2>
        <p className="mt-6 text-xl text-white font-medium bg-[#A78BFA]/20 px-4 py-1 rounded-full border border-[#A78BFA]/30">La Nueva Realidad</p>
      </div>
    </div>
    <div className="absolute bottom-10 w-full text-center left-0">
      <p className="text-gray-400 uppercase tracking-widest text-sm">{slide.headline}</p>
    </div>
  </LayoutWrapper>
);

const SlideHub = ({ slide }) => (
  <LayoutWrapper className="justify-center items-center">
    {/* Change: Moved Headline to top-left to avoid overlap with orbit items */}
    <h2 className="text-5xl font-black text-white uppercase tracking-tight leading-none absolute top-12 left-16 z-30 max-w-sm text-left">
      {slide.headline}
    </h2>
    
    <div className="relative w-[600px] h-[600px] flex items-center justify-center translate-y-8">
      {/* Center Hub */}
      <div className="w-40 h-40 bg-[#1e1629] rounded-full border border-[#A78BFA]/50 flex items-center justify-center z-20 shadow-[0_0_50px_rgba(167,139,250,0.2)] animate-pulse-soft">
        <Icons.NaviaLogo />
      </div>
      
      {/* Orbits */}
      <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full animate-spin [animation-duration:20s]"></div>
      <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full animate-spin [animation-duration:30s] [animation-direction:reverse]"></div>

      {/* Spokes - Corrected positioning logic and animation conflict */}
      {slide.items.map((item, i) => {
        const angle = (i * 90) * (Math.PI / 180);
        const radius = 220; // Distance from center
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          // Fixed: Separate the positioning div from the animation div so transform doesn't conflict
          <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
             <div className="flex flex-col items-center justify-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                <div className="w-3 h-3 bg-[#A78BFA] rounded-full mb-4 shadow-[0_0_10px_#A78BFA]"></div>
                <span className="text-xl font-semibold text-white uppercase tracking-wider whitespace-nowrap">{item}</span>
             </div>
          </div>
        );
      })}
    </div>
  </LayoutWrapper>
);

const SlideGrid = ({ slide }) => (
  <LayoutWrapper>
    <h2 className="text-5xl font-bold text-white mb-12 uppercase">{slide.headline}</h2>
    <div className="grid grid-cols-3 gap-8 h-full pb-10">
      {slide.cards.map((card, i) => {
        const IconComponent = Icons[card.icon] || Icons.Zap;
        return (
          <div key={i} className="glass-card rounded-2xl p-8 flex flex-col items-start justify-between hover:bg-white/5 transition-colors border-t border-white/10 group">
            <div className="text-[#A78BFA] group-hover:scale-110 transition-transform">
              <IconComponent />
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{card.title}</h3>
          </div>
        )
      })}
    </div>
  </LayoutWrapper>
);

const SlideTimeline = ({ slide }) => (
  <LayoutWrapper className="justify-center">
    <h2 className="text-5xl font-bold text-white mb-24 text-center uppercase">{slide.headline}</h2>
    
    <div className="flex items-center justify-between px-10 relative">
      {/* Connecting Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-[#A78BFA] to-gray-800 transform -translate-y-1/2 z-0"></div>

      {[
        { title: 'Entrada', sub: 'WhatsApp/IG', icon: 'Message' },
        { title: 'Agente IA', sub: 'Procesa & Responde', icon: 'Brain', active: true },
        { title: 'Reserva', sub: 'Agenda Turno', icon: 'Calendar' },
        { title: 'Conversión', sub: 'Pago & Confirma', icon: 'Check' }
      ].map((step, i) => (
        <div key={i} className="relative z-10 flex flex-col items-center bg-[#120E16] p-4">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 border-2 transition-all duration-500 ${step.active ? 'bg-[#A78BFA]/10 border-[#A78BFA] shadow-[0_0_30px_rgba(167,139,250,0.3)] scale-110' : 'bg-[#1e1629] border-gray-700'}`}>
            <div className={step.active ? 'text-[#A78BFA]' : 'text-gray-400'}>
               {step.icon === 'Brain' ? <Icons.Brain /> : step.icon === 'Calendar' ? <Icons.Calendar /> : step.icon === 'Check' ? <Icons.Check /> : <Icons.Message />}
            </div>
          </div>
          <h3 className={`text-xl font-bold uppercase ${step.active ? 'text-white' : 'text-gray-500'}`}>{step.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{step.sub}</p>
        </div>
      ))}
    </div>
  </LayoutWrapper>
);

const CRMCard = ({ name, time, tag, color }) => (
    <div className="bg-[#1e1629] p-4 rounded-xl border border-white/5 hover:border-[#A78BFA]/50 transition-colors shadow-lg group">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10"></div>
                <span className="font-bold text-gray-200">{name}</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">{time}</span>
        </div>
        <div className={`text-xs inline-block px-2 py-1 rounded border ${
            color === 'purple' ? 'bg-[#A78BFA]/20 border-[#A78BFA]/30 text-[#A78BFA]' :
            color === 'green' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
            color === 'blue' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
            color === 'pink' ? 'bg-pink-500/20 border-pink-500/30 text-pink-400' :
            'bg-gray-700/30 border-gray-600 text-gray-400'
        }`}>
            {tag}
        </div>
    </div>
);

const SlideCRM = ({ slide }) => (
  <LayoutWrapper>
    <div className="flex flex-col h-full w-full">
        <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-white uppercase tracking-wide">{slide.headline}</h2>
            <p className="text-xl text-[#A78BFA] mt-2 uppercase tracking-widest">{slide.subheadline}</p>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 h-full pb-8">
            {/* Column 1: Entrada */}
            <div className="flex-1 glass-panel rounded-2xl p-4 flex flex-col bg-white/5 border-t-4 border-gray-600">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
                    <h3 className="font-bold text-gray-400 uppercase tracking-wider text-sm">Entrada</h3>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded text-white">12</span>
                </div>
                <div className="space-y-4">
                     <CRMCard name="Martín G." time="10 min" tag="Consulta" color="gray" />
                     <CRMCard name="Lucía F." time="32 min" tag="Instagram" color="pink" />
                </div>
            </div>

            {/* Column 2: Calificados (AI Action) */}
            <div className="flex-1 glass-panel rounded-2xl p-4 flex flex-col bg-[#A78BFA]/5 border-t-4 border-[#A78BFA]">
                 <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
                    <h3 className="font-bold text-[#A78BFA] uppercase tracking-wider text-sm flex items-center gap-2">
                        <Icons.Brain width="20" height="20" /> Calificados
                    </h3>
                    <span className="bg-[#A78BFA]/20 text-xs px-2 py-1 rounded text-[#A78BFA]">5</span>
                </div>
                <div className="space-y-4">
                     <CRMCard name="Sofía R." time="2h" tag="Interés: Implantes" color="purple" />
                     {/* Animated Card moving in */}
                     <div className="animate-fade-in">
                        <CRMCard name="Jorge B." time="Ahora" tag="Alta Intención" color="green" />
                     </div>
                </div>
            </div>

            {/* Column 3: Agendados */}
            <div className="flex-1 glass-panel rounded-2xl p-4 flex flex-col bg-white/5 border-t-4 border-blue-400">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
                    <h3 className="font-bold text-blue-400 uppercase tracking-wider text-sm">Agendados</h3>
                    <span className="bg-blue-900/40 text-xs px-2 py-1 rounded text-blue-300">3</span>
                </div>
                 <div className="space-y-4">
                     <CRMCard name="Ana T." time="Jueves 15:00" tag="Confirmado" color="blue" />
                </div>
            </div>

             {/* Column 4: Cerrados */}
            <div className="flex-1 glass-panel rounded-2xl p-4 flex flex-col bg-white/5 border-t-4 border-green-500">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
                    <h3 className="font-bold text-green-500 uppercase tracking-wider text-sm">Ventas</h3>
                    <span className="bg-green-900/40 text-xs px-2 py-1 rounded text-green-300">8</span>
                </div>
                 <div className="space-y-4">
                     <CRMCard name="Pedro S." time="Ayer" tag="Pagó Seña" color="green" />
                     <CRMCard name="Marta L." time="Ayer" tag="Tratamiento Completo" color="green" />
                </div>
            </div>
        </div>
    </div>
  </LayoutWrapper>
);

const SlideTable = ({ slide }) => (
  <LayoutWrapper className="justify-center">
    <h2 className="text-4xl font-bold text-white mb-12 uppercase tracking-wider text-center">{slide.headline}</h2>
    
    <div className="max-w-5xl mx-auto w-full glass-panel rounded-3xl overflow-hidden">
      <div className="grid grid-cols-2 bg-white/5 border-b border-white/10">
        <div className="py-6 text-center text-xl font-bold text-gray-400 uppercase tracking-widest">{slide.headers[0]}</div>
        <div className="py-6 text-center text-xl font-bold text-[#A78BFA] uppercase tracking-widest bg-[#A78BFA]/10">{slide.headers[1]}</div>
      </div>
      
      {slide.rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 border-b border-white/5 last:border-0 hover:bg-white/2">
          {/* Column 1: Human - Added red X */}
          <div className="py-8 text-center text-2xl text-gray-500 font-medium relative">
             <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-600/50 p-1"><Icons.X /></span>
             {row[0]}
          </div>
          {/* Column 2: Navia - Added check to ALL rows */}
          <div className="py-8 text-center text-2xl text-white font-bold bg-[#A78BFA]/5 relative">
            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[#A78BFA]"><Icons.Check /></span>
            {row[1]}
          </div>
        </div>
      ))}
    </div>
  </LayoutWrapper>
);

const SlideBeforeAfter = ({ slide }) => (
  // Change: Remove layout logic from LayoutWrapper props, implement split explicitly
  <LayoutWrapper className="p-0">
    <div className="flex w-full h-full">
      {/* Left Side (Pain) */}
      <div className="flex-1 bg-[#0a080c] flex flex-col justify-center items-center p-16 border-r border-white/10">
        <h3 className="text-red-500 font-bold tracking-widest mb-12 uppercase text-xl">Situación Actual</h3>
        <ul className="space-y-10">
          {slide.before.map((item, i) => (
            <li key={i} className="flex items-center text-3xl text-gray-500 font-medium">
              <span className="mr-4 opacity-50"><Icons.X /></span> {item}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Right Side (Pleasure) */}
      <div className="flex-1 bg-gradient-to-br from-[#1e1629] to-[#120E16] flex flex-col justify-center items-center p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[#A78BFA]/5 mix-blend-overlay"></div>
        <h3 className="text-[#A78BFA] font-bold tracking-widest mb-12 uppercase text-xl z-10">Con Sistema Navia</h3>
        <ul className="space-y-10 z-10">
          {slide.after.map((item, i) => (
            <li key={i} className="flex items-center text-4xl text-white font-bold animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
              <span className="mr-4 p-1 bg-[#10B981]/20 rounded-full"><Icons.Check /></span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
    
    <div className="absolute top-10 w-full text-center pointer-events-none">
       <h2 className="text-4xl font-bold uppercase tracking-widest bg-black/50 inline-block px-6 py-2 rounded-full backdrop-blur-md">{slide.headline}</h2>
    </div>
  </LayoutWrapper>
);

const SlideStats = ({ slide }) => (
  <LayoutWrapper className="justify-center">
    <h2 className="text-4xl font-medium text-gray-400 mb-24 text-center uppercase tracking-[0.3em]">{slide.headline}</h2>
    
    <div className="grid grid-cols-3 gap-12 text-center">
      {slide.stats.map((stat, i) => (
        <div key={i} className="glass-card p-10 rounded-3xl border-t border-white/10 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
          {/* Corrected: Reduced font size from text-9xl to text-7xl/8xl */}
          <div className="text-7xl lg:text-8xl font-black text-white mb-4 tracking-tighter">{stat.value}</div>
          <div className="text-2xl font-bold text-[#A78BFA] uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  </LayoutWrapper>
);

const SlideCheckList = ({ slide, negative }) => (
  <LayoutWrapper>
    <div className={`max-w-4xl mx-auto w-full h-full flex flex-col justify-center ${negative ? 'opacity-80' : ''}`}>
      <h2 className={`text-5xl font-bold mb-16 uppercase tracking-wide ${negative ? 'text-gray-400' : 'text-white'}`}>{slide.headline}</h2>
      
      <div className="space-y-8 pl-8 border-l-4 border-white/10">
        {slide.items.map((item, i) => (
          <div key={i} className="flex items-start">
             <div className={`mt-1 mr-6 ${negative ? 'text-gray-600' : 'text-[#A78BFA]'}`}>
                {negative ? <Icons.X /> : <Icons.Check />}
             </div>
             <p className={`text-4xl font-light ${negative ? 'text-gray-500' : 'text-white'}`}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  </LayoutWrapper>
);

const SlideOffer = ({ slide }) => (
  <LayoutWrapper className="justify-center text-center">
    <h2 className="text-6xl font-bold text-white mb-20 uppercase">{slide.headline}</h2>
    
    <div className="flex justify-center gap-20">
      {slide.items.map((item, i) => {
        const IconComponent = Icons[item.icon];
        return (
          <div key={i} className="flex flex-col items-center animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
             <div className="w-40 h-40 rounded-full bg-gradient-to-b from-[#A78BFA]/20 to-transparent border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA] mb-8 shadow-[0_0_30px_rgba(167,139,250,0.15)]">
               <IconComponent />
             </div>
             <h3 className="text-3xl font-bold text-white uppercase tracking-wider">{item.title}</h3>
          </div>
        )
      })}
    </div>
  </LayoutWrapper>
);

const SlideCTA = ({ slide }) => (
  <LayoutWrapper className="justify-center items-center text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-[#A78BFA]/10 to-transparent"></div>
    
    <div className="relative z-10 p-20 glass-card rounded-[3rem] border border-[#A78BFA]/30 shadow-[0_0_100px_rgba(167,139,250,0.1)] max-w-5xl w-full animate-float">
      <h2 className="text-7xl font-black text-white mb-8 uppercase leading-tight">{slide.headline}</h2>
      <p className="text-3xl text-[#A78BFA] font-medium mb-12 uppercase tracking-widest">{slide.subheadline}</p>
      
      <div className="animate-bounce mt-10 text-white/50">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
      </div>
    </div>
    
    <div className="absolute bottom-10 text-sm text-gray-500 uppercase tracking-[0.3em]">
      Deja que tu atención sea un sistema, no un problema.
    </div>
  </LayoutWrapper>
);

// --- Main App Component ---

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const renderSlide = (slide) => {
    // We add a key here to force re-render and trigger animations
    const content = (() => {
      switch(slide.type) {
        case 'opening': return <SlideOpening slide={slide} />;
        case 'split-graph': return <SlideSplitGraph slide={slide} />;
        case 'list': return <SlideList slide={slide} />;
        case 'equation': return <SlideEquation slide={slide} />;
        case 'chaos': return <SlideChaos slide={slide} />;
        case 'cycle': return <SlideCycle slide={slide} />;
        case 'paradigm': return <SlideParadigm slide={slide} />;
        case 'hub': return <SlideHub slide={slide} />;
        case 'grid': return <SlideGrid slide={slide} />;
        case 'timeline': return <SlideTimeline slide={slide} />;
        case 'crm': return <SlideCRM slide={slide} />;
        case 'table': return <SlideTable slide={slide} />;
        case 'before-after': return <SlideBeforeAfter slide={slide} />;
        case 'stats': return <SlideStats slide={slide} />;
        case 'check-list': return <SlideCheckList slide={slide} negative={false} />;
        case 'disqualify': return <SlideCheckList slide={slide} negative={true} />;
        case 'offer': return <SlideOffer slide={slide} />;
        case 'cta': return <SlideCTA slide={slide} />;
        default: return <SlideOpening slide={slide} />;
      }
    })();
    
    return <div key={slide.id} className="w-full h-full">{content}</div>;
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black p-4 md:p-8 lg:p-12 relative">
      {/* Noise Texture Overlay for Film Look */}
      <div className="noise-overlay"></div>

      {/* Container for 16:9 Aspect Ratio */}
      <div className="w-full max-w-7xl slide-aspect bg-[#120E16] relative overflow-hidden shadow-2xl rounded-2xl border border-gray-900 z-10">
        
        {/* Slide Render */}
        <div className="w-full h-full">
          {renderSlide(slides[currentSlide])}
        </div>

        {/* Navigation UI & Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div 
                className="h-full bg-[#A78BFA] transition-all duration-300" 
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity z-50">
          <span className="text-white/30 text-sm font-mono tracking-widest mr-2">
            SLIDE {currentSlide + 1} / {slides.length}
          </span>
          <button onClick={handlePrev} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
            <Icons.ChevronLeft />
          </button>
          <button onClick={handleNext} className="p-3 bg-[#A78BFA] hover:bg-[#8B5CF6] rounded-full text-white shadow-lg transition-all">
            <Icons.ChevronRight />
          </button>
        </div>

      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);