import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import { Hammer, TreePine, ShieldCheck, Award, Heart, CheckCircle2, Clock } from "lucide-react";
import headerImg from "../assets/header.jpg";
import doorImg from "../assets/door.jpeg";
import designImg from "../assets/design.jpeg";

function About() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#1C130D] text-[#F3E9D8] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C9873F]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C9873F]/20 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            20+ Years of Craftsmanship
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E9D8]">
            The Heritage of Solaimalai Wood Works
          </h1>
          <p className="text-sm sm:text-base text-[#D4C3AC] max-w-2xl mx-auto leading-relaxed">
            Where traditional Tamil Nadu artisanal carpentry meets precision modern joinery — pure solid teak, built to endure for generations.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1">
        
        {/* Section 1: Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9E5A1C]">
              <TreePine className="w-4 h-4" />
              <span>Three Generations of Master Joinery</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#291811]">
              Born from a Passion for Authentic Solid Wood
            </h2>
            <p className="text-xs sm:text-sm text-[#735A47] leading-relaxed">
              Solaimalai Wood Works began with a singular promise: <span className="font-semibold text-[#1C130D]">never compromise on wood quality</span>. What started as a humble village carpentry workshop has flourished into a revered name for luxury bespoke solid teak furniture, temple-grade carved doors, and architectural interior woodwork.
            </p>
            <p className="text-xs sm:text-sm text-[#735A47] leading-relaxed">
              Unlike mass-manufactured veneer and particle board furniture that deteriorates in years, our pieces are hand-selected from matured logs, naturally seasoned, and cut to preserve the natural grain beauty.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#291811]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9873F]" />
                <span>Zero Compressed Wood</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9873F]" />
                <span>Natural Oil & Wax Finishes</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EBDCC8] h-80 lg:h-96">
            <img
              src={headerImg}
              alt="Solaimalai Workshop Timber Craft"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Section 2: Our Craft & Quality Pillars */}
        <div className="bg-[#FAF3E7] rounded-3xl p-8 sm:p-12 border border-[#EBDCC8]">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#291811] text-center mb-10">
            Our Quality Standards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#EBDCC8] shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-[#F4E9D8] text-[#9E5A1C] w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#291811]">100% Solid Teak Guarantee</h3>
              <p className="text-xs sm:text-sm text-[#735A47] leading-relaxed">
                We inspect every timber log for moisture content, grain density, and strength before cutting begins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EBDCC8] shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-[#F4E9D8] text-[#9E5A1C] w-fit">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#291811]">Hand-Chiseled Joints</h3>
              <p className="text-xs sm:text-sm text-[#735A47] leading-relaxed">
                Interlocking mortise & tenon joints reinforce every corner, ensuring structural strength that resists sagging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EBDCC8] shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-[#F4E9D8] text-[#9E5A1C] w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#291811]">Generational Longevity</h3>
              <p className="text-xs sm:text-sm text-[#735A47] leading-relaxed">
                Solid wood furniture that gracefully ages with time, becoming cherished heirlooms for your children and grandchildren.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Bespoke Process */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 rounded-3xl overflow-hidden shadow-xl border border-[#EBDCC8] h-80 lg:h-96">
            <img
              src={doorImg}
              alt="Hand Carved Wooden Door"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E5A1C]">Custom Woodwork</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#291811]">
              Custom Made to Your Exact Living Space
            </h2>
            <p className="text-xs sm:text-sm text-[#735A47] leading-relaxed">
              Every home is unique. Whether you require a Pooja room door with sacred deity carvings, a modular solid-teak wardrobe, or an 8-seater dining table sized for your family hall, we craft strictly to your bespoke measurements.
            </p>
            <p className="text-xs sm:text-sm text-[#735A47] leading-relaxed">
              Visit our workshop or call us to discuss wood grains, polish stains (Natural Honey, Rich Walnut, Dark Mahogany, or Antique Teak), and brass embellishments.
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default About;