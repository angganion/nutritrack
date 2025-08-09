import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, Users, MapPin, BarChart3, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/garuda.png" alt="Logo Garuda" className="h-8 w-auto" />
                              <span className="text-xl font-bold text-gray-900">PANTAU+</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fitur</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">Tentang</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Kontak</a>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  <Shield className="mr-2 h-4 w-4" />
                  Sistem Pemantauan Terpercaya
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Pemantauan
                  <span className="block text-blue-600">Stunting</span>
                  <span className="block">yang Cerdas</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Platform digital untuk memantau tumbuh kembang anak dengan teknologi canggih. 
                  Dapatkan insight yang akurat untuk pencegahan stunting sejak dini.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 hover:scale-105"
                >
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                      <p className="text-blue-100">Data real-time</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <div className="text-sm text-blue-100">Total Anak</div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">89%</div>
                      <div className="text-sm text-blue-100">Tidak Stunting</div>
                    </div>
                  </div>
                  
                  <div className="h-32 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-green-500 shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 h-6 w-6 rounded-full bg-yellow-500 shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Platform kami menyediakan berbagai fitur canggih untuk memantau dan menganalisis 
              data tumbuh kembang anak dengan akurat dan real-time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Manajemen Data Anak</h3>
              <p className="text-gray-600">
                Kelola data anak dengan mudah, termasuk informasi pertumbuhan, 
                riwayat kesehatan, dan status gizi secara terpusat.
              </p>
            </div>
            
            <div className="group relative rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analisis Tren</h3>
              <p className="text-gray-600">
                Pantau tren pertumbuhan dan perkembangan anak dengan grafik 
                interaktif dan analisis statistik yang mendalam.
              </p>
            </div>
            
            <div className="group relative rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 p-8 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Persebaran Geografis</h3>
              <p className="text-gray-600">
                Visualisasi data persebaran stunting berdasarkan lokasi 
                dengan peta interaktif dan analisis regional.
              </p>
            </div>
            
            <div className="group relative rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-8 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Statistik Real-time</h3>
              <p className="text-gray-600">
                Dashboard dengan statistik real-time yang menampilkan 
                data terkini dan perbandingan dengan periode sebelumnya.
              </p>
            </div>
            
            <div className="group relative rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-8 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Laporan Otomatis</h3>
              <p className="text-gray-600">
                Generate laporan otomatis dengan format yang dapat disesuaikan 
                untuk kebutuhan monitoring dan evaluasi program.
              </p>
            </div>
            
            <div className="group relative rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-8 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-600 text-white">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Keamanan Data</h3>
              <p className="text-gray-600">
                Sistem keamanan tingkat tinggi untuk melindungi data sensitif 
                dengan enkripsi end-to-end dan backup otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Siap untuk Memulai?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                              Bergabunglah dengan ribuan pengguna yang telah mempercayai PANTAU+ 
              untuk pemantauan tumbuh kembang anak yang lebih baik.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105"
            >
              Mulai Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/garuda.png" alt="Logo Garuda" className="h-6 w-auto" />
                <span className="text-lg font-bold">PANTAU+</span>
              </div>
              <p className="text-gray-400">
                Platform digital untuk pemantauan tumbuh kembang anak 
                dengan teknologi canggih dan akurat.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Produk</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Dukungan</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Bantuan</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Perusahaan</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tentang</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Karir</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2024 PANTAU+. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
