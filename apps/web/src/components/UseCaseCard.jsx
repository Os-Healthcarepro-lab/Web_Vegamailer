import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const UseCaseCard = ({ title, description, features }) => {
  return (
    <Card className="bg-card/40 border-border/50 p-6 hover:bg-card hover:border-primary/40 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{description}</p>
      
      <div className="space-y-2 pt-4 border-t border-border/50">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UseCaseCard;