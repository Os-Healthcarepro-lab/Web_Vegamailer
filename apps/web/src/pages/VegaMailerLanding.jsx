import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Code2, 
  LayoutDashboard, 
  Users, 
  LineChart, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import StepCard from '@/components/StepCard';
import ComparisonTable from '@/components/ComparisonTable';
import UseCaseCard from '@/components/UseCaseCard';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { staggerChildren: 0.1 }
};

const VegaMailerLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>VegaMailer | Professional Email Marketing Platform</title>
        <meta name="description" content="Add your SMTP or API. Send unlimited emails. Track every campaign. The open-source alternative to Mautic and EasySendy." />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-[90dvh] flex items-center hero-gradient">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1651055758342-56397dc0c68e?q=80&w=2070&auto=format&fit=crop" 
            alt="Abstract technology background" 
            className="w-full h-full object-cover mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Professional Email <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Marketing Platform</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Add your SMTP or API. Send unlimited emails. Track every campaign. 
              The open-source alternative to Mautic and EasySendy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all" asChild>
                <a href="https://app.os-healthcarepro.com">
                  Start Free <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-border hover:bg-muted transition-all" asChild>
                <a href="/contact">Request a Quote</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. KEY FEATURES SECTION */}
      <section id="features" className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Email Marketing</h2>
            <p className="text-lg text-muted-foreground">Everything you need to build, send, and optimize your email campaigns at scale.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={Server}
                title="SMTP Integration"
                description="Connect your own SMTP server or use any email service provider. Full control over your email infrastructure."
                details={['Gmail, SendGrid, AWS SES', 'Mailgun, Custom SMTP', 'Multiple sender identities']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={Code2}
                title="API Integration"
                description="Integrate with your existing tools and workflows. Send emails programmatically with our REST API."
                details={['Webhooks support', 'Real-time delivery tracking', 'Batch sending capabilities']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={LayoutDashboard}
                title="Campaign Management"
                description="Create, schedule, and send campaigns in minutes. No coding required."
                details={['Drag-and-drop editor', 'Pre-built templates', 'A/B testing']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={Users}
                title="Subscriber Management"
                description="Organize and segment your contacts intelligently. Target the right audience every time."
                details={['Smart segmentation', 'List management', 'Easy import/export']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={LineChart}
                title="Analytics & Reporting"
                description="Real-time insights into campaign performance. Track opens, clicks, bounces, and more."
                details={['Detailed reports', 'Engagement metrics', 'ROI tracking']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard 
                icon={ShieldCheck}
                title="Email Validation"
                description="Validate email addresses before sending. Reduce bounces and protect your sender reputation."
                details={['Real-time validation', 'Disposable email detection', 'Typo suggestions']}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Performance at a Glance</h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
          >
            {[
              { value: '500M+', label: 'Emails Sent', sub: 'Delivered successfully' },
              { value: '98.5%', label: 'Delivery Rate', sub: 'Industry leading' },
              { value: '99.99%', label: 'Uptime', sub: 'Guaranteed reliability' },
              { value: '50K+', label: 'Active Users', sub: 'Trusted worldwide' },
              { value: '2.1s', label: 'Avg Delivery', sub: 'Lightning fast' },
              { value: '24/7', label: 'Support', sub: 'Always here to help' },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeIn} className="bg-card rounded-2xl p-6 md:p-8 border border-border text-center hover:border-primary/30 transition-colors">
                <div className="text-3xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">{stat.value}</div>
                <div className="text-primary font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-lg text-muted-foreground">Launch your first campaign today with our streamlined onboarding process.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -translate-y-1/2 z-0" />
            
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <StepCard 
                number="1"
                title="Add Your SMTP or API"
                description="Connect your email service provider or SMTP server. We support all major providers."
                details={['Gmail SMTP, SendGrid API', 'AWS SES, Mailgun', 'Custom SMTP servers', 'Resend API']}
              />
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <StepCard 
                number="2"
                title="Create Your Campaign"
                description="Design beautiful emails with our drag-and-drop editor or use pre-built templates."
                details={['Drag-and-drop editor', '100+ pre-built templates', 'Custom HTML support', 'Mobile-responsive design']}
              />
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <StepCard 
                number="3"
                title="Send & Track"
                description="Send your campaign and track performance in real-time. Monitor opens, clicks, and conversions."
                details={['Real-time delivery tracking', 'Open and click tracking', 'Bounce management', 'Detailed analytics']}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON SECTION */}
      <section id="comparison" className="py-24 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">VegaMailer vs Mautic vs EasySendy</h2>
            <p className="text-lg text-muted-foreground">See why growing businesses choose VegaMailer for their email infrastructure.</p>
          </motion.div>

          <motion.div {...fadeIn}>
            <ComparisonTable />
          </motion.div>
        </div>
      </section>

      {/* 6. USE CASES SECTION */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Business</h2>
            <p className="text-lg text-muted-foreground">Flexible tools that adapt to your industry's unique requirements.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeIn}>
              <UseCaseCard 
                title="E-Commerce"
                description="Send transactional emails, promotional campaigns, and abandoned cart reminders."
                features={['Order confirmations', 'Shipping notifications', 'Product recommendations']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <UseCaseCard 
                title="SaaS & Software"
                description="Onboard users, send notifications, and keep customers engaged."
                features={['Welcome emails', 'Feature announcements', 'Usage reports']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <UseCaseCard 
                title="Agencies & Freelancers"
                description="Manage multiple client campaigns from one platform."
                features={['Client management', 'White-label options', 'Team collaboration']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <UseCaseCard 
                title="Non-Profits & Education"
                description="Reach donors, members, and supporters with targeted campaigns."
                features={['Donor communications', 'Event invitations', 'Fundraising campaigns']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <UseCaseCard 
                title="Healthcare & Medical"
                description="Send appointment reminders, patient communications, and newsletters."
                features={['HIPAA compliance', 'Appointment reminders', 'Patient engagement']}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <UseCaseCard 
                title="Marketing Agencies"
                description="Create and manage campaigns for multiple clients with advanced reporting."
                features={['Multi-client management', 'White-label platform', 'Advanced analytics']}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Email Marketing?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10">
              Join thousands of businesses sending better emails.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-base bg-white text-primary hover:bg-white/90 transition-all" asChild>
                <a href="https://app.os-healthcarepro.com">Start Free</a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-white/30 text-white hover:bg-white/10 transition-all" asChild>
                <a href="/contact">Request a Quote</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VegaMailerLanding;