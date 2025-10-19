import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPolicyRecommendations } from '@/lib/gemini';

// Helper function untuk decode URL dan clean nama
function decodeAndClean(param: string): string {
  return decodeURIComponent(param).replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
}

// Helper function untuk normalize nama provinsi
function normalizeProvince(province: string): string {
  const provinceMap: { [key: string]: string } = {
    'dki jakarta': 'Daerah Khusus Ibukota Jakarta',
    'jakarta': 'Daerah Khusus Ibukota Jakarta',
    'diy': 'Daerah Istimewa Yogyakarta',
    'yogyakarta': 'Daerah Istimewa Yogyakarta',
    'jawa barat': 'Jawa Barat',
    'jawa tengah': 'Jawa Tengah',
    'jawa timur': 'Jawa Timur',
    'banten': 'Banten',
    'bali': 'Bali',
    'aceh': 'Aceh',
    'sumatera utara': 'Sumatera Utara',
    'sumatera barat': 'Sumatera Barat',
    'riau': 'Riau',
    'kepulauan riau': 'Kepulauan Riau',
    'jambi': 'Jambi',
    'sumatera selatan': 'Sumatera Selatan',
    'bengkulu': 'Bengkulu',
    'kepulauan bangka belitung': 'Kepulauan Bangka Belitung',
    'lampung': 'Lampung',
    'kalimantan barat': 'Kalimantan Barat',
    'kalimantan tengah': 'Kalimantan Tengah',
    'kalimantan selatan': 'Kalimantan Selatan',
    'kalimantan timur': 'Kalimantan Timur',
    'kalimantan utara': 'Kalimantan Utara',
    'sulawesi utara': 'Sulawesi Utara',
    'gorontalo': 'Gorontalo',
    'sulawesi tengah': 'Sulawesi Tengah',
    'sulawesi barat': 'Sulawesi Barat',
    'sulawesi selatan': 'Sulawesi Selatan',
    'sulawesi tenggara': 'Sulawesi Tenggara',
    'nusa tenggara barat': 'Nusa Tenggara Barat',
    'nusa tenggara timur': 'Nusa Tenggara Timur',
    'maluku': 'Maluku',
    'maluku utara': 'Maluku Utara',
    'papua': 'Papua',
    'papua barat': 'Papua Barat',
    'papua selatan': 'Papua Selatan',
    'papua tengah': 'Papua Tengah',
    'papua pegunungan': 'Papua Pegunungan',
    'papua barat daya': 'Papua Barat Daya',
  };

  const normalized = province.toLowerCase().trim();
  return provinceMap[normalized] || province;
}

// Helper function untuk normalize nama kota
function normalizeCity(city: string): string {
  return city.replace(/\b(kota|kabupaten|kab)\b/gi, '').trim();
}

// Helper function untuk mengelompokkan data berdasarkan provinsi
function groupByProvince(data: any[]) {
  const grouped = data.reduce((acc: any, child: any) => {
    const province = child.alamat.state;
    if (!acc[province]) {
      acc[province] = {
        province,
        totalChildren: 0,
        totalStunting: 0,
        longitude: child.alamat.longitude,
        latitude: child.alamat.latitude,
        data: []
      };
    }
    acc[province].totalChildren++;
    if (child.stunting) {
      acc[province].totalStunting++;
    }
    acc[province].data.push(child);
    return acc;
  }, {});

  return Object.values(grouped).map((group: any) => ({
    ...group,
    stuntingRate: group.totalChildren > 0 ? ((group.totalStunting / group.totalChildren) * 100).toFixed(2) : '0.00'
  }));
}

// Helper function untuk mengelompokkan data berdasarkan kota
function groupByCity(data: any[]) {
  const grouped = data.reduce((acc: any, child: any) => {
    const city = child.alamat.city;
    if (!acc[city]) {
      acc[city] = {
        city,
        totalChildren: 0,
        totalStunting: 0,
        longitude: child.alamat.longitude,
        latitude: child.alamat.latitude,
        data: []
      };
    }
    acc[city].totalChildren++;
    if (child.stunting) {
      acc[city].totalStunting++;
    }
    acc[city].data.push(child);
    return acc;
  }, {});

  return Object.values(grouped).map((group: any) => ({
    ...group,
    stuntingRate: group.totalChildren > 0 ? ((group.totalStunting / group.totalChildren) * 100).toFixed(2) : '0.00'
  }));
}

