// const axios = require("axios");
// const { Op } = require("sequelize");
// const { Sequelize } = require("sequelize");
// const RestaurantModel = require("../models/restaurant");
// const AttractionModel = require("../models/attraction");
// const sequelize = new Sequelize(
//   "postgres://postgres:123456@localhost:5432/PBL5",
//   {
//     dialect: "postgres",
//     logging: false,
//   }
// );

// const Restaurant = RestaurantModel(sequelize);
// const Attraction = AttractionModel(sequelize);
// const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAP_API;

// function generateGrid(centerLat, centerLng, stepLat, stepLng, numSteps) {
//   const gridPoints = [];
//   for (let i = -numSteps; i <= numSteps; i++) {
//     for (let j = -numSteps; j <= numSteps; j++) {
//       const lat = centerLat + i * stepLat;
//       const lng = centerLng + j * stepLng;
//       gridPoints.push({ lat, lng });
//     }
//   }
//   return gridPoints;
// }

// function generateTagsFromTypes(place, cityName) {
//   const tags = [];

//   const typeMap = {
//     restaurant: "Nhà hàng",
//     cafe: "Quán cà phê",
//     bar: "Quán bar",
//     museum: "Bảo tàng",
//     art_gallery: "Phòng tranh",
//     park: "Công viên",
//     church: "Nhà thờ",
//     hindu_temple: "Đền thờ",
//     buddhist_temple: "Chùa",
//     zoo: "Sở thú",
//     lodging: "Khách sạn",
//     shopping_mall: "Trung tâm thương mại",
//     movie_theater: "Rạp chiếu phim",
//     amusement_park: "Công viên giải trí",
//     tourist_attraction: "Điểm du lịch",
//     bakery: "Tiệm bánh",
//     food: "Ẩm thực",
//     supermarket: "Siêu thị",
//   };

//   // Duyệt qua tất cả type của địa điểm
//   if (Array.isArray(place.types)) {
//     place.types.forEach((type) => {
//       if (typeMap[type] && !tags.includes(typeMap[type])) {
//         tags.push(typeMap[type]);
//       }
//     });
//   }

//   // Thêm tên thành phố
//   tags.push(cityName);

//   return tags;
// }

// exports.getRestaurant_infor = async (req, res) => {
//   console.time("Thời gian chạy hàm");
//   try {
//     const cities = [
//       // { city_id: 1, name: "Hà Nội", lat: 21.0285, lng: 105.8542},
//       // {
//       //   city_id: 2,
//       //   name: "TP. Hồ Chí Minh",
//       //   lat: 10.7769,
//       //   lng: 106.7009
//       // },
//       // { city_id: 3, name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
//       // { city_id: 4, name: "Hải Phòng", lat: 20.844911, lng: 106.688084 },
//       // { city_id: 5, name: "Cần Thơ", lat: 10.045162, lng: 105.746857 },
//       // { city_id: 6, name: "Huế", lat: 16.463713, lng: 107.590866 },
//       // { city_id: 7, name: "Nha Trang", lat: 12.238791, lng: 109.196749 },
//       // { city_id: 8, name: "Đà Lạt", lat: 11.940419, lng: 108.458313 },
//       // { city_id: 9, name: "Vũng Tàu", lat: 10.346, lng: 107.0843 },
//       // { city_id: 10, name: "Phú Quốc", lat: 10.2899, lng: 103.9840 }

//       { city_id: 11, name: "Biên Hòa", lat: 10.94469, lng: 106.824997 },
//       { city_id: 12, name: "Buôn Ma Thuột", lat: 12.666097, lng: 108.038247 },
//       { city_id: 13, name: "Thái Nguyên", lat: 21.594222, lng: 105.848194 },
//       { city_id: 14, name: "Long Xuyên", lat: 10.386393, lng: 105.435211 },
//       { city_id: 15, name: "Rạch Giá", lat: 10.012378, lng: 105.080933 },
//       // { city_id: 16, name: "Việt Trì", lat: 21.322739, lng: 105.402381 },
//       // { city_id: 17, name: "Nam Định", lat: 20.438821, lng: 106.162105 },
//       // { city_id: 18, name: "Thanh Hóa", lat: 19.807942, lng: 105.776329 },
//       // { city_id: 19, name: "Quảng Ngãi", lat: 15.120152, lng: 108.792236 },
//       // { city_id: 20, name: "Pleiku", lat: 13.983073, lng: 108.001678 }
//     ];

