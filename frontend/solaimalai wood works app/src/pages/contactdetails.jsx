import { useState } from "react";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";

function Contact() {
  const phoneNumbers = [
    { number: "7094297761", label: "Master Carpenter / Workshop In-charge" },
    { number: "9976193689", label: "Custom Furniture & Measurement Quotes" },
    { number: "9487720761", label: "Door Carvings & Interior Woodwork" },
  ];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Custom Solid Teak Furniture",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: "", phone: "", email: "", service: "Custom Solid Teak Furniture", message: "" });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#291811] flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-[#1C130D] text-[#F3E9D8] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#C9873F]/30 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9873F]/20 text-[#F0A35C] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E9D8]">
            Contact Our Workshop
          </h1>
          <p className="text-xs sm:text-sm text-[#D4C3AC]">
            Speak directly with our craftsmen for home visits, timber selection, or custom order quotations.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info & Phone Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#291811]">
                Direct Workshop Contacts
              </h2>
              <p className="text-xs sm:text-sm text-[#735A47] mt-1">
                Call any of our workshop lines for immediate assistance.
              </p>
            </div>

            {/* Phone Number Cards */}
            <div className="space-y-3">
              {phoneNumbers.map((p, i) => (
                <a
                  key={i}
                  href={`tel:${p.number}`}
                  className="group bg-white p-4 rounded-2xl border border-[#EBDCC8] shadow-sm hover:shadow-md hover:border-[#C9873F] transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-[#F4ECE1] text-[#9E5A1C] group-hover:bg-[#C9873F] group-hover:text-white transition">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1C130D] group-hover:text-[#9E5A1C] transition">
                        +91 {p.number}
                      </p>
                      <p className="text-[11px] text-[#826754]">{p.label}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#9E5A1C] bg-[#FAF3E7] px-2.5 py-1 rounded-lg">
                    Call
                  </span>
                </a>
              ))}
            </div>

            {/* Workshop Address & Hours Card */}
            <div className="bg-[#FAF3E7] p-6 rounded-3xl border border-[#EBDCC8] space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white text-[#9E5A1C] shadow-sm shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#291811]">Workshop Location</h3>
                  <p className="text-xs sm:text-sm text-[#735A47] mt-0.5 leading-relaxed">
                    Solaimalai Wood Works Workshop<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#EBDCC8]">
                <div className="p-2.5 rounded-xl bg-white text-[#9E5A1C] shadow-sm shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#291811]">Working Hours</h3>
                  <p className="text-xs sm:text-sm text-[#735A47] mt-0.5">
                    Monday to Saturday: 9:00 AM – 8:00 PM<br />
                    Sunday: By Prior Appointment
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Message & Quote Request Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EBDCC8] shadow-lg space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#291811]">
                  Send an Inquiry / Request a Quote
                </h2>
                <p className="text-xs sm:text-sm text-[#735A47] mt-1">
                  Share your requirements and we will provide an estimate within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center space-y-2 animate-fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-serif text-lg font-bold">Inquiry Sent Successfully!</p>
                  <p className="text-xs sm:text-sm text-emerald-700">
                    Thank you! Our master carpenter will call you shortly on your provided phone number.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nanthakumar"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 7094297761"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                        Required Service / Woodwork
                      </label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white text-[#291811]"
                      >
                        <option value="Custom Solid Teak Furniture">Custom Solid Teak Furniture</option>
                        <option value="Carved Wooden Entrance Door">Carved Wooden Entrance Door</option>
                        <option value="Pooja Room Wood Joinery">Pooja Room Wood Joinery</option>
                        <option value="Living Room Sofa Set">Living Room Sofa Set</option>
                        <option value="Teak Wardrobe & Bero">Teak Wardrobe & Bero</option>
                        <option value="Complete Home Interior Woodwork">Complete Home Interior Woodwork</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6E4F39] mb-1">
                      Project Details & Dimensions (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your furniture requirements, preferred dimensions, or wood stain preferences..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E0D0BC] rounded-xl text-sm outline-none focus:border-[#C9873F] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-[#1C130D] bg-gradient-to-r from-[#F0A35C] via-[#C9873F] to-[#E0A05A] hover:brightness-110 shadow-lg shadow-[#C9873F]/25 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;