"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-6 text-gray-900 font-sans overflow-x-hidden">
      {/* Enhanced Header with Animation */}
      <header className={`max-w-6xl w-full flex justify-between items-center py-8 backdrop-blur-sm z-50 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700 tracking-tight animate-pulse">
          StayGrow.id
        </h1>
        <nav className="hidden md:flex space-x-8 text-base font-medium text-gray-700">
          {['Fitur', 'Cara Kerja', 'Kontak'].map((item, index) => (
            <a
              key={item}
              href={`#${item === 'Fitur' ? 'features' : item === 'Cara Kerja' ? 'how-it-works' : 'contact'}`}
              className={`hover:text-emerald-600 transition-all duration-500 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-emerald-600 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 transform ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2.5 rounded-full font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isLoaded ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-75'}`}
            style={{ transitionDelay: '800ms' }}
          >
            Masuk
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6 transform rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 transform rotate-0 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Mobile menu with slide animation */}
        <div className={`absolute top-20 right-0 bg-white shadow-lg rounded-lg w-48 p-4 md:hidden transition-all duration-300 transform ${menuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}`}>
          <nav className="flex flex-col space-y-4">
            {['Fitur', 'Cara Kerja', 'Kontak'].map((item, index) => (
              <a
                key={item}
                href={`#${item === 'Fitur' ? 'features' : item === 'Cara Kerja' ? 'how-it-works' : 'contact'}`}
                className={`text-gray-700 hover:text-emerald-600 transition-all duration-300 transform ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                style={{ transitionDelay: menuOpen ? `${index * 100}ms` : '0ms' }}
              >
                {item}
              </a>
            ))}
            <a
              href="/login"
              className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2.5 rounded-full font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
              style={{ transitionDelay: menuOpen ? '300ms' : '0ms' }}
            >
              Masuk
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section with Staggered Animations */}
      <section className="flex flex-col-reverse lg:flex-row items-center max-w-7xl w-full gap-16 mt-16">
        <div className={`flex-1 space-y-8 transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 inline-block transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                Inovasi AI
              </span>
              <br />
              <span className={`text-gray-800 inline-block transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '800ms' }}>untuk Mewujudkan</span>
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 inline-block transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
                Kemajuan Berkelanjutan
              </span>
            </h2>
            <p className={`text-xl lg:text-2xl text-gray-600 leading-relaxed font-light max-w-2xl transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
              StayGrow.id membantu generasi muda menemukan jalur karier,
              peluang, dan mentorship berbasis AI untuk berkontribusi pada
              pembangunan berkelanjutan di Indonesia.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1400ms' }}>
            <a
              href="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              Mulai Sekarang
              <svg
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        <div className={`flex-1 relative transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-90'}`} style={{ transitionDelay: '800ms' }}>
          <div className="relative bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="w-full h-80 bg-gradient-to-r from-emerald-200 to-green-200 flex items-center justify-center text-emerald-700 font-bold text-xl">
                <Image
                  src="/ilustrasi_ai_karir2.png"
                  alt="Ilustrasi AI dan Karier"
                  width={600}
                  height={500}
                  priority
                  className="rounded-2xl"
                />
              </div>
            </div>
            {/* Floating elements with animation */}
            <div className={`absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`} style={{ transitionDelay: '1600ms' }}>
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className={`absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1800ms' }}>
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Intersection Observer Animation */}
      <FeaturesSection />

      {/* Enhanced How It Works Section */}
      <HowItWorksSection />

      {/* Enhanced Footer */}
      <FooterSection />
    </main>
  );
}

function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('features');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="max-w-6xl w-full mt-32">
      <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Fitur{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
            Unggulan
          </span>
        </h3>
        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
          Platform AI terdepan untuk mengembangkan potensi generasi muda
          Indonesia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Navigasi Karier Pintar"
          description="AI merekomendasikan jalur karier yang sesuai dengan minat, bakat, dan tujuan masa depan kamu."
          icon="🧭"
          gradient="from-blue-500 to-emerald-500"
          delay={200}
          isVisible={isVisible}
        />
        <FeatureCard
          title="Peluang Berkualitas"
          description="Temukan kesempatan kerja, program pelatihan, dan pendanaan yang tepat untuk perkembangan karier."
          icon="🚀"
          gradient="from-emerald-500 to-green-500"
          delay={400}
          isVisible={isVisible}
        />
        <FeatureCard
          title="Mentorship Profesional"
          description="Terhubung dengan mentor berpengalaman untuk mendapatkan bimbingan dan wawasan industri."
          icon="🤝"
          gradient="from-green-500 to-teal-500"
          delay={600}
          isVisible={isVisible}
        />
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('how-it-works');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="max-w-5xl w-full mt-32">
      <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Cara Kerja{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
            StayGrow.id
          </span>
        </h3>
        <p className="text-xl text-gray-600 font-light">
          Empat langkah mudah menuju masa depan yang berkelanjutan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <StepCard
          number="01"
          title="Buat Profil AI"
          description="Daftar dan buat profil komprehensif untuk memahami minat, kemampuan, dan tujuan karier kamu."
          delay={200}
          isVisible={isVisible}
        />
        <StepCard
          number="02"
          title="Jelajahi Rekomendasi"
          description="Dapatkan rekomendasi jalur karier dan peluang yang dipersonalisasi berdasarkan profil AI kamu."
          delay={400}
          isVisible={isVisible}
        />
        <StepCard
          number="03"
          title="Mentorship Eksklusif"
          description="Bergabung dengan sesi mentorship untuk mendapatkan bimbingan khusus dari para ahli."
          delay={600}
          isVisible={isVisible}
        />
        <StepCard
          number="04"
          title="Berbagi & Inspirasi"
          description="Bagikan proyek dan inovasi kamu untuk menginspirasi generasi muda lainnya."
          delay={800}
          isVisible={isVisible}
        />
      </div>
    </section>
  );
}

function FooterSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('contact');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="contact"
      className={`max-w-6xl w-full mt-40 py-12 border-t border-emerald-200 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
    >
      <div className="text-center space-y-4">
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-6 animate-pulse">
          StayGrow.id
        </div>
        <p className={`text-lg text-gray-700 font-medium transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          © 2025 StayGrow.id — Membantu Generasi Muda Berkembang Berkelanjutan
        </p>
        <p className={`text-emerald-600 font-semibold text-lg transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          Email: info@staygrow.id
        </p>
        <div className={`flex justify-center space-x-6 mt-8 transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          {[0, 1, 2].map((index) => (
            <a
              key={index}
              href="#"
              className={`text-gray-600 hover:text-emerald-600 transition-all duration-300 transform hover:scale-110 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
              style={{ transitionDelay: `${800 + index * 100}ms` }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  gradient,
  delay,
  isVisible,
}: {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <div 
      className={`group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-white/50 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${gradient} mb-6 text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
      >
        {icon}
      </div>
      <h4 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">{title}</h4>
      <p className="text-gray-600 leading-relaxed text-lg font-light">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  delay,
  isVisible,
}: {
  number: string;
  title: string;
  description: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <div 
      className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-700 border border-white/50 transform hover:-translate-y-1 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <div className="pt-4">
        <h4 className="text-xl font-bold mb-3 text-gray-900 hover:text-emerald-600 transition-colors duration-300">{title}</h4>
        <p className="text-gray-600 leading-relaxed font-light">
          {description}
        </p>
      </div>
    </div>
  );
}