//     const radius = 2000; // 3km
//     const stepLat = 0.01;
//     const stepLng = 0.01;
//     const numSteps = 4;

//     let totalFetched = 0;
//     let totalSaved = 0;
//     let totalSkipped = 0;

//     for (const city of cities) {
//       const gridPoints = generateGrid(
//         city.lat,
//         city.lng,
//         stepLat,
//         stepLng,
//         numSteps
//       );
//       let allPlaces = [];

//       for (const point of gridPoints) {
//         let nextPageToken = null;
//         let attempts = 0;

//         do {
//           const params = {
//             location: `${point.lat},${point.lng}`,
//             radius,
//             type: "restaurant",
//             key: GOOGLE_MAPS_API_KEY,
//           };

//           if (nextPageToken) {
//             params.pagetoken = nextPageToken;
//             await new Promise((resolve) => setTimeout(resolve, 2000));
//           }

//           const response = await axios.get(
//             "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
//             { params }
//           );

//           const places = response.data.results || [];
//           allPlaces = allPlaces.concat(places);
//           nextPageToken = response.data.next_page_token;
//           attempts++;
//         } while (nextPageToken && attempts < 3);
//       }

//       const uniquePlacesMap = new Map();
//       for (const place of allPlaces) {
//         const key = `${place.name}-${place.geometry.location.lat}-${place.geometry.location.lng}`;
//         if (!uniquePlacesMap.has(key)) {
//           uniquePlacesMap.set(key, place);
//         }
//       }

//       const uniquePlaces = Array.from(uniquePlacesMap.values());

//       const restaurants = uniquePlaces.map((place) => ({
//         restaurant_id: null,
//         name: place.name || "Unknown",
//         description: place.vicinity || null,
//         latitude: place.geometry.location.lat,
//         longitude: place.geometry.location.lng,
//         city_id: city.city_id, // ID thành phố Huế
//         address: place.vicinity || null,
//         phone_number: null,
//         open_time: "08:00:00",
//         close_time: "22:00:00",
//         rating_total: place.user_ratings_total || 0,
//         average_rating: place.rating || 0,
//         image_url: Array.isArray(place.photos)
//           ? place.photos.map(
//               (photo) =>
//                 `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1920&photo_reference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
//             )
//           : [],
//         tags: ["Nhà hàng", city.name],
//         reservation_required: false,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       }));

//       console.log(`Thành phố ${city.name} có ${restaurants.length} nhà hàng.`);

//       const existingAttractions = await Restaurant.findAll({
//         where: {
//           name: {
//             [Op.in]: restaurants.map((a) => a.name),
//           },
//         },
//       });

//       const existingNames = existingAttractions.map((a) => a.name);
//       const newAttractions = restaurants.filter(
//         (a) => !existingNames.includes(a.name)
//       );

//       if (newAttractions.length > 0) {
//         await Restaurant.bulkCreate(newAttractions);
//       }

//       totalFetched += restaurants.length;
//       totalSaved += newAttractions.length;
//       totalSkipped += existingNames.length;
//     }

//     res.json({
//       message: "Đã lưu các nhà hàng vào database!",
//       totalFetched,
//       totalSaved,
//       totalSkipped,
//       citiesProcessed: cities.length,
//     });
//   } catch (error) {
//     console.error(
//       "Lỗi khi lấy dữ liệu từ Google Maps API:",
//       error.message || error
//     );
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Lỗi khi lấy dữ liệu từ Google Maps API" });
//     }
//   }
//   console.timeEnd("Thời gian chạy hàm");
// };

