import 'server-only';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface RecommendationRequest {
  stunting: boolean;
  age: number;
  gender: string;
  birthWeight: number;
  birthLength: number;
  bodyWeight: number;
  bodyLength: number;
  breastFeeding: boolean;
  location?: {
    province?: string;
    city?: string;
    district?: string;
  };
}

export interface RecommendationResponse {
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  summary: string;
}

export interface PolicyRecommendationRequest {
  totalChildren: number;
  totalStunting: number;
  stuntingRate: number;
  location: {
    level: 'country' | 'province' | 'city' | 'district';
    name: string;
    province?: string;
    city?: string;
    district?: string;
  };
  groupedData?: any[]; // Data terkelompok (provinces, cities, districts)
}

export interface PolicyRecommendationResponse {
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  summary: string;
  actionPlan: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  stakeholders: string[];
  budgetEstimate?: string;
}

export async function getStuntingRecommendations(data: RecommendationRequest): Promise<RecommendationResponse> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Sebagai ahli gizi dan kesehatan anak, berikan rekomendasi tindakan yang spesifik untuk menangani kasus stunting berikut:

**Data Anak:**
- Usia: ${data.age} bulan
- Jenis Kelamin: ${data.gender}
- Berat Lahir: ${data.birthWeight} kg
- Panjang Lahir: ${data.birthLength} cm
- Berat Badan Saat Ini: ${data.bodyWeight} kg
- Panjang Badan Saat Ini: ${data.bodyLength} cm
- Status ASI: ${data.breastFeeding ? 'Ya' : 'Tidak'}
- Status Stunting: ${data.stunting ? 'Ya' : 'Tidak'}
${data.location ? `- Lokasi: ${data.location.province || ''} ${data.location.city || ''} ${data.location.district || ''}` : ''}

**Tugas:**
1. Berikan 5-7 rekomendasi tindakan yang spesifik dan actionable
2. Tentukan prioritas (high/medium/low) berdasarkan urgensi
3. Berikan ringkasan singkat situasi dan strategi penanganan
4. Fokus pada intervensi gizi, pola asuh, dan akses layanan kesehatan
5. Sesuaikan rekomendasi dengan usia dan kondisi spesifik anak

**Format Response (JSON):**
{
  "recommendations": [
    "Rekomendasi 1",
    "Rekomendasi 2",
    "Rekomendasi 3",
    "Rekomendasi 4",
    "Rekomendasi 5"
  ],
  "priority": "high|medium|low",
  "summary": "Ringkasan singkat situasi dan strategi penanganan"
}

Pastikan response dalam format JSON yang valid dan dalam bahasa Indonesia.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    return {
      recommendations: parsedResponse.recommendations || [],
      priority: parsedResponse.priority || 'medium',
      summary: parsedResponse.summary || ''
    };

  } catch (error) {
    console.error('Error getting recommendations from Gemini:', error);
    
    // Fallback recommendations if Gemini fails
    return getFallbackRecommendations(data);
  }
}

function getFallbackRecommendations(data: RecommendationRequest): RecommendationResponse {
  const recommendations = [];

  if (data.stunting) {
    recommendations.push(
      "Konsultasikan segera dengan dokter anak atau ahli gizi untuk penanganan stunting",
      "Pastikan asupan protein yang cukup (daging, ikan, telur, kacang-kacangan)",
      "Berikan makanan yang kaya zat besi dan zinc",
      "Terapkan pola makan gizi seimbang sesuai usia"
    );
  }

  if (!data.breastFeeding && data.age <= 24) {
    recommendations.push(
      "Pertimbangkan untuk memberikan ASI eksklusif sampai usia 6 bulan",
      "Konsultasikan dengan konselor laktasi untuk bantuan menyusui"
    );
  }

  recommendations.push(
    "Lakukan pemeriksaan pertumbuhan secara rutin setiap bulan",
    "Pastikan imunisasi lengkap sesuai usia",
    "Terapkan pola hidup bersih dan sehat"
  );

  return {
    recommendations,
    priority: data.stunting ? 'high' : 'medium',
    summary: data.stunting 
      ? 'Anak mengalami stunting dan memerlukan intervensi gizi segera'
      : 'Anak dalam kondisi normal, tetap pantau pertumbuhan secara rutin'
  };
}

