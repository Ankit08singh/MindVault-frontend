import { Brain } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#B4BEC9]/30 py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0E4D85] rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#000000]">mindVault</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="text-[#002333]/60 hover:text-[#000000] transition-colors">About</a>
            <a href="#" className="text-[#002333]/60 hover:text-[#000000] transition-colors">Features</a>
            <a href="#" className="text-[#002333]/60 hover:text-[#000000] transition-colors">Privacy</a>
            <a href="#" className="text-[#002333]/60 hover:text-[#000000] transition-colors">Terms</a>
            <a href="#" className="text-[#002333]/60 hover:text-[#000000] transition-colors">Contact</a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-[#002333]/60">
            © {currentYear} mindVault
          </div>
        </div>
      </div>
    </footer>
  );
}
