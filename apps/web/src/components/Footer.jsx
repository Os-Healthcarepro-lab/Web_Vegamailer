import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card/30 border-t border-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-bold text-xl">VegaMailer</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The professional open-source alternative for email marketing. Send unlimited emails, track campaigns, and scale your business.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li>
                <a href="mailto:mail.os-healthcarepro.com" className="hover:text-primary transition-colors">
                  mail.os-healthcarepro.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VegaMailer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;