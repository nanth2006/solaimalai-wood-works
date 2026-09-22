import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import sc from "../assets/door.jpeg";
import dc from "../assets/chair.jpeg";
import header from "../assets/header.jpg";
import design from "../assets/design.jpeg";
import { ShieldCheck, Hammer, Sparkles, Clock, ArrowRight, Award, TreePine, ChevronRight } from "lucide-react";

const features = [
  {
    title: "100% Solid Teak",
    desc: "Zero plywood, engineered for generations",
    icon: ShieldCheck,
  },
  {
    title: "Artisanal Joinery",
    desc: "Mortise & tenon hand-crafted joints",
    icon: Hammer,
  },
  {
    title: "Custom Sizing",
    desc: "Bespoke furniture tailored to your space",
    icon: Sparkles,
  },
  {
    title: "20+ Years Heritage",
    desc: "Three generations of master carpenters",
    icon: Clock,
  },
];

const categories = [
  {
    name: "Living & Dining Furniture",
    count: "40+ Custom Designs",
    desc: "Chairs, solid teak dining tables, luxury sofas",
    img: dc,
    link: "/product",
  },
  {
    name: "Handcrafted Teak Doors",
    count: "25+ Carved Models",
    desc: "Traditional Pooja doors, main entrance doors",
    img: sc,
    link: "/product",
  },
  {
    name: "Interior Woodwork & Bero",
    count: "30+ Project Styles",
    desc: "Teakwood wardrobes, modular kitchens, wall panels",
    img: design,
    link: "/product",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      {/* UNIFIED LUXURY NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#160D08] text-[#F3E9D8] py-16 sm:py-24 lg:py-28">
        {/* Background Texture with Dark Overlay */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=2000&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#140B07] via-[#140B07]/90 to-transparent" />

        {/* Ambient Warm Highlights */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#C9873F]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9873F]/20 border border-[#C9873F]/40 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Premier Tamil Nadu Woodcraft Heritage</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#F3E9D8]">
                Bespoke Handcrafted <br />
                <span className="wood-text-gradient">Solid Teakwood</span> Living
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-[#D4C3AC] leading-relaxed">
                Experience timeless luxury crafted with authentic solid wood. From intricately carved entrance doors to custom sofas and wardrobes — built to last for generations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate("/product")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-[#1C130D] bg-gradient-to-r from-[#F0A35C] via-[#C9873F] to-[#E0A05A] hover:brightness-110 shadow-lg shadow-[#C9873F]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-[#F3E9D8] border border-[#C9873F]/50 bg-[#2b170d]/60 hover:bg-[#C9873F]/20 transition-all duration-200"
                >
                  <span>Custom Order Enquiry</span>
                </button>
              </div>

              {/* Mini Highlights */}
              <div className="pt-4 flex items-center gap-8 border-t border-[#3e2415] text-xs text-[#A68F7A]">
                <div>
                  <p className="text-xl font-bold font-serif text-[#F3E9D8]">20+</p>
                  <p>Years Experience</p>
                </div>
                <div className="w-px h-8 bg-[#3e2415]" />
                <div>
                  <p className="text-xl font-bold font-serif text-[#F3E9D8]">100%</p>
                  <p>Pure Solid Wood</p>
                </div>
                <div className="w-px h-8 bg-[#3e2415]" />
                <div>
                  <p className="text-xl font-bold font-serif text-[#F3E9D8]">1000+</p>
                  <p>Happy Homes</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Image */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl p-2 bg-gradient-to-tr from-[#3a2012] via-[#703b15] to-[#C9873F] shadow-2xl shadow-black/60">
                <div className="overflow-hidden rounded-2xl bg-[#1C130D] relative">
                  <img
                    src={header}
                    alt="Solaimalai Wood Works Master Craftsmanship"
                    className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    <p className="text-xs uppercase tracking-wider text-[#F0A35C] font-semibold">Masterpiece of the Week</p>
                    <p className="text-sm font-serif font-bold text-[#F3E9D8]">Royal Teak Hand-Carved Living Suite</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="bg-[#FAF3E7] border-b border-[#E8DAC2] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-[#E8DAC2] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-[#F4E9D8] text-[#9E5A1C] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#291811]">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#735A47] mt-1 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9873F]/15 text-[#9E5A1C] text-xs font-semibold uppercase tracking-wider mb-2">
            <TreePine className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#291811] tracking-tight">
            Popular Product Categories
          </h2>
          <p className="text-sm sm:text-base text-[#735A47] mt-2">
            Every piece is built to order using matured first-grade teak and seasoned hardwoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((c, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8DAC2] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-[#1C130D]/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#F0A35C] border border-[#C9873F]/30">
                  {c.count}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#291811] group-hover:text-[#9E5A1C] transition duration-200">
                    {c.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#735A47] mt-1.5 leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#F0E6D8] flex items-center justify-between">
                  <Link
                    to={c.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E5A1C] hover:text-[#C9873F] transition"
                  >
                    <span>View Designs</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-[#24130A] via-[#3A1F11] to-[#24130A] text-[#F3E9D8] py-16 px-4 my-8 mx-4 sm:mx-8 rounded-3xl border border-[#C9873F]/30 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3E9D8]">
            Need Custom Woodwork for Your New Home?
          </h2>
          <p className="text-sm sm:text-base text-[#D4C3AC]">
            Talk directly to our master craftsmen. We take custom dimensions, wood choices, and custom carving requests for living rooms, kitchens, and doors.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full font-semibold text-sm text-[#1C130D] bg-gradient-to-r from-[#F0A35C] to-[#C9873F] hover:brightness-110 shadow-lg transition"
            >
              Request a Free Quote
            </Link>
            <a
              href="tel:7094297761"
              className="px-8 py-3.5 rounded-full font-semibold text-sm text-[#F3E9D8] border border-[#C9873F]/50 bg-black/40 hover:bg-[#C9873F]/20 transition"
            >
              Call: +91 7094297761
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;