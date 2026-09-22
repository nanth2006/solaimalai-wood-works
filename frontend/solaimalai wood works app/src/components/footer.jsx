import { Phone, MapPin, Clock, ShieldCheck, Hammer, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Footer() {
  const phoneNumbers = ["7094297761", "9976193689", "9487720761"];

  return (
    <footer className="bg-[#140b07] text-[#D4C3AC] border-t border-[#C9873F]/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#301c11]">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Solaimalai Wood Works"
                className="w-10 h-10 object-cover rounded-xl border border-[#C9873F]/40"
              />
              <div>
                <span className="font-serif text-lg font-bold text-[#F3E9D8]">Solaimalai</span>
                <span className="font-serif text-lg text-[#C9873F] ml-1">Wood Works</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#A68F7A] leading-relaxed">
              Crafting generational heirloom solid wood furniture, bespoke entrance doors, and luxury home interiors for over 20 years.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F0A35C] bg-[#24140b] py-2 px-3 rounded-xl border border-[#C9873F]/20 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Solid Teak Guarantee</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-serif text-base font-bold text-[#F3E9D8] tracking-wide mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9873F]" />
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/home" className="hover:text-[#F0A35C] transition">Home</Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-[#F0A35C] transition">Handcrafted Products</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F0A35C] transition">Our Story & Heritage</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F0A35C] transition">Contact & Workshop</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#F0A35C] transition">My Cart</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Workshop Expertise */}
          <div>
            <h3 className="font-serif text-base font-bold text-[#F3E9D8] tracking-wide mb-4 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-[#C9873F]" />
              Our Specializations
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A68F7A]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9873F]" />
                Traditional Teakwood Carved Doors
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9873F]" />
                Solid Wood Sofas & Living Sets
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9873F]" />
                Handcrafted Dining Tables & Chairs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9873F]" />
                Teak Bero & Custom Wardrobes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9873F]" />
                Full Home Interior Wood Joinery
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Phone */}
          <div>
            <h3 className="font-serif text-base font-bold text-[#F3E9D8] tracking-wide mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9873F]" />
              Direct Workshop Line
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                {phoneNumbers.map((num) => (
                  <a
                    key={num}
                    href={`tel:${num}`}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F0A35C] hover:text-[#FFC480] bg-[#24140b] hover:bg-[#331c10] px-3 py-1.5 rounded-lg border border-[#C9873F]/20 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    +91 {num}
                  </a>
                ))}
              </div>

              <div className="pt-2 text-xs text-[#A68F7A] space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9873F]" />
                  Mon – Sat: 9:00 AM – 8:00 PM
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9873F]" />
                  Workshop: Tamil Nadu, India
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#876F5E]">
          <p>© {new Date().getFullYear()} Solaimalai Wood Works. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Master Timber Craftsmanship
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;