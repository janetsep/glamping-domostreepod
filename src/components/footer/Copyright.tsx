
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { footerContent } from "@/data/siteContent";

const Copyright = () => {
  return <div className="border-t border-gray-200 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm mb-4 md:mb-0">{footerContent.copyrightText}</p>
        <Button variant="ghost" onClick={() => window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })} className="text-cyan-500 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {footerContent.backToTopButton}
        </Button>
      </div>
    </div>;
};

export default Copyright;
