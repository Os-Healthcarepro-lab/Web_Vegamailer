import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MousePointerClick, MailOpen, Send, AlertTriangle, UserMinus } from 'lucide-react';

export const CampaignAnalyticsCard = ({ stats }) => {
  if (!stats) return null;

  const { sent = 0, delivered = 0, opened = 0, clicked = 0, bounced = 0, unsubscribed = 0 } = stats;
  
  const openRate = delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : 0;
  const clickRate = opened > 0 ? ((clicked / opened) * 100).toFixed(1) : 0;
  const bounceRate = sent > 0 ? ((bounced / sent) * 100).toFixed(1) : 0;

  const chartData = [
    { name: 'Sent', value: sent, color: 'hsl(var(--primary))' },
    { name: 'Delivered', value: delivered, color: 'hsl(var(--success))' },
    { name: 'Opened', value: opened, color: 'hsl(var(--secondary))' },
    { name: 'Clicked', value: clicked, color: 'hsl(var(--accent))' },
  ];

  const StatItem = ({ label, value, rate, icon: Icon, colorClass }) => (
    <div className="flex flex-col p-4 bg-muted/30 rounded-xl border border-border/50">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Icon className={`h-4 w-4 ${colorClass}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value.toLocaleString()}</span>
        {rate !== undefined && (
          <span className="text-xs font-medium text-muted-foreground">({rate}%)</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatItem label="Sent" value={sent} icon={Send} colorClass="text-primary" />
        <StatItem label="Delivered" value={delivered} rate={((delivered/sent)*100 || 0).toFixed(1)} icon={Send} colorClass="text-success" />
        <StatItem label="Opened" value={opened} rate={openRate} icon={MailOpen} colorClass="text-secondary" />
        <StatItem label="Clicked" value={clicked} rate={clickRate} icon={MousePointerClick} colorClass="text-accent" />
        <StatItem label="Bounced" value={bounced} rate={bounceRate} icon={AlertTriangle} colorClass="text-destructive" />
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};