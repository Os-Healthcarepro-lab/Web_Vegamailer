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
        <title>VegaMailer - Send Unlimited Emails with Your SMTP | Email Marketing Platform</title>
        <meta name="description" content="The only email marketing platform that lets you bring your own SMTP or API. No sending limits. No per-email fees. Start sending unlimited emails with Gmail, SendGrid, AWS SES, Mailgun, or any SMTP server." />
        <meta name="keywords" content="email marketing, SMTP integration, email campaign, bulk email, email automation, mautic alternative, easysendy alternative, self-hosted email" />
        
        {/* Open Graph */}
        <meta property="og:title" content="VegaMailer - Your SMTP. Your API. Unlimited Emails." />
        <meta property="og:description" content="Professional email marketing platform with your own SMTP or API. No limits, no per-email costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vegamailer.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VegaMailer - Send Unlimited Emails" />
        <meta name="twitter:description" content="Bring your own SMTP or API. No sending limits. Professional email marketing at a fraction of the cost." />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-[90dvh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto text-center space-y-8"
          >
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Trusted by 50,000+ businesses worldwide</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Your SMTP. Your API.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400">
                Unlimited Emails.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The only email marketing platform that lets you <span className="text-foreground font-semibold">bring your own SMTP or API</span>. 
              No sending limits. No per-email fees. Complete control over your infrastructure.
            </p>
            
            {/* Key value props */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>No sending limits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>Self-hosted option</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>Full API access</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all group" asChild>
                <a href="https://app.os-healthcarepro.com">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-border hover:bg-muted hover:border-primary/50 transition-all" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            {/* Social proof logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-8"
            >
              <p className="text-sm text-muted-foreground mb-6">Integrates with your favorite email providers</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
                <span className="text-xl font-bold">Gmail</span>
                <span className="text-xl font-bold">SendGrid</span>
                <span className="text-xl font-bold">AWS SES</span>
                <span className="text-xl font-bold">Mailgun</span>
                <span className="text-xl font-bold">Resend</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. KEY FEATURES SECTION */}
      <section id="features" className="py-24 bg-background relative border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              Platform Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Scale Email Marketing</h2>
            <p className="text-lg text-muted-foreground">Professional-grade tools without the enterprise price tag. Built for marketers who need flexibility and power.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Proven Performance at Scale</h2>
            <p className="text-lg text-muted-foreground">Real metrics from real businesses using VegaMailer</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
          >
            {[
              { value: '500M+', label: 'Emails Delivered', sub: 'Monthly volume', gradient: 'from-blue-500 to-cyan-500' },
              { value: '98.7%', label: 'Delivery Rate', sub: 'Industry leading', gradient: 'from-green-500 to-emerald-500' },
              { value: '99.99%', label: 'Uptime SLA', sub: 'Guaranteed reliability', gradient: 'from-purple-500 to-pink-500' },
              { value: '50K+', label: 'Active Users', sub: 'Businesses worldwide', gradient: 'from-orange-500 to-red-500' },
              { value: '< 2s', label: 'Avg Delivery', sub: 'Lightning fast', gradient: 'from-yellow-500 to-orange-500' },
              { value: '24/7', label: 'Support', sub: 'Always available', gradient: 'from-indigo-500 to-blue-500' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeIn} 
                className="relative bg-card rounded-2xl p-6 md:p-8 border border-border text-center hover:border-primary/30 transition-all group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="text-3xl md:text-5xl font-bold text-foreground mb-2 tracking-tight relative">{stat.value}</div>
                <div className="text-primary font-medium mb-1 relative">{stat.label}</div>
                <div className="text-sm text-muted-foreground relative">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div {...fadeIn} className="mt-16 pt-12 border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground mb-8">Compliant with industry standards</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">CAN-SPAM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              Simple Setup
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Launch Your First Campaign in Minutes</h2>
            <p className="text-lg text-muted-foreground">No credit card required. No complicated setup. Start sending professional emails today.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-20 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0" />
            
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <StepCard 
                number="1"
                title="Connect Your Email Provider"
                description="Add your SMTP credentials or API keys. We support all major providers and custom SMTP servers."
                details={['Gmail, Outlook, SendGrid', 'AWS SES, Mailgun, Resend', 'Custom SMTP (port 587/465)', 'Multiple sender identities']}
              />
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <StepCard 
                number="2"
                title="Build Your Campaign"
                description="Use our drag-and-drop editor, choose from templates, or upload your own HTML. Mobile-responsive by default."
                details={['Visual email builder', '100+ professional templates', 'HTML/CSS support', 'Personalization & merge tags']}
              />
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <StepCard 
                number="3"
                title="Send & Track Results"
                description="Schedule or send immediately. Monitor real-time delivery, opens, clicks, and conversions with detailed analytics."
                details={['Real-time tracking dashboard', 'Open & click rates', 'Geographic insights', 'Conversion tracking']}
              />
            </motion.div>
          </div>

          {/* Why VegaMailer callout */}
          <motion.div {...fadeIn} className="mt-20 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 rounded-3xl border border-primary/20 p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Why Choose VegaMailer?</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d=\"M5 13l4 4L19 7\" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2\">No Per-Email Costs</h4>
                    <p className="text-sm text-muted-foreground\">Send unlimited emails. You only pay for the platform, not per message.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round\" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Your Data, Your Control</h4>
                    <p className="text-sm text-muted-foreground">Self-hosted option available. Keep complete control over your data and infrastructure.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Open Source & Extensible</h4>
                    <p className="text-sm text-muted-foreground">Built on open standards. Extend with webhooks, APIs, and custom integrations.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Server className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Enterprise-Grade Infrastructure</h4>
                    <p className="text-sm text-muted-foreground">99.99% uptime SLA, dedicated IP options, and white-label capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. COMPARISON SECTION */}
      <section id="comparison" className="py-24 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              Platform Comparison
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">VegaMailer vs Traditional Email Platforms</h2>
            <p className="text-lg text-muted-foreground">See why thousands of businesses are switching from Mautic, EasySendy, and traditional ESPs.</p>
          </motion.div>

          <motion.div {...fadeIn}>
            <ComparisonTable />
          </motion.div>

          {/* Pricing hint */}
          <motion.div {...fadeIn} className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-card border border-primary/20">
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary\">Save up to 80%</span>
                  <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium\">vs SendGrid/Mailchimp</span>
                </div>
                <p className="text-sm text-muted-foreground\">Pay for the platform, not per email. Perfect for high-volume senders.</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90\" asChild>
                <a href=\"/contact\">Get Custom Quote</a>
              </Button>
            </div>
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
      <section className="py-24 bg-gradient-to-br from-primary via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...fadeIn}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium text-white mb-8">
              🚀 Ready to Scale Your Email Marketing?
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Start Sending Unlimited Emails Today
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join 50,000+ businesses using VegaMailer to send better emails at a fraction of the cost.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-10 text-base bg-white text-primary hover:bg-white/90 shadow-2xl font-semibold transition-all" asChild>
                <a href="https://app.os-healthcarepro.com">Start Free Trial →</a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all" asChild>
                <a href="/contact">Talk to Sales</a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VegaMailerLanding;