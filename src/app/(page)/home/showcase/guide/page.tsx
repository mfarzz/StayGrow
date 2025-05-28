"use client";

import { useState } from "react";
import {
  CheckCircle,
  Star,
  Lightbulb,
  Target,
  Users,
  Zap,
  Award,
  ArrowRight,
  Camera,
  Code,
  Globe,
  Heart,
  Eye,
  BookmarkPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function ShowcaseGuidePage() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const sections: GuideSection[] = [
    {
      id: "overview",
      title: "Pengantar Showcase",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Apa itu Showcase StayGrow?
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Showcase StayGrow adalah platform untuk memamerkan proyek-proyek
              inovatif yang berdampak positif bagi masyarakat dan lingkungan. Di
              sini, Anda dapat menginspirasi orang lain dengan karya Anda dan
              menemukan kolaborator untuk proyek berkelanjutan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">Inspirasi</h3>
              <p className="text-gray-600">
                Berbagi ide kreatif dan solusi inovatif untuk masalah nyata
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">Kolaborasi</h3>
              <p className="text-gray-600">
                Temukan partner dan tim untuk mengembangkan proyek bersama
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">Pengakuan</h3>
              <p className="text-gray-600">
                Dapatkan apresiasi dan feedback dari komunitas global
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "create",
      title: "Membuat Proyek Showcase",
      content: (
        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <Target size={24} />
              Langkah-langkah Membuat Showcase
            </h3>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Persiapkan Konten",
                  description:
                    "Kumpulkan gambar, deskripsi, dan dokumentasi proyek Anda",
                },
                {
                  step: 2,
                  title: "Tulis Deskripsi yang Menarik",
                  description:
                    "Jelaskan masalah yang dipecahkan dan solusi yang Anda tawarkan",
                },
                {
                  step: 3,
                  title: "Pilih Tags yang Relevan",
                  description:
                    "Tambahkan SDG Tags dan Tech Tags untuk kategorisasi yang tepat",
                },
                {
                  step: 4,
                  title: "Upload dan Publikasikan",
                  description:
                    "Submit proyek Anda dan tunggu review dari tim StayGrow",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">
                      {item.title}
                    </h4>
                    <p className="text-green-700 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-black">
                <Camera className="text-emerald-600" size={20} />
                Tips Foto & Visual
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Gunakan gambar dengan resolusi minimal 800x600px
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Tampilkan hasil akhir proyek dengan jelas
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Sertakan dokumentasi proses pembuatan
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Hindari watermark atau logo pihak ketiga
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-black">
                <Code className="text-green-600" size={20} />
                Tips Konten Teknis
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Jelaskan teknologi yang digunakan
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Sertakan link GitHub atau demo
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Dokumentasikan tantangan dan solusi
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  Jelaskan dampak dan manfaat proyek
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "optimize",
      title: "Optimasi Showcase",
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap size={24} />
              Cara Mendapat Lebih Banyak Engagement
            </h3>
            <p className="text-emerald-100">
              Tingkatkan visibilitas dan dampak proyek Anda dengan strategi
              optimasi yang tepat
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-bold flex items-center gap-2 text-black">
                <Star className="text-yellow-500" size={20} />
                Strategi Featured Project
              </h4>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-800 mb-2">
                  Kriteria Featured:
                </h5>
                <ul className="space-y-2 text-yellow-700 text-sm">
                  <li>• Inovasi dan originalitas tinggi</li>
                  <li>• Dampak sosial/lingkungan yang jelas</li>
                  <li>• Dokumentasi lengkap dan berkualitas</li>
                  <li>• Engagement tinggi dari komunitas</li>
                  <li>• Implementasi teknologi yang menarik</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-black">
                <h5 className="font-semibold mb-3">
                  Tips Meningkatkan Engagement:
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart size={16} className="text-red-500" />
                    <span className="text-sm">
                      Respons komentar dengan cepat dan ramah
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye size={16} className="text-blue-500" />
                    <span className="text-sm">
                      Update progress proyek secara berkala
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookmarkPlus size={16} className="text-green-500" />
                    <span className="text-sm">
                      Bagikan tips dan pembelajaran di proyek
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-bold flex items-center gap-2 text-black">
                <Globe className="text-blue-500" size={20} />
                SEO & Visibility
              </h4>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-3">
                  Keyword Optimization:
                </h5>
                <ul className="space-y-2 text-blue-700 text-sm">
                  <li>• Gunakan kata kunci populer di judul</li>
                  <li>• Pilih SDG tags yang sesuai</li>
                  <li>• Tambahkan tech tags yang trending</li>
                  <li>• Tulis deskripsi yang informatif</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-black">
                <h5 className="font-semibold mb-3">AI Match Score:</h5>
                <p className="text-gray-600 text-sm mb-3">
                  Algoritma AI kami mencocokkan proyek dengan minat pengguna
                  berdasarkan:
                </p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Relevansi teknologi</li>
                  <li>• Kesesuaian SDG goals</li>
                  <li>• Tingkat inovasi</li>
                  <li>• Engagement history</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "guidelines",
      title: "Pedoman & Aturan",
      content: (
        <div className="space-y-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-900 mb-4">
              Aturan Komunitas
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-800 mb-3">
                  ✅ Yang Diperbolehkan:
                </h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Proyek original dan autentik</li>
                  <li>• Konten edukatif dan inspiratif</li>
                  <li>• Kolaborasi dan diskusi konstruktif</li>
                  <li>• Feedback yang membangun</li>
                  <li>• Sharing knowledge dan tips</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-3">
                  ❌ Yang Tidak Diperbolehkan:
                </h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Plagiarisme atau konten curian</li>
                  <li>• Spam atau promotional berlebihan</li>
                  <li>• Konten tidak pantas atau menyinggung</li>
                  <li>• Proyek yang merugikan lingkungan</li>
                  <li>• Informasi palsu atau menyesatkan</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 text-black">
                Standar Kualitas
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Dokumentasi Minimal:
                  </h5>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Deskripsi proyek minimal 100 kata</li>
                    <li>• Minimal 1 gambar berkualitas tinggi</li>
                    <li>• 2-5 SDG tags yang relevan</li>
                    <li>• 3-8 tech tags yang sesuai</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Konten Berkualitas:
                  </h5>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Penjelasan masalah dan solusi</li>
                    <li>• Metodologi atau pendekatan</li>
                    <li>• Hasil dan dampak yang dicapai</li>
                    <li>• Pembelajaran dan insight</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 text-black">
                Proses Review
              </h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-black">Submit Proyek</h5>
                    <p className="text-gray-600 text-sm">
                      Proyek masuk antrian review otomatis
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-black">
                      Review Tim (1-3 hari)
                    </h5>
                    <p className="text-gray-600 text-sm">
                      Tim meninjau kualitas dan kesesuaian
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-black">Publikasi</h5>
                    <p className="text-gray-600 text-sm">
                      Proyek tampil di showcase publik
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const faqs = [
    {
      id: "submit-time",
      question: "Berapa lama waktu yang dibutuhkan untuk review proyek?",
      answer:
        "Biasanya 1-3 hari kerja. Proyek dengan dokumentasi lengkap akan diproses lebih cepat.",
    },
    {
      id: "edit-project",
      question: "Bisakah saya mengedit proyek setelah dipublikasi?",
      answer:
        "Ya, Anda bisa mengedit proyek kapan saja melalui halaman profil. Perubahan besar mungkin perlu review ulang.",
    },
    {
      id: "featured-criteria",
      question: "Bagaimana cara mendapat status Featured Project?",
      answer:
        "Featured project dipilih berdasarkan inovasi, dampak, kualitas dokumentasi, dan engagement dari komunitas.",
    },
    {
      id: "collaboration",
      question: "Bagaimana cara mencari kolaborator untuk proyek?",
      answer:
        "Gunakan fitur komentar dan kontak author di setiap proyek. Anda juga bisa join Discord komunitas StayGrow.",
    },
    {
      id: "copyright",
      question: "Bagaimana dengan hak cipta proyek yang saya submit?",
      answer:
        "Anda tetap memiliki hak cipta penuh. StayGrow hanya memiliki hak untuk menampilkan proyek di platform.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          📖 Panduan Showcase StayGrow
        </h1>
        <p className="text-emerald-100 text-lg lg:text-xl">
          Panduan lengkap untuk membuat, mengoptimasi, dan mengelola proyek
          showcase yang menginspirasi
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4">Daftar Isi</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-emerald-100 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {section.title}
                </button>
              ))}
              <button
                onClick={() => setActiveSection("faq")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === "faq"
                    ? "bg-emerald-100 text-emerald-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                FAQ
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
            {activeSection === "faq" ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() =>
                          setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                        }
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900">
                          {faq.question}
                        </h3>
                        {expandedFAQ === faq.id ? (
                          <ChevronUp
                            size={20}
                            className="text-gray-500 flex-shrink-0"
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                            className="text-gray-500 flex-shrink-0"
                          />
                        )}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>{sections.find((s) => s.id === activeSection)?.content}</div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 lg:p-8 text-white text-center">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
          Siap Membuat Showcase Pertama Anda? 🚀
        </h2>
        <p className="text-green-100 text-lg mb-6">
          Bergabunglah dengan ribuan inovator muda Indonesia dan mulai berkarya
          untuk masa depan yang berkelanjutan
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => (window.location.href = "/home/showcase")}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
          >
            Lihat Showcase
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => (window.location.href = "/home/profile")}
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
          >
            Kelola Proyek Saya
          </button>
        </div>
      </div>
    </div>
  );
}