export async function getPolicyRecommendations(data: PolicyRecommendationRequest): Promise<PolicyRecommendationResponse> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Sebagai ahli kebijakan kesehatan dan gizi masyarakat, berikan rekomendasi strategis untuk pemerintah/pemangku kebijakan dalam menangani masalah stunting di wilayah berikut:

**Data Wilayah:**
- Tingkat: ${data.location.level === 'country' ? 'Nasional' : data.location.level === 'province' ? 'Provinsi' : data.location.level === 'city' ? 'Kota/Kabupaten' : 'Kecamatan'}
- Nama: ${data.location.name}
${data.location.province ? `- Provinsi: ${data.location.province}` : ''}
${data.location.city ? `- Kota/Kabupaten: ${data.location.city}` : ''}
${data.location.district ? `- Kecamatan: ${data.location.district}` : ''}

**Statistik Stunting:**
- Total Anak: ${data.totalChildren} anak
- Total Stunting: ${data.totalStunting} anak
- Tingkat Stunting: ${data.stuntingRate}%

${data.groupedData ? `**Data Terkelompok:** ${JSON.stringify(data.groupedData.slice(0, 5))}` : ''}

**Tugas:**
1. Berikan 5-7 rekomendasi kebijakan yang SANGAT SPESIFIK dan actionable untuk pemerintah
2. Tentukan prioritas (high/medium/low) berdasarkan urgensi dan dampak
3. Buat rencana aksi jangka pendek (1-6 bulan), menengah (6-18 bulan), dan panjang (18+ bulan)
4. Identifikasi stakeholder kunci yang terlibat BESERTA PERAN SPESIFIK mereka
5. Berikan estimasi anggaran yang realistis berdasarkan data historis program serupa
6. Fokus pada intervensi sistemik, program pemerintah, dan koordinasi lintas sektor

**PENTING:**
- Rekomendasi harus SPESIFIK dengan target yang jelas, bukan general
- Estimasi budget harus berdasarkan data historis program pencegahan stunting di Indonesia
- Stakeholder harus disertai peran dan tanggung jawab spesifik mereka
- Semua output dalam bahasa Indonesia

**Format Response (JSON):**
{
  "recommendations": [
    "Rekomendasi kebijakan spesifik dengan target yang jelas",
    "Rekomendasi kebijakan spesifik dengan target yang jelas",
    "Rekomendasi kebijakan spesifik dengan target yang jelas",
    "Rekomendasi kebijakan spesifik dengan target yang jelas",
    "Rekomendasi kebijakan spesifik dengan target yang jelas"
  ],
  "priority": "high|medium|low",
  "summary": "Ringkasan situasi dan strategi penanganan sistemik dalam bahasa Indonesia",
  "actionPlan": {
    "shortTerm": ["Aksi jangka pendek spesifik dengan timeline", "Aksi jangka pendek spesifik dengan timeline"],
    "mediumTerm": ["Aksi jangka menengah spesifik dengan target", "Aksi jangka menengah spesifik dengan target"],
    "longTerm": ["Aksi jangka panjang spesifik dengan outcome", "Aksi jangka panjang spesifik dengan outcome"]
  },
  "stakeholders": [
    "Nama Instansi - Peran dan Tanggung Jawab Spesifik",
    "Nama Instansi - Peran dan Tanggung Jawab Spesifik"
  ],
  "budgetEstimate": "Estimasi anggaran yang realistis berdasarkan data historis program pencegahan stunting di Indonesia (dalam Rupiah)"
}

Pastikan response dalam format JSON yang valid dan SEMUA dalam bahasa Indonesia.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    return {
      recommendations: parsedResponse.recommendations || [],
      priority: parsedResponse.priority || 'medium',
      summary: parsedResponse.summary || '',
      actionPlan: parsedResponse.actionPlan || {
        shortTerm: [],
        mediumTerm: [],
        longTerm: []
      },
      stakeholders: parsedResponse.stakeholders || [],
      budgetEstimate: parsedResponse.budgetEstimate
    };

  } catch (error) {
    console.error('Error getting policy recommendations from Gemini:', error);
    
    // Fallback recommendations if Gemini fails
    return getFallbackPolicyRecommendations(data);
  }
}

