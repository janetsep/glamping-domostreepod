import { MapPin, Phone, Mail, MessageSquare, Facebook, Instagram, Youtube } from "lucide-react";
import { footerContent } from "@/data/siteContent";
const ContactInfo = () => {
  return <div>
      <h4 className="font-display font-bold text-lg mb-4">{footerContent.contactTitle}</h4>
      <ul className="space-y-3 text-gray-600">
        
        
        <li className="flex items-center gap-2">
          <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
          <a href={`mailto:${footerContent.email}`} className="hover:text-primary transition-colors">
            {footerContent.email}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
          <a href={`https://wa.me/${footerContent.phone.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{footerContent.phone}</a>
        </li>
      </ul>
      <div className="flex gap-3 mt-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white hover:bg-primary/10 shadow-sm transition-colors">
          <Facebook className="h-5 w-5 text-cyan-500" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white hover:bg-primary/10 shadow-sm transition-colors">
          <Instagram className="h-5 w-5 text-cyan-500" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white hover:bg-primary/10 shadow-sm transition-colors">
          <Youtube className="h-5 w-5 text-cyan-500" />
        </a>
      </div>
    </div>;
};
export default ContactInfo;