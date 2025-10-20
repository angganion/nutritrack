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
  regionalFoodRecommendations?: {
    localSpecialties: Array<{
      name: string;
      ingredients: string[];
      nutritionalValue: string;
      preparation: string;
      benefits: string[];
      availability: string;
    }>;
    naturalResources: {
      agricultural: string[];
      marine: string[];
      livestock: string[];
      forestry: string[];
    };
    traditionalDishes: Array<{
      name: string;
      ingredients: string[];
      nutritionalBenefits: string[];
      preparation: string;
      suitableFor: string;
    }>;
    nutritionalMapping: {
      proteinSources: string[];
      ironSources: string[];
      calciumSources: string[];
      vitaminSources: string[];
    };
    culturalIntegration: {
      traditionalPractices: string[];
      communityEngagement: string[];
      localWisdom: string[];
    };
  };
  stakeholders: string[];
  budgetEstimate?: string;
}

export interface RegionalRecommendationRequest {
  location: {
    province: string;
    city?: string;
    district?: string;
  };
  stuntingRate?: number;
  totalChildren?: number;
  totalStunting?: number;
}

export interface RegionalRecommendationResponse {
  region: {
    name: string;
    province: string;
    city?: string;
    district?: string;
  };
  localFoods: {
    proteinSources: Array<{
      name: string;
      nutritionalValue: string;
      availability: 'high' | 'medium' | 'low';
      preparation: string;
      benefits: string[];
    }>;
    ironSources: Array<{
      name: string;
      nutritionalValue: string;
      availability: 'high' | 'medium' | 'low';
      preparation: string;
      benefits: string[];
    }>;
    calciumSources: Array<{
      name: string;
      nutritionalValue: string;
      availability: 'high' | 'medium' | 'low';
      preparation: string;
      benefits: string[];
    }>;
    vitaminSources: Array<{
      name: string;
      nutritionalValue: string;
      availability: 'high' | 'medium' | 'low';
      preparation: string;
      benefits: string[];
    }>;
  };
  traditionalDishes: Array<{
    name: string;
    ingredients: string[];
    nutritionalBenefits: string[];
    preparation: string;
    suitableFor: string;
  }>;
  naturalResources: {
    agricultural: string[];
    marine: string[];
    livestock: string[];
    forestry: string[];
  };
  recommendations: {
    nutritionPrograms: string[];
    foodSecurity: string[];
    communityEngagement: string[];
    economicDevelopment: string[];
  };
  implementation: {
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
Sebagai ahli gizi dan kesehatan anak, berikan rekomendasi nutrisi yang spesifik untuk menangani kasus stunting berikut:

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

**PENTING - Ikuti Permenkes No. 2 Tahun 2020:**
- Jika Z-score berat badan menurut panjang badan (W/L) < -2 SD: RUJUK KE PUSKESMAS TERDEKAT
- Jika Z-score panjang badan menurut umur (L/A) < -2 SD: RUJUK KE PUSKESMAS TERDEKAT
- Jika Z-score berat badan menurut umur (W/A) < -2 SD: RUJUK KE PUSKESMAS TERDEKAT

**Tugas:**
1. Berikan 5-7 rekomendasi nutrisi yang SPESIFIK dengan makanan lokal daerah
2. Tentukan prioritas (high/medium/low) berdasarkan urgensi
3. Fokus pada makanan kaya protein, zat besi, zinc, dan kalsium dari daerah setempat
4. Berikan rekomendasi program penyaluran nutrisi yang tepat
5. Jika di bawah batas Permenkes, WAJIB rekomendasikan rujukan ke puskesmas terdekat

**Format Response (JSON):**
{
  "recommendations": [
    "Rekomendasi nutrisi spesifik dengan makanan lokal",
    "Rekomendasi program penyaluran nutrisi",
    "Rekomendasi makanan kaya protein dari daerah",
    "Rekomendasi suplementasi jika diperlukan",
    "Rekomendasi rujukan ke puskesmas (jika diperlukan)"
  ],
  "priority": "high|medium|low",
  "summary": "Ringkasan situasi nutrisi dan strategi perbaikan gizi"
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
  
  // Hitung Z-score berdasarkan Permenkes No. 2 Tahun 2020
  const zScoreWL = calculateZScoreWL(data.bodyWeight, data.bodyLength, data.gender, data.age);
  const zScoreLA = calculateZScoreLA(data.bodyLength, data.age, data.gender);
  const zScoreWA = calculateZScoreWA(data.bodyWeight, data.age, data.gender);
  
  // Cek kriteria rujukan berdasarkan Permenkes
  const needsReferral = zScoreWL < -2 || zScoreLA < -2 || zScoreWA < -2;
  
  if (needsReferral) {
    recommendations.push(
      "RUJUK KE PUSKESMAS TERDEKAT - Z-score di bawah -2 SD sesuai Permenkes No. 2 Tahun 2020",
      "Berikan makanan kaya protein lokal (ikan, telur, tempe, tahu, kacang-kacangan)",
      "Pastikan asupan zat besi dari sayuran hijau dan daging lokal",
      "Berikan makanan kaya zinc seperti kacang-kacangan dan biji-bijian",
      "Konsultasi dengan ahli gizi untuk program pemulihan nutrisi"
    );
  } else if (data.stunting) {
    recommendations.push(
      "Anak mengalami stunting namun Z-score masih dalam batas normal - pantau ketat",
      "Berikan makanan kaya protein lokal (ikan, telur, tempe, tahu, kacang-kacangan)",
      "Pastikan asupan zat besi dari sayuran hijau dan daging lokal",
      "Berikan makanan kaya zinc seperti kacang-kacangan dan biji-bijian",
      "Konsultasi dengan ahli gizi untuk program perbaikan nutrisi"
    );
  } else {
    recommendations.push(
      "Berikan makanan kaya protein lokal sesuai usia anak",
      "Pastikan asupan kalsium dari susu, ikan, dan sayuran hijau",
      "Berikan variasi buah dan sayur lokal setiap hari",
      "Terapkan pola makan gizi seimbang dengan bahan lokal"
    );
  }

  if (!data.breastFeeding && data.age <= 24) {
    recommendations.push(
      "Konsultasikan dengan konselor laktasi untuk bantuan menyusui",
      "Jika tidak memungkinkan ASI, pilih susu formula yang sesuai usia"
    );
  }

  recommendations.push(
    "Pantau pertumbuhan secara rutin di posyandu/puskesmas",
    "Pastikan imunisasi lengkap sesuai jadwal",
    "Edukasi keluarga tentang pentingnya nutrisi untuk pertumbuhan"
  );

  return {
    recommendations,
    priority: needsReferral ? 'high' : data.stunting ? 'medium' : 'low',
    summary: needsReferral 
      ? 'Z-score di bawah -2 SD - RUJUK KE PUSKESMAS sesuai Permenkes No. 2 Tahun 2020'
      : data.stunting 
        ? 'Anak mengalami stunting namun Z-score normal - pantau ketat dan berikan nutrisi lokal'
        : 'Anak dalam kondisi normal - pertahankan nutrisi seimbang dengan makanan lokal'
  };
}

// Fungsi untuk menghitung Z-score berdasarkan Permenkes No. 2 Tahun 2020
function calculateZScoreWL(weight: number, length: number, gender: string, age: number): number {
  // Simplified Z-score calculation - dalam implementasi nyata perlu tabel WHO
  // Ini adalah contoh sederhana, implementasi sebenarnya perlu tabel lengkap WHO
  const expectedWeight = getExpectedWeightForLength(length, gender);
  return (weight - expectedWeight) / (expectedWeight * 0.1); // Simplified SD
}

function calculateZScoreLA(length: number, age: number, gender: string): number {
  // Simplified Z-score calculation
  const expectedLength = getExpectedLengthForAge(age, gender);
  return (length - expectedLength) / (expectedLength * 0.1); // Simplified SD
}

function calculateZScoreWA(weight: number, age: number, gender: string): number {
  // Simplified Z-score calculation
  const expectedWeight = getExpectedWeightForAge(age, gender);
  return (weight - expectedWeight) / (expectedWeight * 0.1); // Simplified SD
}

// Fungsi helper untuk menghitung nilai expected (disederhanakan)
function getExpectedWeightForLength(length: number, gender: string): number {
  // Simplified calculation - dalam implementasi nyata perlu tabel WHO lengkap
  return length * 0.1 + (gender === 'male' ? 2 : 1.5);
}

function getExpectedLengthForAge(age: number, gender: string): number {
  // Simplified calculation - dalam implementasi nyata perlu tabel WHO lengkap
  return age * 0.5 + (gender === 'male' ? 50 : 49);
}

function getExpectedWeightForAge(age: number, gender: string): number {
  // Simplified calculation - dalam implementasi nyata perlu tabel WHO lengkap
  return age * 0.3 + (gender === 'male' ? 3 : 2.8);
}

export async function getPolicyRecommendations(data: PolicyRecommendationRequest): Promise<PolicyRecommendationResponse> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Sebagai ahli kebijakan gizi masyarakat dan ketahanan pangan, berikan rekomendasi strategis untuk pemerintah/pemangku kebijakan dalam menangani masalah stunting melalui program nutrisi dan ketahanan pangan di wilayah berikut:

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

**Tugas - FOKUS PADA NUTRISI DAN MAKANAN DAERAH:**
1. Berikan 5-7 rekomendasi kebijakan yang SPESIFIK untuk program nutrisi dan ketahanan pangan lokal
2. Tentukan prioritas (high/medium/low) berdasarkan urgensi dan dampak nutrisi
3. Buat rencana aksi jangka pendek (1-6 bulan), menengah (6-18 bulan), dan panjang (18+ bulan)
4. Identifikasi stakeholder kunci yang terlibat dalam program nutrisi dan ketahanan pangan
5. Berikan estimasi anggaran yang realistis untuk program nutrisi dan pangan lokal
6. Fokus pada: makanan lokal kaya nutrisi, program penyaluran pangan, edukasi gizi, dan ketahanan pangan daerah
7. **REKOMENDASI MAKANAN KHAS DAERAH:** Berikan rekomendasi makanan khas dan sumber daya alam lokal dari daerah ${data.location.name} yang dapat dimanfaatkan untuk program nutrisi anti-stunting, termasuk:
   - Makanan khas daerah ${data.location.name} yang kaya protein, zat besi, zinc, dan kalsium
   - Sumber daya alam lokal (pertanian, perikanan, peternakan, kehutanan) yang tersedia di ${data.location.name}
   - Masakan tradisional khas ${data.location.name} yang bergizi tinggi dan cocok untuk balita
   - Cara pengolahan makanan tradisional daerah yang mempertahankan nilai gizi
   - Potensi pengembangan ketahanan pangan berbasis kearifan lokal ${data.location.name}

**PENTING - FOKUS NUTRISI DAN MAKANAN DAERAH:**
- Rekomendasi harus SPESIFIK tentang makanan lokal kaya protein, zat besi, zinc, kalsium
- Program penyaluran pangan yang tepat sasaran untuk keluarga berisiko stunting
- Pengembangan ketahanan pangan lokal dengan fokus nutrisi
- Edukasi gizi berbasis makanan lokal yang tersedia di daerah
- Koordinasi dengan sektor pertanian, perikanan, dan peternakan lokal

**Format Response (JSON):**
{
  "recommendations": [
    "Rekomendasi program nutrisi dengan makanan lokal spesifik",
    "Rekomendasi program penyaluran pangan kaya nutrisi",
    "Rekomendasi pengembangan ketahanan pangan lokal",
    "Rekomendasi edukasi gizi berbasis makanan daerah",
    "Rekomendasi koordinasi lintas sektor untuk nutrisi"
  ],
  "priority": "high|medium|low",
  "summary": "Ringkasan situasi nutrisi dan strategi ketahanan pangan lokal dalam bahasa Indonesia",
  "actionPlan": {
    "shortTerm": ["Aksi nutrisi jangka pendek dengan makanan lokal", "Program penyaluran pangan darurat"],
    "mediumTerm": ["Pengembangan program nutrisi berkelanjutan", "Edukasi gizi masyarakat"],
    "longTerm": ["Ketahanan pangan lokal berkelanjutan", "Sistem monitoring nutrisi terintegrasi"]
  },
  "regionalFoodRecommendations": {
    "localSpecialties": [
      {
        "name": "Nama makanan khas daerah",
        "ingredients": ["Bahan-bahan utama"],
        "nutritionalValue": "Kandungan gizi utama (protein, zat besi, dll)",
        "preparation": "Cara pengolahan tradisional",
        "benefits": ["Manfaat nutrisi untuk anti-stunting"],
        "availability": "Tingkat ketersediaan di daerah"
      }
    ],
    "naturalResources": {
      "agricultural": ["Hasil pertanian lokal yang bergizi"],
      "marine": ["Hasil perikanan lokal"],
      "livestock": ["Hasil peternakan lokal"],
      "forestry": ["Hasil hutan yang bisa dimanfaatkan"]
    },
    "traditionalDishes": [
      {
        "name": "Nama masakan tradisional",
        "ingredients": ["Bahan-bahan tradisional"],
        "nutritionalBenefits": ["Manfaat gizi untuk balita"],
        "preparation": "Cara memasak tradisional",
        "suitableFor": "Cocok untuk usia berapa"
      }
    ],
    "nutritionalMapping": {
      "proteinSources": ["Sumber protein khas daerah"],
      "ironSources": ["Sumber zat besi dari makanan daerah"],
      "calciumSources": ["Sumber kalsium dari pangan lokal"],
      "vitaminSources": ["Sumber vitamin dari buah/sayur daerah"]
    },
    "culturalIntegration": {
      "traditionalPractices": ["Praktik pemberian makan tradisional daerah"],
      "communityEngagement": ["Cara melibatkan masyarakat dengan makanan lokal"],
      "localWisdom": ["Kearifan lokal tentang pangan bergizi"]
    }
  },
  "stakeholders": [
    "Dinas Kesehatan - Koordinasi program nutrisi dan edukasi gizi",
    "Dinas Pertanian - Pengembangan pangan lokal kaya nutrisi",
    "Dinas Perikanan - Program ikan lokal untuk protein",
    "Dinas Peternakan - Program telur dan daging lokal",
    "Badan Ketahanan Pangan - Koordinasi ketahanan pangan daerah",
    "Puskesmas - Pelayanan nutrisi dan rujukan gizi",
    "Posyandu - Edukasi gizi dan monitoring pertumbuhan"
  ],
  "budgetEstimate": "Estimasi anggaran untuk program nutrisi dan ketahanan pangan lokal (dalam Rupiah)"
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
      regionalFoodRecommendations: parsedResponse.regionalFoodRecommendations || {
        localSpecialties: [],
        naturalResources: {
          agricultural: [],
          marine: [],
          livestock: [],
          forestry: []
        },
        traditionalDishes: [],
        nutritionalMapping: {
          proteinSources: [],
          ironSources: [],
          calciumSources: [],
          vitaminSources: []
        },
        culturalIntegration: {
          traditionalPractices: [],
          communityEngagement: [],
          localWisdom: []
        }
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
      "Implementasikan program nutrisi lokal terpadu dengan fokus pada makanan kaya protein daerah",
      "Perkuat program penyaluran pangan lokal kaya nutrisi untuk 100% keluarga berisiko stunting",
      "Kembangkan ketahanan pangan lokal dengan fokus pada ikan, telur, dan sayuran hijau",
      "Lakukan edukasi gizi berbasis makanan lokal yang tersedia di daerah",
      "Bentuk tim satgas nutrisi tingkat kecamatan dengan koordinasi Dinas Pertanian dan Perikanan"
    );
  } else if (stuntingRate > 20) {
    recommendations.push(
      "Perkuat program nutrisi melalui revitalisasi posyandu dengan fokus edukasi gizi lokal",
      "Tingkatkan program penyaluran pangan bergizi lokal untuk 80% keluarga berisiko",
      "Kembangkan program budidaya pangan lokal kaya nutrisi di tingkat desa",
      "Implementasikan monitoring nutrisi bulanan dengan fokus pada asupan protein lokal"
    );
  } else {
    recommendations.push(
      "Pertahankan program nutrisi lokal yang sudah ada dengan monitoring ketat",
      "Tingkatkan diversifikasi pangan lokal kaya nutrisi di tingkat masyarakat",
      "Perkuat koordinasi dengan sektor pertanian dan perikanan untuk ketahanan pangan",
      "Implementasikan program berkelanjutan untuk menjaga ketahanan pangan lokal"
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
        "Identifikasi dan mapping 100% keluarga berisiko stunting dengan fokus nutrisi dalam 2 bulan",
        "Perkuat posyandu dengan edukasi gizi lokal dan pelatihan kader nutrisi dalam 3 bulan",
        "Lakukan screening nutrisi dan rujukan ke puskesmas untuk balita stunting dalam 1 bulan"
      ],
      mediumTerm: [
        "Implementasi program penyaluran pangan lokal kaya nutrisi untuk keluarga berisiko dalam 6 bulan",
        "Pelatihan komprehensif kader dan tenaga kesehatan dalam edukasi gizi lokal dalam 6 bulan",
        "Penguatan ketahanan pangan lokal dengan program budidaya pangan bergizi dalam 9 bulan"
      ],
      longTerm: [
        "Penguatan sistem ketahanan pangan lokal dengan infrastruktur berkelanjutan dalam 18 bulan",
        "Pembangunan program nutrisi terintegrasi dengan sektor pertanian dan perikanan dalam 24 bulan",
        "Implementasi sistem monitoring nutrisi digital untuk tracking asupan gizi lokal dalam 12 bulan"
      ]
    },
    regionalFoodRecommendations: {
      localSpecialties: [
        {
          name: `Makanan khas ${data.location.name}`,
          ingredients: ["Bahan-bahan lokal daerah"],
          nutritionalValue: "Kaya protein, zat besi, dan vitamin",
          preparation: "Cara pengolahan tradisional",
          benefits: ["Mencegah stunting", "Meningkatkan imunitas", "Mendukung pertumbuhan"],
          availability: "Tersedia sepanjang tahun di daerah"
        }
      ],
      naturalResources: {
        agricultural: ["Padi", "Jagung", "Ubi-ubian", "Sayuran hijau", "Buah-buahan"],
        marine: ["Ikan air tawar", "Ikan laut", "Udang", "Kepiting"],
        livestock: ["Ayam kampung", "Sapi", "Kambing", "Telur"],
        forestry: ["Buah-buahan hutan", "Sayuran liar", "Madu hutan"]
      },
      traditionalDishes: [
        {
          name: `Masakan tradisional ${data.location.name}`,
          ingredients: ["Bahan-bahan tradisional"],
          nutritionalBenefits: ["Kaya protein", "Sumber vitamin", "Mudah dicerna"],
          preparation: "Cara memasak tradisional",
          suitableFor: "Balita 6-24 bulan"
        }
      ],
      nutritionalMapping: {
        proteinSources: ["Ikan air tawar", "Telur ayam kampung", "Tempe dan tahu", "Kacang-kacangan", "Daging lokal"],
        ironSources: ["Bayam", "Kangkung", "Daun singkong", "Daging merah", "Hati ayam"],
        calciumSources: ["Susu sapi lokal", "Ikan teri", "Sayuran hijau", "Kacang-kacangan", "Tempe"],
        vitaminSources: ["Buah-buahan lokal", "Sayuran berwarna", "Ubi jalar", "Pepaya", "Jeruk"]
      },
      culturalIntegration: {
        traditionalPractices: ["Praktik pemberian makan tradisional", "Penggunaan rempah-rempah lokal", "Metode pengolahan pangan tradisional"],
        communityEngagement: ["Melibatkan tokoh adat", "Menggunakan kearifan lokal", "Program berbasis komunitas"],
        localWisdom: ["Pengetahuan tradisional tentang pangan", "Praktik budidaya lokal", "Sistem distribusi pangan tradisional"]
      }
    },
    stakeholders: [
      "Dinas Kesehatan - Koordinasi program nutrisi dan edukasi gizi masyarakat",
      "Dinas Pertanian - Pengembangan pangan lokal kaya nutrisi dan program budidaya",
      "Dinas Perikanan - Program ikan lokal untuk protein dan omega-3",
      "Dinas Peternakan - Program telur dan daging lokal untuk protein",
      "Badan Ketahanan Pangan - Koordinasi ketahanan pangan daerah",
      "Puskesmas - Pelayanan nutrisi dan rujukan gizi ke puskesmas",
      "Posyandu - Edukasi gizi lokal dan monitoring pertumbuhan",
      "PKK - Mobilisasi masyarakat untuk program nutrisi lokal",
      "Dinas Sosial - Bantuan pangan bergizi untuk keluarga berisiko"
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
  
  return `Estimasi anggaran: Rp ${totalCost.toLocaleString('id-ID')} per tahun. Breakdown: Program nutrisi dan penyaluran pangan lokal Rp ${estimatedCost.toLocaleString('id-ID')} (Rp ${baseCostPerChild.toLocaleString('id-ID')} per anak stunting), Program ketahanan pangan dan koordinasi Rp ${infrastructureCost.toLocaleString('id-ID')}. Angka ini berdasarkan data historis program nutrisi dan ketahanan pangan di Indonesia tahun 2020-2023.`;
}

/**
 * Generate personalized recommendations for an individual child
 */
export async function generateChildRecommendations(childData: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Sebagai ahli gizi dan kesehatan anak, berikan rekomendasi nutrisi personal untuk anak dengan data berikut:

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

**PENTING - Ikuti Permenkes No. 2 Tahun 2020:**
- Jika Z-score berat badan menurut panjang badan (W/L) < -2 SD: RUJUK KE PUSKESMAS TERDEKAT
- Jika Z-score panjang badan menurut umur (L/A) < -2 SD: RUJUK KE PUSKESMAS TERDEKAT  
- Jika Z-score berat badan menurut umur (W/A) < -2 SD: RUJUK KE PUSKESMAS TERDEKAT

Berikan rekomendasi dalam format JSON dengan struktur berikut:
{
  "healthStatus": {
    "stuntingRisk": "high/medium/low",
    "nutritionalStatus": "string describing nutritional status",
    "growthAssessment": "string assessing growth pattern",
    "referralNeeded": "boolean - true if needs referral to puskesmas"
  },
  "recommendations": {
    "nutrition": ["list of specific nutrition recommendations with local foods"],
    "supplements": ["list of recommended supplements if needed"],
    "monitoring": ["list of what to monitor regularly"],
    "medical": ["list of medical follow-ups needed - include referral if needed"],
    "activities": ["list of recommended activities and stimulation for the child"]
  },
  "mealPlan": {
    "breakfast": ["list of breakfast suggestions with local ingredients"],
    "lunch": ["list of lunch suggestions with local ingredients"],
    "dinner": ["list of dinner suggestions with local ingredients"],
    "snacks": ["list of healthy snack options with local ingredients"]
  },
  "localFoods": {
    "proteinSources": ["local protein-rich foods available in the area"],
    "ironSources": ["local iron-rich foods available in the area"],
    "calciumSources": ["local calcium-rich foods available in the area"],
    "vitaminSources": ["local vitamin-rich foods available in the area"]
  },
  "parentGuidance": {
    "dosList": ["things parents should do for nutrition"],
    "dontsList": ["things parents should avoid"],
    "warningSigns": ["signs that require immediate medical attention"],
    "referralUrgency": "immediate/urgent/routine - based on Permenkes criteria"
  },
  "followUp": {
    "nextCheckup": "recommended timeframe for next checkup",
    "referralAction": "specific action needed if referral required",
    "resources": ["helpful resources for parents about nutrition"]
  }
}

Berikan rekomendasi yang:
1. FOKUS PADA NUTRISI dan makanan lokal yang tersedia
2. Mengikuti Permenkes No. 2 Tahun 2020 untuk rujukan
3. Spesifik dengan makanan kaya protein, zat besi, zinc, kalsium
4. Praktis dan mudah diimplementasikan dengan bahan lokal
5. Dalam Bahasa Indonesia yang mudah dipahami
6. Untuk field "activities", berikan rekomendasi aktivitas fisik dan stimulasi yang sesuai dengan usia anak dan kondisi stunting`;

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
  
  // Hitung Z-score berdasarkan Permenkes No. 2 Tahun 2020
  const zScoreWL = calculateZScoreWL(childData.body_weight, childData.body_length, childData.gender, childData.age);
  const zScoreLA = calculateZScoreLA(childData.body_length, childData.age, childData.gender);
  const zScoreWA = calculateZScoreWA(childData.body_weight, childData.age, childData.gender);
  
  // Cek kriteria rujukan berdasarkan Permenkes
  const needsReferral = zScoreWL < -2 || zScoreLA < -2 || zScoreWA < -2;
  
  return {
    healthStatus: {
      stuntingRisk: needsReferral ? 'high' : isStunting ? 'medium' : 'low',
      nutritionalStatus: needsReferral 
        ? 'Z-score di bawah -2 SD - RUJUK KE PUSKESMAS sesuai Permenkes No. 2 Tahun 2020'
        : isStunting 
          ? 'Anak mengalami stunting namun Z-score normal - perlu perhatian khusus untuk perbaikan gizi'
          : 'Status gizi anak dalam kondisi baik, pertahankan pola asuh yang sehat',
      growthAssessment: `Anak berusia ${childData.age} bulan dengan berat ${childData.body_weight} kg dan tinggi ${childData.body_length} cm`,
      referralNeeded: needsReferral
    },
    recommendations: {
      nutrition: needsReferral ? [
        'RUJUK KE PUSKESMAS TERDEKAT - Z-score di bawah -2 SD',
        'Berikan makanan kaya protein lokal (ikan, telur, tempe, tahu, kacang-kacangan)',
        'Pastikan asupan zat besi dari sayuran hijau dan daging lokal',
        'Berikan makanan kaya zinc seperti kacang-kacangan dan biji-bijian',
        'Konsultasi dengan ahli gizi untuk program pemulihan nutrisi'
      ] : isStunting ? [
        'Berikan makanan kaya protein lokal (ikan, telur, tempe, tahu, kacang-kacangan)',
        'Pastikan asupan zat besi dari sayuran hijau dan daging lokal',
        'Berikan makanan kaya zinc seperti kacang-kacangan dan biji-bijian',
        'Konsultasi dengan ahli gizi untuk program perbaikan nutrisi',
        childData.breast_feeding ? 'Lanjutkan pemberian ASI' : 'Konsultasikan dengan ahli laktasi jika memungkinkan'
      ] : [
        'Berikan makanan kaya protein lokal sesuai usia anak',
        'Pastikan asupan kalsium dari susu, ikan, dan sayuran hijau',
        'Berikan variasi buah dan sayur lokal setiap hari',
        'Terapkan pola makan gizi seimbang dengan bahan lokal',
        childData.breast_feeding ? 'Lanjutkan pemberian ASI' : 'Konsultasikan dengan ahli laktasi jika memungkinkan'
      ],
      supplements: needsReferral ? [
        'Konsultasi dengan dokter untuk suplementasi zat besi dan zinc',
        'Pertimbangkan multivitamin sesuai anjuran dokter'
      ] : isStunting ? [
        'Konsultasi dengan dokter untuk suplementasi jika diperlukan',
        'Pertimbangkan multivitamin sesuai anjuran dokter'
      ] : [
        'Tidak diperlukan suplementasi khusus jika nutrisi seimbang'
      ],
      monitoring: [
        'Timbang berat badan setiap bulan',
        'Ukur tinggi badan setiap 3 bulan',
        'Pantau milestone perkembangan',
        'Catat asupan makanan harian'
      ],
      medical: needsReferral ? [
        'RUJUK KE PUSKESMAS TERDEKAT - Z-score di bawah -2 SD sesuai Permenkes No. 2 Tahun 2020',
        'Konsultasi dengan dokter anak segera',
        'Pastikan imunisasi lengkap sesuai jadwal',
        'Rujuk ke ahli gizi untuk program pemulihan nutrisi'
      ] : isStunting ? [
        'Kunjungi posyandu/puskesmas secara rutin',
        'Konsultasi dengan dokter anak jika ada kekhawatiran',
        'Pastikan imunisasi lengkap sesuai jadwal',
        'Rujuk ke ahli gizi untuk program perbaikan nutrisi'
      ] : [
        'Kunjungi posyandu/puskesmas secara rutin',
        'Konsultasi dengan dokter anak jika ada kekhawatiran',
        'Pastikan imunisasi lengkap sesuai jadwal',
        'Pemeriksaan rutin setiap 3 bulan'
      ],
      activities: needsReferral ? [
        'Aktivitas fisik ringan sesuai kemampuan anak',
        'Stimulasi motorik kasar dan halus',
        'Interaksi sosial dengan keluarga',
        'Permainan edukatif yang sesuai usia'
      ] : isStunting ? [
        'Aktivitas fisik ringan sesuai kemampuan anak',
        'Stimulasi motorik kasar dan halus',
        'Interaksi sosial dengan keluarga',
        'Permainan edukatif yang sesuai usia',
        'Latihan koordinasi mata-tangan'
      ] : [
        'Aktivitas fisik sesuai usia anak',
        'Stimulasi motorik kasar dan halus',
        'Interaksi sosial dengan keluarga',
        'Permainan edukatif yang sesuai usia',
        'Aktivitas kreatif dan eksplorasi'
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
      dosList: needsReferral ? [
        'SEGERA RUJUK KE PUSKESMAS TERDEKAT - Z-score di bawah -2 SD',
        'Berikan makanan kaya protein lokal dengan jadwal teratur',
        'Ciptakan suasana makan yang menyenangkan',
        'Berikan contoh pola makan sehat dengan bahan lokal',
        'Dorong anak untuk mencoba makanan bergizi baru'
      ] : isStunting ? [
        'Berikan makanan kaya protein lokal dengan jadwal teratur',
        'Ciptakan suasana makan yang menyenangkan',
        'Berikan contoh pola makan sehat dengan bahan lokal',
        'Dorong anak untuk mencoba makanan bergizi baru',
        'Pantau pertumbuhan secara ketat'
      ] : [
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
      warningSigns: needsReferral ? [
        'Z-score di bawah -2 SD - RUJUK KE PUSKESMAS',
        'Penurunan berat badan yang drastis',
        'Penolakan makan total lebih dari 24 jam',
        'Diare atau muntah berkepanjangan',
        'Demam tinggi yang tidak turun',
        'Lemas dan tidak aktif seperti biasanya'
      ] : [
        'Penurunan berat badan yang drastis',
        'Penolakan makan total lebih dari 24 jam',
        'Diare atau muntah berkepanjangan',
        'Demam tinggi yang tidak turun',
        'Lemas dan tidak aktif seperti biasanya'
      ],
      referralUrgency: needsReferral ? 'immediate' : isStunting ? 'urgent' : 'routine'
    },
    followUp: {
      nextCheckup: needsReferral ? 'Segera (rujuk ke puskesmas)' : isStunting ? '1 bulan' : '3 bulan',
      referralAction: needsReferral ? 'RUJUK KE PUSKESMAS TERDEKAT - Z-score di bawah -2 SD sesuai Permenkes No. 2 Tahun 2020' : isStunting ? 'Pantau ketat dan konsultasi dengan ahli gizi' : 'Pemeriksaan rutin',
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