function getFallbackPolicyRecommendations(data: PolicyRecommendationRequest): PolicyRecommendationResponse {
  const recommendations = [];
  const stuntingRate = typeof data.stuntingRate === 'string' ? parseFloat(data.stuntingRate) : data.stuntingRate;
  const priority = stuntingRate > 30 ? 'high' : stuntingRate > 20 ? 'medium' : 'low';

  if (stuntingRate > 30) {
    recommendations.push(
      "Implementasikan program intervensi gizi terpadu dengan target mengurangi stunting 15% dalam 12 bulan",
      "Perkuat program pemberian makanan tambahan (PMT) untuk 100% balita stunting di wilayah prioritas",
      "Tingkatkan cakupan imunisasi dasar lengkap menjadi minimal 95% pada balita usia 0-24 bulan",
      "Lakukan pelatihan intensif untuk 100% kader posyandu dan bidan desa dalam deteksi dini stunting",
      "Bentuk tim satgas pencegahan stunting tingkat kecamatan dengan koordinasi lintas sektor"
    );
  } else if (stuntingRate > 20) {
    recommendations.push(
      "Perkuat program pencegahan stunting melalui revitalisasi 100% posyandu dengan standar pelayanan minimal",
      "Tingkatkan edukasi gizi intensif untuk 80% ibu hamil dan balita melalui kelas ibu hamil dan balita",
      "Perbaiki akses air bersih dan sanitasi dengan target 90% rumah tangga memiliki akses air bersih",
      "Implementasikan program monitoring pertumbuhan bulanan untuk 100% balita usia 0-24 bulan"
    );
  } else {
    recommendations.push(
      "Pertahankan program pencegahan stunting yang sudah ada dengan monitoring ketat",
      "Tingkatkan monitoring dan evaluasi program dengan sistem digital tracking",
      "Perkuat koordinasi lintas sektor melalui forum koordinasi pencegahan stunting",
      "Implementasikan program berkelanjutan untuk menjaga tingkat stunting di bawah 15%"
    );
  }

  // Calculate budget estimate based on stunting rate and population
  const estimatedBudget = calculateBudgetEstimate(data.totalChildren, stuntingRate, data.location.level);

  return {
    recommendations,
    priority,
    summary: `Wilayah ${data.location.name} memiliki tingkat stunting ${stuntingRate}% dengan total ${data.totalStunting} dari ${data.totalChildren} anak yang ${priority === 'high' ? 'memerlukan intervensi segera dan komprehensif' : priority === 'medium' ? 'perlu perhatian khusus dan program terfokus' : 'relatif baik namun tetap memerlukan pemantauan berkelanjutan'}`,
    actionPlan: {
      shortTerm: [
        "Identifikasi dan mapping 100% keluarga berisiko stunting dalam 2 bulan",
        "Perkuat posyandu dengan standar minimal dan pelatihan kader kesehatan dalam 3 bulan",
        "Lakukan screening kesehatan dan gizi untuk semua balita usia 0-24 bulan dalam 1 bulan"
      ],
      mediumTerm: [
        "Implementasi program pemberian makanan tambahan (PMT) untuk balita stunting dalam 6 bulan",
        "Pelatihan komprehensif kader dan tenaga kesehatan dalam deteksi dan penanganan stunting dalam 6 bulan",
        "Penguatan sistem rujukan dan koordinasi antar layanan kesehatan dalam 9 bulan"
      ],
      longTerm: [
        "Penguatan sistem kesehatan masyarakat dengan infrastruktur berkelanjutan dalam 18 bulan",
        "Pembangunan infrastruktur air bersih dan sanitasi dengan target 100% akses dalam 24 bulan",
        "Implementasi sistem monitoring dan evaluasi digital untuk tracking progress dalam 12 bulan"
      ]
    },
    stakeholders: [
      "Dinas Kesehatan - Koordinasi program kesehatan dan pelatihan tenaga kesehatan",
      "Dinas Pendidikan - Edukasi gizi di sekolah dan PAUD, program makan sehat",
      "BKKBN - Program keluarga berencana dan pendampingan keluarga berisiko",
      "Puskesmas - Pelayanan kesehatan primer dan rujukan kasus stunting",
      "Posyandu - Deteksi dini, monitoring pertumbuhan, dan edukasi masyarakat",
      "PKK - Mobilisasi masyarakat dan dukungan program di tingkat desa/kelurahan",
      "Dinas Sosial - Bantuan sosial untuk keluarga miskin dengan anak stunting"
    ],
    budgetEstimate: estimatedBudget
  };
}

