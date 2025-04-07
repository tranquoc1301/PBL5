const AttractionService = require("../services/attractionService");

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


exports.getSpecialAttractionsByCity = async (req, res, next) => {
  try {
    const { city_id } = req.params;
    const attractions = await AttractionService.getSpecialAttractionsByCity(city_id);
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
