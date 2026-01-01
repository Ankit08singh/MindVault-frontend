import { 
  Youtube, 
  Link2, 
  FileText, 
  StickyNote,
  Search,
  Zap
} from "lucide-react";

export default function Features() {

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="text-[#0E4D85] text-sm font-medium tracking-wider mb-4 flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#0E4D85]"></div>
            WHAT YOU CAN SAVE
          </div>
          <h2 className="text-5xl font-bold text-[#000000] max-w-2xl">
            Everything worth remembering
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {/* Large Card - YouTube */}
          <div className="md:col-span-2 bg-[#0E4D85] text-white rounded-3xl p-12 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <Youtube className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-bold mb-3">YouTube Videos</h3>
            <p className="text-white/80 text-lg max-w-md">That 40-minute tutorial you'll definitely watch later. Save it before the algorithm buries it forever.</p>
          </div>

          {/* Small Card - Links */}
          <div className="bg-white border-2 border-[#000000] rounded-3xl p-8 hover:bg-[#000000] hover:text-white transition-all group">
            <Link2 className="w-10 h-10 mb-4 group-hover:rotate-12 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Web Links</h3>
            <p className="text-[#002333]/80 group-hover:text-white/80 text-sm">Bookmark now, read when you actually have time (or never, we don't judge).</p>
          </div>

          {/* Small Card - PDFs */}
          <div className="bg-[#B4BEC9]/20 rounded-3xl p-8 hover:bg-[#B4BEC9]/40 transition-all group">
            <FileText className="w-10 h-10 mb-4 text-[#002333] group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2 text-[#000000]">PDFs</h3>
            <p className="text-[#002333]/70 text-sm">Research papers, ebooks, receipts. All searchable, none lost.</p>
          </div>

          {/* Large Card - Notes */}
          <div className="md:col-span-2 bg-[#002333] text-white rounded-3xl p-12 relative overflow-hidden hover:scale-[1.02] transition-transform">
            <StickyNote className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-bold mb-3">Quick Notes</h3>
            <p className="text-white/80 text-lg max-w-md">Random 3am thoughts, meeting notes, brilliant ideas. Capture them before they disappear.</p>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-[#B4BEC9]/30 rounded-2xl p-8 hover:border-[#0E4D85] transition-all">
            <Search className="w-10 h-10 text-[#0E4D85] mb-4" />
            <h3 className="text-2xl font-bold text-[#000000] mb-2">Search everything</h3>
            <p className="text-[#002333]/70">Find that thing you saved 6 months ago in seconds. Your memory, but better.</p>
          </div>

          <div className="bg-white border-2 border-[#B4BEC9]/30 rounded-2xl p-8 hover:border-[#0E4D85] transition-all">
            <Zap className="w-10 h-10 text-[#0E4D85] mb-4" />
            <h3 className="text-2xl font-bold text-[#000000] mb-2">Lightning fast</h3>
            <p className="text-[#002333]/70">No loading screens, no friction. Save and search at the speed of thought.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