function calculateBudgetEstimate(totalChildren: number, stuntingRate: number, level: string): string {
  // Based on historical data from Indonesian stunting prevention programs
  const baseCostPerChild = 250000; // Rp 250,000 per child per year
  const stuntingChildren = Math.round((totalChildren * stuntingRate) / 100);
  
  // Level multiplier for administrative and infrastructure costs
  const levelMultiplier = level === 'country' ? 0.8 : level === 'province' ? 1.0 : level === 'city' ? 1.2 : 1.5;
  
  // Priority multiplier based on stunting rate
  const priorityMultiplier = stuntingRate > 30 ? 1.5 : stuntingRate > 20 ? 1.2 : 1.0;
  
  const estimatedCost = Math.round(stuntingChildren * baseCostPerChild * levelMultiplier * priorityMultiplier);
  
  // Add infrastructure and program costs
  const infrastructureCost = level === 'country' ? 5000000000 : level === 'province' ? 2000000000 : level === 'city' ? 1000000000 : 500000000;
  const totalCost = estimatedCost + infrastructureCost;
  
  return `Estimasi anggaran: Rp ${totalCost.toLocaleString('id-ID')} per tahun. Breakdown: Program intervensi gizi Rp ${estimatedCost.toLocaleString('id-ID')} (Rp ${baseCostPerChild.toLocaleString('id-ID')} per anak stunting), Infrastruktur dan koordinasi Rp ${infrastructureCost.toLocaleString('id-ID')}. Angka ini berdasarkan data historis program pencegahan stunting di Indonesia tahun 2020-2023.`;
}

/**
 * Generate personalized recommendations for an individual child
 */