// exports.getAttraction_infor = async (req, res) => {
//   console.time("Thời gian chạy hàm");
//   try {
//     const cities = [
//       // { city_id: 1, name: "Hà Nội", lat: 21.0285, lng: 105.8542},
//       // {
//       //   city_id: 2,
//       //   name: "TP. Hồ Chí Minh",
//       //   lat: 10.7769,
//       //   lng: 106.7009
//       // }
//       // { city_id: 3, name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
//       // { city_id: 4, name: "Hải Phòng", lat: 20.844911, lng: 106.688084 },
//       // { city_id: 5, name: "Cần Thơ", lat: 10.045162, lng: 105.746857 },
//       // { city_id: 6, name: "Huế", lat: 16.463713, lng: 107.590866 },
//       // { city_id: 7, name: "Nha Trang", lat: 12.238791, lng: 109.196749 },
//       // { city_id: 8, name: "Đà Lạt", lat: 11.940419, lng: 108.458313 },
//       // { city_id: 9, name: "Vũng Tàu", lat: 10.346, lng: 107.0843 },
//       // { city_id: 10, name: "Phú Quốc", lat: 10.2899, lng: 103.9840 }
//       // { city_id: 11, name: "Biên Hòa", lat: 10.944690, lng: 106.824997 },
//       { city_id: 12, name: "Buôn Ma Thuột", lat: 12.666097, lng: 108.038247 },
//     ];

//     const radius = 2000; // 3km
//     const stepLat = 0.01;
//     const stepLng = 0.01;
//     const numSteps = 4;

//     let totalFetched = 0;
//     let totalSaved = 0;
//     let totalSkipped = 0;

//     for (const city of cities) {
//       const gridPoints = generateGrid(
//         city.lat,
//         city.lng,
//         stepLat,
//         stepLng,
//         numSteps
//       );
//       let allPlaces = [];

//       for (const point of gridPoints) {
//         let nextPageToken = null;
//         let attempts = 0;

//         do {
//           const params = {
//             location: `${point.lat},${point.lng}`,
//             radius,
//             type: "tourist_attraction",
//             key: GOOGLE_MAPS_API_KEY,
//           };

//           if (nextPageToken) {
//             params.pagetoken = nextPageToken;
//             await new Promise((resolve) => setTimeout(resolve, 2000));
//           }

//           const response = await axios.get(
//             "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
//             { params }
//           );

//           const places = response.data.results || [];
//           allPlaces = allPlaces.concat(places);
//           nextPageToken = response.data.next_page_token;
//           attempts++;
//         } while (nextPageToken && attempts < 3);
//       }

//       const uniquePlacesMap = new Map();
//       for (const place of allPlaces) {
//         const key = `${place.name}-${place.geometry.location.lat}-${place.geometry.location.lng}`;
//         if (!uniquePlacesMap.has(key)) {
//           uniquePlacesMap.set(key, place);
//         }
//       }

//       const uniquePlaces = Array.from(uniquePlacesMap.values());

//       const attractions = uniquePlaces.map((place) => ({
//         attraction_id: null,
//         name: place.name || "Unknown",
//         description: place.vicinity || null,
//         latitude: place.geometry.location.lat,
//         longitude: place.geometry.location.lng,
//         city_id: city.city_id,
//         address: place.vicinity || null,
//         average_rating: place.rating || 0,
//         rating_total: place.user_ratings_total || 0,
//         image_url: Array.isArray(place.photos)
//           ? place.photos.map(
//               (photo) =>
//                 `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1920&photo_reference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
//             )
//           : [],
//         tags: Array.isArray(place.types)
//           ? [...place.types, city.name]
//           : [city.name],
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       }));

//       console.log(`Thành phố ${city.name} có ${attractions.length} địa điểm.`);

//       const existingAttractions = await Attraction.findAll({
//         where: {
//           name: {
//             [Op.in]: attractions.map((a) => a.name),
//           },
//         },
//       });

