const { messaging } = require("firebase-admin");
const AttractionService = require("../services/attractionService");
const RestaurantService = require("../services/restaurantService");
// hàm tính khoảng cách giữa 2 địa điểm theo đường thẳng (công thức haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(minutes % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
}
function estimateTravelTime(from, to) {
  const distance = haversineDistance(
    parseFloat(from.latitude),
    parseFloat(from.longitude),
    parseFloat(to.latitude),
    parseFloat(to.longitude)
  );
  const speed = 30; // km/h
  return (distance / speed) * 60;
}

function planSchedule(
  attractions,
  restaurants,
  startTime = "08:00",
  endTime = "20:00"
) {
  // let currentTime = timeToMinutes(startTime);
  // const endTimeMinutes = timeToMinutes(endTime);
  // const schedule = [];

  // for (let i = 0; i < attractions.length; i++) {
  //   const current = attractions[i];
  //   const prev = i === 0 ? null : attractions[i - 1];

  //   let travelMinutes = 0;
  //   if (prev) {
  //     const distance = haversineDistance(
  //       parseFloat(prev.latitude), parseFloat(prev.longitude),
  //       parseFloat(current.latitude), parseFloat(current.longitude)
  //     );
  //     const speed = 30; // tốc độ trung bình, cái này sau này tính tiếp
  //     travelMinutes = (distance / speed) * 60;
  //   }

  //   const visitMinutes = current.visit_duration || 60;
  //   const arrivalTime = currentTime + travelMinutes;

  //   if (arrivalTime + visitMinutes > endTimeMinutes) {
  //     break;
  //   }

  //   schedule.push({
  //     name: current.name,
  //     arrival_time: minutesToTime(arrivalTime),
  //     visit_duration: visitMinutes,
  //     departure_time: minutesToTime(arrivalTime + visitMinutes),
  //     travel_from_prev_minutes: Math.round(travelMinutes)
  //   });

  //   currentTime = arrivalTime + visitMinutes;
  // }
  // return schedule;

  const DayStart = timeToMinutes(startTime); // 540
  const LunchStart = timeToMinutes("11:00"); // 660
  const LunchEnd = timeToMinutes("13:00"); // 780
  const DayEnd = timeToMinutes(endTime); // 900

  let currentTime = DayStart;
  const schedule = [];

  // Slot A: trước giờ ăn
  for (let i = 0; i < attractions.length; i++) {
    console.log("a");
    const prev = i === 0 ? null : attractions[i - 1];
    const curr = attractions[i];
    const travel = prev ? estimateTravelTime(prev, curr) : 0;
    const visit = curr.visit_duration || 60;

    const arrival = currentTime + travel;
    const departure = arrival + visit;

    if (departure > LunchStart) break;

    schedule.push({
      type: "attraction",
      name: curr.name,
      arrival_time: minutesToTime(arrival),
      departure_time: minutesToTime(departure),
      duration_minutes: visit,
      travel_from_prev_minutes: Math.round(travel),
      average_rating: curr.average_rating,
      rating_total: curr.rating_total,
      tags: curr.tags,
      image_url: curr.image_url,
      latitude: curr.latitude,
      longitude: curr.longitude,
    });

    currentTime = departure;
  }

  // Slot B: ăn trưa từ 11h đến 13h
  const restaurant = restaurants[0];
  console.log("B"); // chọn nhà hàng đầu tiên
  if (restaurant) {
    schedule.push({
      type: "restaurant",
      name: restaurant.name,
      arrival_time: minutesToTime(LunchStart),
      departure_time: minutesToTime(LunchEnd),
      duration_minutes: 120,
      travel_from_prev_minutes:
        currentTime > LunchStart
          ? estimateTravelTime(schedule.at(-1), restaurant)
          : 0,
      average_rating: restaurant.average_rating,
      rating_total: restaurant.rating_total,
      image_url: restaurant.image_url,
      tags: restaurant.tags,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    });
    console.log("c");
  }

  currentTime = LunchEnd;

  // Slot C: sau giờ ăn
  console.log("C");

  for (let i = 0; i < attractions.length; i++) {
    if (currentTime > endTime) break;
    const curr = attractions[i];
    if (schedule.find((s) => s.name === curr.name)) continue; // bỏ qua nếu đã đc gọi tới từ trước
    const prev = schedule.at(-1);

    const travel = prev ? estimateTravelTime(prev, curr) : 0;
    const visit = curr.visit_duration || 60;
    const arrival = currentTime + travel;
    const departure = arrival + visit;

    if (departure > DayEnd) break;

    schedule.push({
      type: "attraction",
      name: curr.name,
      arrival_time: minutesToTime(arrival),
      departure_time: minutesToTime(departure),
      duration_minutes: visit,
      travel_from_prev_minutes: Math.round(travel),
      average_rating: curr.average_rating,
      rating_total: curr.rating_total,
      tags: curr.tags,
      image_url: curr.image_url,
      latitude: curr.latitude,
      longitude: curr.longitude,
    });

    currentTime = departure;
  }
  return schedule;
}

