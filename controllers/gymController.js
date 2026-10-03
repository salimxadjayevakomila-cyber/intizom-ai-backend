// O'zbekistondagi eng mashhur va asosiy sport zallari ro'yxati (Maksimum 15 ta)
const localGyms = [
  {
    id: 1,
    name: "Chekhov Sport Club (Central)",
    lat: 41.3111,
    lng: 69.2797,
    address: "Toshkent sh., Mirobod t., Chekhov ko'chasi, 40",
    phone: "+998 71 200 07 07"
  },
  {
    id: 2,
    name: "BeFit Fitness & Wellness",
    lat: 41.3255,
    lng: 69.2608,
    address: "Toshkent sh., Shayxontohur t., Koratosh ko'chasi, 5A",
    phone: "+998 71 200 00 44"
  },
  {
    id: 3,
    name: "BeFit Sky",
    lat: 41.3001,
    lng: 69.2431,
    address: "Toshkent sh., Yakkasaroy t., Bobur ko'chasi, 40",
    phone: "+998 71 200 00 44"
  },
  {
    id: 4,
    name: "Buka Gym",
    lat: 41.2882,
    lng: 69.2715,
    address: "Toshkent sh., Mirobod t., Nukus ko'chasi, 29",
    phone: "+998 90 999 99 99"
  },
  {
    id: 5,
    name: "ProForm Fitness Club",
    lat: 41.3150,
    lng: 69.2885,
    address: "Toshkent sh., Mirzo Ulug'bek t., Sodiq Azimov ko'chasi, 68",
    phone: "+998 71 205 05 05"
  },
  {
    id: 6,
    name: "McFit Tashkent",
    lat: 41.3402,
    lng: 69.2862,
    address: "Toshkent sh., Yunusobod t., Amir Temur shox ko'chasi",
    phone: "+998 90 123 45 67"
  },
  {
    id: 7,
    name: "Atmosphere Fitness",
    lat: 41.2985,
    lng: 69.2220,
    address: "Toshkent sh., Chilonzor t., Qatortol ko'chasi, 28",
    phone: "+998 71 200 11 22"
  },
  {
    id: 8,
    name: "Ozone Fitness",
    lat: 41.3298,
    lng: 69.3301,
    address: "Toshkent sh., Yashnobod t., Parkent ko'chasi, 180",
    phone: "+998 71 207 00 00"
  },
  {
    id: 9,
    name: "Power Fitness Club",
    lat: 41.2750,
    lng: 69.2012,
    address: "Toshkent sh., Sergeli t., Yangi Sergeli ko'chasi",
    phone: "+998 90 888 77 66"
  },
  {
    id: 10,
    name: "Gold's Gym Tashkent",
    lat: 41.3105,
    lng: 69.2550,
    address: "Toshkent sh., Yakkasaroy t., Shota Rustaveli ko'chasi",
    phone: "+998 71 211 22 33"
  },
  {
    id: 11,
    name: "Iron Club Fitness",
    lat: 41.3620,
    lng: 69.2910,
    address: "Toshkent sh., Yunusobod 11-mavze",
    phone: "+998 97 777 00 11"
  },
  {
    id: 12,
    name: "Chekhov Sport Club (Samarqand)",
    lat: 39.6542,
    lng: 66.9597,
    address: "Samarqand sh., Dagbit ko'chasi, 12",
    phone: "+998 66 200 07 07"
  },
  {
    id: 13,
    name: "BeFit Pro Samarqand",
    lat: 39.6601,
    lng: 66.9750,
    address: "Samarqand sh., Universitet xiyoboni",
    phone: "+998 66 200 00 44"
  },
  {
    id: 14,
    name: "Atlas Fitness Namangan",
    lat: 40.9983,
    lng: 71.6726,
    address: "Namangan sh., Navoi ko'chasi, 15",
    phone: "+998 69 200 12 34"
  },
  {
    id: 15,
    name: "Champion Gym Farg'ona",
    lat: 40.3864,
    lng: 71.7864,
    address: "Farg'ona sh., Al-Farg'oniy ko'chasi, 42",
    phone: "+998 73 200 55 66"
  }
];

// O'zbekistondagi eng yaqin / asosiy 15 ta sport zalni olish
exports.getNearbyGyms = async (req, res) => {
  try {
    // Ko'proq 15 ta zal ro'yxatini qaytaramiz
    const gyms = localGyms.slice(0, 15);

    res.status(200).json({
      success: true,
      count: gyms.length,
      data: gyms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sport zallarni olishda xatolik yuz berdi",
      error: error.message
    });
  }
};