//       const existingNames = existingAttractions.map((a) => a.name);
//       const newAttractions = attractions.filter(
//         (a) => !existingNames.includes(a.name)
//       );

//       if (newAttractions.length > 0) {
//         await Attraction.bulkCreate(newAttractions);
//       }

//       totalFetched += attractions.length;
//       totalSaved += newAttractions.length;
//       totalSkipped += existingNames.length;
//     }

//     res.json({
//       message: "Đã lưu các địa điểm du lịch vào database!",
//       totalFetched,
//       totalSaved,
//       totalSkipped,
//       citiesProcessed: cities.length,
//     });
//   } catch (error) {
//     console.error(
//       "Lỗi khi lấy dữ liệu từ Google Maps API:",
//       error.message || error
//     );
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Lỗi khi lấy dữ liệu từ Google Maps API" });
//     }
//   }
//   console.timeEnd("Thời gian chạy hàm");
// };

// // const existingData = new Set(existingRestaurants.map((r) => `${r.name}-${r.latitude}-${r.longitude}`));

// // const newRestaurants = restaurants.filter(
// //   (r) => !existingData.has(`${r.name}-${r.latitude}-${r.longitude}`)
// // );

// // try {
// //   const centerLat = 16.047079; // Tọa độ Huế
// //   const centerLng = 108.206230;
// //   const radius = 2000; // mét
// //   const stepLat = 0.02; // ~1km
// //   const stepLng = 0.02;
// //   const numSteps = 2; // Lưới 5x5 = 25 điểm

// //   const gridPoints = generateGrid(centerLat, centerLng, stepLat, stepLng, numSteps);
// //   let allPlaces = [];

// //   for (const point of gridPoints) {
// //     let nextPageToken = null;
// //     let attempts = 0;

// //     do {
// //       const params = {
// //         location: `${point.lat},${point.lng}`,
// //         radius,
// //         type: "restaurant",
// //         key: GOOGLE_MAPS_API_KEY,
// //       };

// //       if (nextPageToken) {
// //         params.pagetoken = nextPageToken;
// //         await new Promise((resolve) => setTimeout(resolve, 2000));
// //       }

// //       const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", { params });

// //       const places = response.data.results || [];
// //       allPlaces = allPlaces.concat(places);
// //       nextPageToken = response.data.next_page_token;
// //       attempts++;
// //     } while (nextPageToken && attempts < 3);
// //   }
// //   const uniquePlacesMap = new Map();
// //   for (const place of allPlaces) {
// //     const key = `${place.name}-${place.geometry.location.lat}-${place.geometry.location.lng}`;
// //     if (!uniquePlacesMap.has(key)) {
// //       uniquePlacesMap.set(key, place);
// //     }
// //   }
// //   const uniquePlaces = Array.from(uniquePlacesMap.values());

// //   console.log("Tổng số nhà hàng thu được:", restaurants.length);

// //   // Kiểm tra trùng lặp trong DB
// //   const existingRestaurants = await Restaurant.findAll({
// //     where: {
// //       name: {
// //         [Op.in]: restaurants.map((r) => r.name),
// //       },
// //     },
// //   });

// //   const existingNames = existingRestaurants.map((r) => r.name);
// //   const newRestaurants = restaurants.filter((r) => !existingNames.includes(r.name));

// //   console.log("Số lượng nhà hàng mới:", newRestaurants.length);

// //   if (newRestaurants.length > 0) {
// //     await Restaurant.bulkCreate(newRestaurants);
// //   }

// //   res.json({
// //     message: "Đã lưu các nhà hàng vào database!",
// //     saved: newRestaurants.length,
// //     skipped: existingNames.length,
// //     totalFetched: restaurants.length,
// //     totalNewSaved: newRestaurants.length,
// //   });
// // } catch (error) {
// //   console.error("Lỗi khi lấy dữ liệu từ Google Maps API:", error.message || error);
// //   if (!res.headersSent) {
// //     res.status(500).json({ error: "Lỗi khi lấy dữ liệu từ Google Maps API" });
// //   }
// // }
