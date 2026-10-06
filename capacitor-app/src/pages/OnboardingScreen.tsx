import React, { useState } from 'react';
import { Home, Users, Building2, ArrowRight } from 'lucide-react';

const slides = [
  {
    bg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    icon: Home,
    title: 'Find Your Dream Home',
    subtitle: 'Search from 10,000+ verified properties across India\'s top cities'
  },
  {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    icon: Users,
    title: 'Connect Directly With Owners',
    subtitle: 'Zero brokerage. Contact owners directly via phone or WhatsApp'
  },
  {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    icon: Building2,
    title: 'List Your Property Free',
    subtitle: 'Verified sellers reach genuine buyers faster. Admin-verified listings get 5x more views'
  }
];

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      localStorage.setItem('nobroker_onboarded', 'true');
      onDone();
    } else {
      setCurrentSlide(s => s + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('nobroker_onboarded', 'true');
    onDone();
  };

  const SlideIcon = slides[currentSlide].icon;

  return (
    <div className={`flex flex-col min-h-screen text-white transition-colors duration-500 ${slides[currentSlide].bg}`}>
      <div className="flex justify-end p-4 pt-safe" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <button onClick={handleSkip} className="text-white/80 font-medium btn-press px-4 py-2">
          Skip
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 slide-in-right" key={currentSlide}>
        <div className="bg-white/20 p-8 rounded-full mb-8">
          <SlideIcon className="w-20 h-20 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">{slides[currentSlide].title}</h1>
        <p className="text-center text-lg text-white/90">{slides[currentSlide].subtitle}</p>
      </div>

      <div className="flex items-center justify-between p-8 pb-safe" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
        <div className="flex space-x-2">
          {slides.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
        <button onClick={handleNext} className="flex items-center space-x-2 bg-transparent border-2 border-white rounded-full px-6 py-3 font-semibold btn-press">
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next →'}</span>
        </button>
      </div>
    </div>
  );
};
