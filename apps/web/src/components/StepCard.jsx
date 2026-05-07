import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const StepCard = ({ number, title, description, details }) => {
  return (
    <Card className="bg-card/50 border-border/50 p-8 relative overflow-hidden hover:border-primary/50 transition-all duration-300">
      <div className="absolute -right-4 -top-4 text-9xl font-extrabold text-primary/5 select-none pointer-events-none">
        {number}
      </div>
      <div className="relative z-10">
        <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-primary/20">
          {number}
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
        
        <ul className="space-y-3">
          {details.map((detail, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-foreground/80">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default StepCard;