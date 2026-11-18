import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Briefcase size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold">CareerBridge</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Connecting Rwandan talent to opportunity. Your career journey starts here.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold mb-4 text-white">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[['Browse Jobs', '/opportunities'], ['Internships', '/opportunities?category=Internships'], ['Graduate Programs', '/opportunities?category=Graduate+Programs'], ['Career Resources', '/resources'], ['Create Profile', '/register']].map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-accent transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-4 text-white">For Employers</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[['Post a Job', '/register'], ['Find Candidates', '/register'], ['Employer Dashboard', '/employer/dashboard'], ['Verification', '/register'], ['Pricing', '#']].map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-accent transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><MapPin size={15} className="text-accent shrink-0" /> Kigali, Rwanda</li>
              <li className="flex items-center gap-2"><Phone size={15} className="text-accent shrink-0" /> +250 788 000 000</li>
              <li className="flex items-center gap-2"><Mail size={15} className="text-accent shrink-0" /> hello@careerbridge.rw</li>
            </ul>
            <div className="mt-4 space-y-1 text-sm text-white/70">
              <Link to="/privacy" className="block hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="block hover:text-accent transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© {new Date().getFullYear()} CareerBridge. All rights reserved.</p>
          <p>Made with ❤️ for Rwanda</p>
        </div>
      </div>
    </footer>
  );
}