// Helper function untuk mengelompokkan data berdasarkan kecamatan
function groupByDistrict(data: any[]) {
  const grouped = data.reduce((acc: any, child: any) => {
    const district = child.alamat.city_district;
    if (!acc[district]) {
      acc[district] = {
        district,
        totalChildren: 0,
        totalStunting: 0,
        longitude: child.alamat.longitude,
        latitude: child.alamat.latitude,
        data: []
      };
    }
    acc[district].totalChildren++;
    if (child.stunting) {
      acc[district].totalStunting++;
    }
    acc[district].data.push(child);
    return acc;
  }, {});

  return Object.values(grouped).map((group: any) => ({
    ...group,
    stuntingRate: group.totalChildren > 0 ? ((group.totalStunting / group.totalChildren) * 100).toFixed(2) : '0.00'
  }));
}

// GET handler untuk berbagai level geografis dengan rekomendasi
export async function GET(
  request: Request,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.params.map(decodeAndClean);
    
    // Get query parameters for user role and kecamatan
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('userRole');
    const userKecamatan = searchParams.get('userKecamatan');
    
    if (pathSegments.length === 0) {
      return NextResponse.json(
        { error: 'Invalid URL format. Expected: /all, /{provinsi}, /{provinsi}/{kota}, or /{provinsi}/{kota}/{kecamatan}' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('children_data')
      .select(`
        id,
        stunting,
        alamat_id,
        alamat:alamat_id (
          longitude,
          latitude,
          state,
          city,
          city_district
        )
      `)
      .not('alamat_id', 'is', null);

    let statsData: any = {};
    let recommendations: any = null;

    // Handle /all endpoint - data seluruh negara
    if (pathSegments.length === 1 && pathSegments[0].toLowerCase() === 'all') {
      const { data, error } = await query
        .not('alamat_id', 'is', null)
        .not('alamat', 'is', null);

      if (error) {
        throw new Error('Failed to fetch all data');
      }

      // Filter by user role and kecamatan
      let filteredData = data;
      if (userRole === 'puskesmas' && userKecamatan) {
        filteredData = filteredData.filter((child: any) => 
          child.alamat && child.alamat.city_district && child.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())
        );
      }

      const totalChildren = filteredData.length;
      const totalStunting = filteredData.filter(child => child.stunting === true).length;
      const groupedByProvince = groupByProvince(filteredData);

      statsData = {
        level: 'country',
        location: 'Indonesia',
        totalChildren,
        totalStunting,
        stuntingRate: totalChildren > 0 ? ((totalStunting / totalChildren) * 100).toFixed(2) : '0.00',
        groupedByProvince,
        data: filteredData
      };

    } else if (pathSegments.length === 1) {
      // Level 1: Provinsi
      const province = normalizeProvince(pathSegments[0]);
      
      const { data, error } = await query
        .not('alamat_id', 'is', null)
        .not('alamat', 'is', null)
        .ilike('alamat.state', `%${province}%`);

      if (error) {
        throw new Error('Failed to fetch province data');
      }

      // Filter by user role and kecamatan
      let filteredData = data;
      if (userRole === 'puskesmas' && userKecamatan) {
        filteredData = filteredData.filter((child: any) => 
          child.alamat && child.alamat.city_district && child.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())
        );
      }

      const totalChildren = filteredData.length;
      const totalStunting = filteredData.filter(child => child.stunting === true).length;
      const groupedByCity = groupByCity(filteredData);

      const longitude = filteredData.length > 0 ? (filteredData[0] as any)?.alamat?.longitude : null;
      const latitude = filteredData.length > 0 ? (filteredData[0] as any)?.alamat?.latitude : null;

      statsData = {
        level: 'province',
        location: province,
        totalChildren,
        totalStunting,
        stuntingRate: totalChildren > 0 ? ((totalStunting / totalChildren) * 100).toFixed(2) : '0.00',
        longitude,
        latitude,
        groupedByCity,
        data: filteredData,
      };

    } else if (pathSegments.length === 2) {
      // Level 2: Kota
      const province = normalizeProvince(pathSegments[0]);
      const city = normalizeCity(pathSegments[1]);
      
      const { data, error } = await query
        .not('alamat_id', 'is', null)
        .not('alamat', 'is', null)
        .ilike('alamat.state', `%${province}%`)
        .ilike('alamat.city', `%${city}%`);

      if (error) {
        throw new Error('Failed to fetch city data');
      }

      // Filter by user role and kecamatan
      let filteredData = data;
      if (userRole === 'puskesmas' && userKecamatan) {
        filteredData = filteredData.filter((child: any) => 
          child.alamat && child.alamat.city_district && child.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())
        );
      }

      const totalChildren = filteredData.length;
      const totalStunting = filteredData.filter(child => child.stunting === true).length;
      const groupedByDistrict = groupByDistrict(filteredData);

      const longitude = filteredData.length > 0 ? (filteredData[0] as any)?.alamat?.longitude : null;
      const latitude = filteredData.length > 0 ? (filteredData[0] as any)?.alamat?.latitude : null;

      statsData = {
        level: 'city',
        location: { province, city },
        totalChildren,
        totalStunting,
        stuntingRate: totalChildren > 0 ? ((totalStunting / totalChildren) * 100).toFixed(2) : '0.00',
        longitude,
        latitude,
        groupedByDistrict,
        data: filteredData,
      };

    } else if (pathSegments.length === 3) {
      // Level 3: Kecamatan
      const province = normalizeProvince(pathSegments[0]);
      const city = normalizeCity(pathSegments[1]);
      const district = pathSegments[2];
      
      const { data, error } = await query
        .not('alamat_id', 'is', null)
        .not('alamat', 'is', null)
        .ilike('alamat.state', `%${province}%`)
        .ilike('alamat.city', `%${city}%`)
        .ilike('alamat.city_district', `%${district}%`);

      if (error) {
        throw new Error('Failed to fetch district data');
      }

      // Filter by user role and kecamatan
      let filteredData = data;
      if (userRole === 'puskesmas' && userKecamatan) {
        filteredData = filteredData.filter((child: any) => 
          child.alamat && child.alamat.city_district && child.alamat.city_district.toLowerCase().includes(userKecamatan.toLowerCase())
        );
      }

      const totalChildren = filteredData.length;
      const totalStunting = filteredData.filter(child => child.stunting === true).length;

      const longitude = filteredData.length > 0 ? (filteredData[0] as any)?.alamat?.longitude : null;
      const latitude = filteredData.length > 0 ? (filteredData[0] as any)?.alamat?.latitude : null;

      statsData = {
        level: 'district',
        location: { province, city, district },
        totalChildren,
        totalStunting,
        stuntingRate: totalChildren > 0 ? ((totalStunting / totalChildren) * 100).toFixed(2) : '0.00',
        longitude,
        latitude,
        data: filteredData,
      };

    } else {
      return NextResponse.json(
        { error: 'Invalid URL format. Expected: /all, /{provinsi}, /{provinsi}/{kota}, or /{provinsi}/{kota}/{kecamatan}' },
        { status: 400 }
      );
    }

    // Generate policy recommendations using the stats data
    try {
      const location = {
        level: statsData.level as 'country' | 'province' | 'city' | 'district',
        name: typeof statsData.location === 'string' ? statsData.location : 
              statsData.location?.province || statsData.location?.city || statsData.location?.district || 'Unknown',
        province: statsData.location?.province,
        city: statsData.location?.city,
        district: statsData.location?.district
      };

      const policyData = {
        totalChildren: statsData.totalChildren,
        totalStunting: statsData.totalStunting,
        stuntingRate: parseFloat(statsData.stuntingRate),
        location,
        groupedData: statsData.groupedByProvince || statsData.groupedByCity || statsData.groupedByDistrict
      };

      recommendations = await getPolicyRecommendations(policyData);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Continue without recommendations if Gemini fails
    }

    return NextResponse.json({
      ...statsData,
      recommendations
    });

  } catch (error) {
    console.error('Error fetching stats with recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics with recommendations' },
      { status: 500 }
    );
  }
}