export async function generateChildRecommendations(childData: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Sebagai ahli gizi dan kesehatan anak, berikan rekomendasi personal untuk anak dengan data berikut:

Data Anak:
- Usia: ${childData.age} bulan
- Jenis Kelamin: ${childData.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
- Berat Badan Saat Ini: ${childData.body_weight} kg
- Tinggi Badan Saat Ini: ${childData.body_length} cm
- Berat Lahir: ${childData.birth_weight} kg
- Panjang Lahir: ${childData.birth_length} cm
- ASI Eksklusif: ${childData.breast_feeding ? 'Ya' : 'Tidak'}
- Status Stunting (Manual): ${childData.stunting ? 'Ya' : 'Tidak'}
- Status Stunting (AI Detection): ${childData.image_is_stunting ? 'Ya' : 'Tidak'}

Berikan rekomendasi dalam format JSON dengan struktur berikut:
{
  "healthStatus": {
    "stuntingRisk": "high/medium/low",
    "nutritionalStatus": "string describing nutritional status",
    "growthAssessment": "string assessing growth pattern"
  },
  "recommendations": {
    "nutrition": ["list of specific nutrition recommendations"],
    "activities": ["list of recommended activities/exercises"],
    "monitoring": ["list of what to monitor regularly"],
    "medical": ["list of medical follow-ups needed"]
  },
  "mealPlan": {
    "breakfast": ["list of breakfast suggestions"],
    "lunch": ["list of lunch suggestions"],
    "dinner": ["list of dinner suggestions"],
    "snacks": ["list of healthy snack options"]
  },
  "parentGuidance": {
    "dosList": ["things parents should do"],
    "dontsList": ["things parents should avoid"],
    "warningSigns": ["signs that require immediate medical attention"]
  },
  "followUp": {
    "nextCheckup": "recommended timeframe for next checkup",
    "milestones": ["developmental milestones to watch for"],
    "resources": ["helpful resources for parents"]
  }
}

Berikan rekomendasi yang:
1. Spesifik dan actionable untuk orang tua
2. Disesuaikan dengan usia dan kondisi anak
3. Praktis dan mudah diimplementasikan
4. Berbasis evidence-based practice
5. Dalam Bahasa Indonesia yang mudah dipahami`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      return recommendations;
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Error generating child recommendations:', error);
    
    // Fallback recommendations
    return generateFallbackChildRecommendations(childData);
  }
}

function generateFallbackChildRecommendations(childData: any) {
  const isStunting = childData.stunting || childData.image_is_stunting;
  const isYoung = childData.age < 24;
  
  return {
    healthStatus: {
      stuntingRisk: isStunting ? 'high' : 'low',
      nutritionalStatus: isStunting 
        ? 'Anak mengalami stunting, perlu perhatian khusus untuk perbaikan gizi'
        : 'Status gizi anak dalam kondisi baik, pertahankan pola asuh yang sehat',
      growthAssessment: `Anak berusia ${childData.age} bulan dengan berat ${childData.body_weight} kg dan tinggi ${childData.body_length} cm`
    },
    recommendations: {
      nutrition: [
        'Berikan makanan kaya protein (telur, ikan, daging, kacang-kacangan)',
        'Pastikan asupan kalsium cukup untuk pertumbuhan tulang',
        'Berikan buah dan sayur beragam setiap hari',
        'Hindari makanan tinggi gula dan rendah nutrisi',
        childData.breast_feeding ? 'Lanjutkan pemberian ASI' : 'Konsultasikan dengan ahli laktasi jika memungkinkan'
      ],
      activities: [
        'Stimulasi motorik sesuai usia',
        'Bermain di luar ruangan untuk paparan sinar matahari',
        'Interaksi sosial dengan anak sebaya',
        'Aktivitas fisik ringan yang sesuai usia'
      ],
      monitoring: [
        'Timbang berat badan setiap bulan',
        'Ukur tinggi badan setiap 3 bulan',
        'Pantau milestone perkembangan',
        'Catat asupan makanan harian'
      ],
      medical: [
        'Kunjungi posyandu/puskesmas secara rutin',
        'Konsultasi dengan dokter anak jika ada kekhawatiran',
        'Pastikan imunisasi lengkap sesuai jadwal',
        isStunting ? 'Rujuk ke ahli gizi untuk program pemulihan' : 'Pemeriksaan rutin setiap 3 bulan'
      ]
    },
    mealPlan: {
      breakfast: [
        'Bubur ayam dengan sayuran',
        'Telur rebus/orak-arik dengan roti gandum',
        'Oatmeal dengan buah dan kacang',
        'Nasi tim ikan dengan wortel dan bayam'
      ],
      lunch: [
        'Nasi dengan lauk protein (ayam/ikan/tempe) dan sayur',
        'Sup ayam/sapi dengan kentang dan wortel',
        'Nasi merah dengan tumis sayuran dan telur',
        'Mie kuah dengan bakso dan sayuran'
      ],
      dinner: [
        'Nasi dengan ikan dan sayur bayam',
        'Bubur kacang hijau dengan ubi',
        'Kentang rebus dengan ayam suwir dan brokoli',
        'Nasi dengan tahu/tempe dan ca p cai'
      ],
      snacks: [
        'Buah potong (pisang, pepaya, apel)',
        'Yogurt tanpa gula berlebih',
        'Biskuit gandum',
        'Telur rebus',
        'Smoothie buah dengan susu'
      ]
    },
    parentGuidance: {
      dosList: [
        'Berikan makan dengan jadwal teratur',
        'Ciptakan suasana makan yang menyenangkan',
        'Berikan contoh pola makan sehat',
        'Dorong anak untuk mencoba makanan baru',
        'Berikan pujian saat anak makan dengan baik'
      ],
      dontsList: [
        'Jangan memaksa anak makan terlalu banyak',
        'Hindari memberikan makanan sambil bermain gadget',
        'Jangan memberikan makanan cepat saji terlalu sering',
        'Hindari minuman manis dan bersoda',
        'Jangan membandingkan anak dengan anak lain'
      ],
      warningSigns: [
        'Penurunan berat badan yang drastis',
        'Penolakan makan total lebih dari 24 jam',
        'Diare atau muntah berkepanjangan',
        'Demam tinggi yang tidak turun',
        'Lemas dan tidak aktif seperti biasanya'
      ]
    },
    followUp: {
      nextCheckup: isStunting ? '1 bulan' : '3 bulan',
      milestones: [
        'Kemampuan motorik kasar dan halus',
        'Perkembangan bahasa dan komunikasi',
        'Interaksi sosial dan emosional',
        'Kemandirian dalam aktivitas sehari-hari'
      ],
      resources: [
        'Buku KIA (Kesehatan Ibu dan Anak)',
        'Aplikasi pantau tumbuh kembang anak',
        'Konsultasi dengan kader posyandu',
        'Grup dukungan orang tua'
      ]
    }
  };
}
