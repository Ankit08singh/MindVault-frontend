import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-[#000000] mb-6">
          Stop forgetting.
          <br />
          <span className="text-[#0E4D85]">Start remembering.</span>
        </h2>
        
        <p className="text-xl text-[#002333]/70 mb-12 max-w-2xl mx-auto">
          Your brain has better things to do than remember where you saved that article from 3 weeks ago.
        </p>
        
        <Button 
          onClick={() => router.push('/register')}
          className="bg-[#000000] hover:bg-[#0E4D85] text-white px-12 h-14 text-lg group"
        >
          Get started — it's free
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-sm text-[#002333]/50 mt-6">
          No credit card. No BS. Just your digital brain.
        </p>
      </div>
    </section>
  );
}