// Lấy tất cả địa điểm tham quan
exports.getAllAttractions = async (req, res, next) => {
  try {
    const attractions = await AttractionService.getAllAttractions();
    res.status(200).json(attractions);
  } catch (error) {
    next(error);
  }
};

// Lấy địa điểm theo ID
exports.getAttractionById = async (req, res, next) => {
  try {
    const attraction = await AttractionService.getAttractionById(
      req.params.attractionId
    );
    if (!attraction)
      return res.status(404).json({ message: "Địa điểm không tồn tại" });
    res.status(200).json(attraction);
  } catch (error) {
    next(error);
  }
};

exports.getAttractionRank = async (req, res, next) => {
  try {
    const attractionId = parseInt(req.params.attractionId);
    const rank = await AttractionService.getAttractionRank(attractionId);

    if (!rank) {
      return res.status(404).json({ message: "Attraction not found!" });
    }
    res.status(200).json({ attraction_id: attractionId, rank });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyTopAttractions = async (req, res, next) => {
  try {
    const attractionId = parseInt(req.params.attractionId);
    const nearbyTopAttractions =
      await AttractionService.getNearbyTopAttractions(attractionId);
    if (!nearbyTopAttractions || nearbyTopAttractions.length === 0) {
      return res.status(200).json({
        nearbyTopAttractions: [],
        message: "No nearby attractions found within 4km",
      });
    }
    res.status(200).json({ nearbyTopAttractions });
  } catch (error) {
    next(error);
  }
};

exports.getAttractionsByTags = async (req, res, next) => {
  try {
    const { city } = req.query;
    let { tags } = req.query;

    const { startTime, endTime } = req.query;
    let { res_tag } = req.query;
    console.log(res_tag);
    if (!tags) {
      return res.status(400).json({ message: "City and tags are required" });
    }

    // Nếu tags có nhiều hơn 1
    if (typeof tags === "string" && tags.trim().startsWith("[")) {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Tags must be a valid JSON array" });
      }
    }

    if (typeof res_tag === "string" && res_tag.trim().startsWith("[")) {
      try {
        res_tag = JSON.parse(res_tag);
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Tags must be a valid JSON array" });
      }
    }

    // Xuwr lí khi chỉ truyền vào 1 tag
    if (typeof tags === "string") {
      tags = [tags];
    }
    if (typeof res_tag === "string") {
      res_tag = [res_tag];
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    const attractions = await AttractionService.getAttractionsByTags(
      city,
      tags
    );
    const restaurants = await RestaurantService.getRestaurantByTags(
      city,
      res_tag
    );

    if (
      !attractions ||
      attractions.length === 0 ||
      !restaurants ||
      restaurants.length === 0
    ) {
      return res.status(404).json({
        message: "No attractions or restaurants found for the given filters",
      });
    }

    const schedule = planSchedule(
      attractions,
      restaurants,
      startTime || "08:00",
      endTime || "20:00"
    );
    res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
};

exports.getSpecialAttractionsByCity = async (req, res, next) => {
  try {
    const { city_id } = req.params;
    const attractions = await AttractionService.getSpecialAttractionsByCity(
      city_id
    );
    res.status(200).json(attractions);
  } catch (error) {
    next(error);
  }
};

// Tạo mới địa điểm
exports.createAttraction = async (req, res, next) => {
  try {
    const newAttraction = await AttractionService.createAttraction(req.body);
    res.status(201).json(newAttraction);
  } catch (error) {
    next(error);
  }
};

// Cập nhật địa điểm
exports.updateAttraction = async (req, res, next) => {
  try {
    const updatedAttraction = await AttractionService.updateAttraction(
      req.params.attractionId,
      req.body
    );
    res.status(200).json(updatedAttraction);
  } catch (error) {
    next(error);
  }
};

// Xóa địa điểm
exports.deleteAttraction = async (req, res, next) => {
  try {
    await AttractionService.deleteAttraction(req.params.attractionId);
    res.status(204).json({ message: "Đã xóa thành công" });
  } catch (error) {
    next(error);
  }
};

exports.searchAttractions = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });
    }

    const attractions = await AttractionService.searchAttractions(query);
    res.status(200).json(attractions);
  } catch (error) {
    next(error);
  }
};
