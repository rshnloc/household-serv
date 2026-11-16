import React from 'react';
import { 
  Droplets, 
  Zap, 
  Wind, 
  Sparkles, 
  Hammer, 
  Cpu, 
  Trees, 
  Paintbrush, 
  ShieldCheck,
  Grid
} from 'lucide-react';
import { Category } from '../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-teal-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-orange-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-violet-500" />;
      case 'Trees': return <Trees className="w-5 h-5 text-emerald-500" />;
      case 'Paintbrush': return <Paintbrush className="w-5 h-5 text-pink-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-cyan-600" />;
      default: return <Hammer className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 custom-scrollbar">
          {/* All Categories Option */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border shrink-0 ${
              selectedCategorySlug === null
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>All Services</span>
          </button>

          {categories.map((c) => {
            const isSelected = selectedCategorySlug === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(isSelected ? null : c.slug)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-sky-50 text-sky-900 border-sky-400 ring-2 ring-sky-300/40 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-1 rounded-lg ${isSelected ? 'bg-white' : 'bg-slate-50'}`}>
                  {getCategoryIcon(c.icon)}
                </div>
                <div className="text-left">
                  <div className="leading-tight font-bold">{c.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {c.verified_pros_count} verified
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
