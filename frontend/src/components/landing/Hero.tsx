import { useRouter } from "next/router";
import { Brain, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 relative flex items-center" style={{background: 'linear-gradient(to right, #C5DBF0 0%, #C5DBF0 50%, #F0E8D8 50%, #F0E8D8 100%)'}}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <div className="text-[#0E4D85] text-sm font-medium tracking-wider mb-2 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-[#0E4D85]"></div>
                MINDVAULT
              </div>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-[#000000]">Your brain,</span>
              <br />
              <span className="text-[#000000]">but </span>
              <span className="relative inline-block">
                <span className="text-[#0E4D85]">digital</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4C50 4 50 4 100 4C150 4 150 4 200 4" stroke="#0E4D85" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg text-[#002333]/80 max-w-md">
              Stop losing track. Save everything—YouTube videos, articles, PDFs, random thoughts—and find them instantly when you need them.
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => router.push('/register')}
                className="bg-[#000000] hover:bg-[#0E4D85] text-white px-8 h-12 text-base group"
              >
                Start free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="ghost"
                className="text-[#000000] hover:text-[#0E4D85] h-12 text-base"
              >
                See it in action →
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-[#000000]">Zero setup</div>
                <div className="text-sm text-[#002333]/60">Start in seconds</div>
              </div>
              <div className="w-px h-12 bg-[#B4BEC9]/30"></div>
              <div>
                <div className="text-2xl font-bold text-[#000000]">All formats</div>
                <div className="text-sm text-[#002333]/60">Videos to PDFs</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-linear-to-br from-[#0E4D85]/30 to-[#002333]/25 rounded-3xl p-8 relative border-2 border-[#0E4D85]/50 shadow-2xl">
              {/* Floating cards mockup */}
              <div className="space-y-4">
                <div className="bg-white border-2 border-[#0E4D85]/60 rounded-xl p-4 transform rotate-1 hover:rotate-0 transition-transform cursor-pointer shadow-lg hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#0E4D85]/20 rounded-lg flex items-center justify-center border border-[#0E4D85]/30">
                      <svg className="w-5 h-5 text-[#0E4D85]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#000000]">React Hooks Explained</div>
                      <div className="text-xs text-[#002333]/60">YouTube • Saved 2 days ago</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#002333]/50 rounded-xl p-4 transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer shadow-lg hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#002333]/20 rounded-lg flex items-center justify-center border border-[#002333]/30">
                      <svg className="w-5 h-5 text-[#002333]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#000000]">Design System Guide.pdf</div>
                      <div className="text-xs text-[#002333]/60">PDF • Saved last week</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#0E4D85]/60 rounded-xl p-4 transform rotate-2 hover:rotate-0 transition-transform cursor-pointer shadow-lg hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#0E4D85]/20 rounded-lg flex items-center justify-center border border-[#0E4D85]/30">
                      <Sparkles className="w-5 h-5 text-[#0E4D85]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#000000]">Weekend project ideas</div>
                      <div className="text-xs text-[#002333]/60">Note • Created today</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating brain icon */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#0E4D85] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 hover:rotate-0 transition-transform border-2 border-[#0E4D85]/30 ring-4 ring-[#0E4D85]/10">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
