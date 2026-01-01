export default function HowItWorks() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#B4BEC9]/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-[#000000] mb-6">
            How it works
          </h2>
          <p className="text-xl text-[#002333]/70">
            Three steps. That's it.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 border-l-4 border-[#0E4D85] hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-6">
              <div className="text-5xl font-bold text-[#0E4D85]/20">01</div>
              <div>
                <h3 className="text-2xl font-bold text-[#000000] mb-2">Drop it in</h3>
                <p className="text-[#002333]/70 text-lg">Paste a link, upload a file, or jot down a thought. Takes 2 seconds.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border-l-4 border-[#002333] hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-6">
              <div className="text-5xl font-bold text-[#002333]/20">02</div>
              <div>
                <h3 className="text-2xl font-bold text-[#000000] mb-2">We organize it</h3>
                <p className="text-[#002333]/70 text-lg">mindVault automatically tags and categorizes. You don't lift a finger.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border-l-4 border-[#0E4D85] hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-6">
              <div className="text-5xl font-bold text-[#0E4D85]/20">03</div>
              <div>
                <h3 className="text-2xl font-bold text-[#000000] mb-2">Find it instantly</h3>
                <p className="text-[#002333]/70 text-lg">Search when you need it. Your digital brain remembers everything.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
