
import { MessageSquare, Phone, Mail } from "lucide-react";
import { contactPageContent } from "@/data/siteContent";

const ContactInfo = () => {
  return <div className="bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-6">{contactPageContent.contactInfoTitle}</h3>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <MessageSquare className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">{contactPageContent.whatsappLabel}</h4>
            <a href="https://wa.me/56984643307" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-500 transition-colors">+56 9 8464 3307</a>
            <p className="text-sm text-gray-500 mt-1">{contactPageContent.whatsappText}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <Phone className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">{contactPageContent.phoneLabel}</h4>
            <a href="tel:+569 8464 3307" className="text-gray-600 hover:text-cyan-500 transition-colors">+56 9 8464 3307</a>
            <p className="text-sm text-gray-500 mt-1">{contactPageContent.phoneText}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <Mail className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">{contactPageContent.emailLabel}</h4>
            <a href="mailto:info@domostreepod.cl" className="text-gray-600 hover:text-cyan-500 transition-colors">
              info@domostreepod.cl
            </a>
            <p className="text-sm text-gray-500 mt-1">{contactPageContent.emailText}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-cyan-50 p-6 rounded-lg border border-cyan-100">
        <h4 className="font-semibold text-cyan-800 mb-2">{contactPageContent.scheduleTitle}</h4>
        <p className="text-sm text-cyan-700">
          {contactPageContent.scheduleText}
        </p>
      </div>
    </div>;
};

export default ContactInfo;
