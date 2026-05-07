import React from 'react';
import { Check, X } from 'lucide-react';

const ComparisonTable = () => {
  const features = [
    { name: 'SMTP Integration', vega: 'Full support', mautic: 'Limited', easy: 'Limited' },
    { name: 'API Integration', vega: 'Full REST API', mautic: 'Yes', easy: 'Yes' },
    { name: 'Email Validation', vega: 'Real-time validation', mautic: false, easy: false },
    { name: 'Drag-and-Drop Editor', vega: 'Yes', mautic: 'Yes', easy: 'Yes' },
    { name: 'Subscriber Management', vega: 'Advanced segmentation', mautic: 'Yes', easy: 'Basic' },
    { name: 'Analytics & Reporting', vega: 'Real-time', mautic: 'Yes', easy: 'Basic' },
    { name: 'Support', vega: '24/7 Email & Chat', mautic: 'Community', easy: 'Email' },
    { name: 'Pricing', vega: 'Flexible & Affordable', mautic: 'Open-source', easy: 'Affordable' },
  ];

  const renderValue = (val, isVega) => {
    if (val === false) return <X className="h-5 w-5 text-destructive mx-auto" />;
    if (val === 'Yes') return <Check className={`h-5 w-5 mx-auto ${isVega ? 'text-primary' : 'text-muted-foreground'}`} />;
    return (
      <div className="flex items-center justify-center gap-2">
        <Check className={`h-4 w-4 shrink-0 ${isVega ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className={isVega ? 'font-medium text-foreground' : 'text-muted-foreground'}>{val}</span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card/30">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
          <tr>
            <th className="px-6 py-5 font-semibold text-base">Features</th>
            <th className="px-6 py-5 text-center font-bold text-lg text-primary bg-primary/5 border-x border-primary/20">VegaMailer</th>
            <th className="px-6 py-5 text-center font-semibold text-base">Mautic</th>
            <th className="px-6 py-5 text-center font-semibold text-base">EasySendy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {features.map((feature, idx) => (
            <tr key={idx} className="hover:bg-muted/20 transition-colors">
              <td className="px-6 py-4 font-medium text-foreground">{feature.name}</td>
              <td className="px-6 py-4 text-center bg-primary/5 border-x border-primary/20">
                {renderValue(feature.vega, true)}
              </td>
              <td className="px-6 py-4 text-center">{renderValue(feature.mautic, false)}</td>
              <td className="px-6 py-4 text-center">{renderValue(feature.easy, false)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;