import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, details }) => {
  return (
    <Card className="bg-card/50 border-border/50 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group">
      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      
      <ul className="space-y-2">
        {details.map((detail, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default FeatureCard;