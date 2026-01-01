import { useRouter } from "next/router";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-[#B4BEC9]/30 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-[#0E4D85] rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#000000]">mindVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/login')}
              className="text-[#002333] hover:text-[#0E4D85] transition-colors"
            >
              Login
            </Button>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-[#0E4D85] hover:bg-[#002333] text-white transition-all transform hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
