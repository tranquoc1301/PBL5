const { cloudinaryInstance } = require("./../config/configureCloudinary");
const ReviewModel = require("../models/review");
const { Op } = require("sequelize");

class ReviewService {
  constructor(sequelize) {
    this.Review = ReviewModel(sequelize);
  }

  // Upload ảnh lên Cloudinary và trả về mảng URL
  async uploadPhotosToCloudinary(photos, attraction_id, restaurant_id) {
    if (!photos || !Array.isArray(photos)) return [];
    let folder = "review"; // Thư mục gốc

    if (attraction_id) {
      folder += `/attraction/${attraction_id}`;
    } else if (restaurant_id) {
      folder += `/restaurant/${restaurant_id}`;
    }

    // Upload ảnh lên Cloudinary
    const uploadPromises = photos.map(async (photo, index) => {
      try {
        // Giả sử photo là base64 string (từ multer hoặc client)
        const result = await cloudinaryInstance.uploader.upload(photo, {
          folder: folder,
          public_id: `review_photo_${Date.now()}_${index}`,
          resource_type: "image",
        });
        return result.secure_url; // Trả về URL an toàn
      } catch (error) {
        console.error(`Failed to upload photo ${index}:`, error);
        return null; // Bỏ qua ảnh lỗi
      }
    });

    const urls = await Promise.all(uploadPromises);
    return urls.filter((url) => url !== null); // Lọc bỏ URL null
  }

  // Xóa ảnh khỏi Cloudinary
  async deletePhotosFromCloudinary(photos) {
    if (!photos || !Array.isArray(photos)) return;

    const deletePromises = photos.map(async (photoUrl) => {
      try {
        // Extract public_id from URL (e.g., 'attraction/123/review_photo_xxx' or 'review/review_photo_xxx')
        const urlParts = photoUrl.split("/");
        const fileName = urlParts.pop().split(".")[0]; // Get file name without extension
        const folderPath = urlParts
          .slice(urlParts.indexOf("upload") + 1)
          .join("/"); // Get folder path after 'upload'
        const publicId = `${folderPath}/${fileName}`.replace("/v[0-9]+/", ""); // Remove version part if present
        await cloudinaryInstance.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Failed to delete photo ${photoUrl}:`, error);
      }
    });

    await Promise.all(deletePromises);
  }

  async getAllReviews() {
    try {
      return await this.Review.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
  }

  async getReviewsByAttractionId(attraction_id) {
    if (!attraction_id || isNaN(attraction_id)) {
      throw new Error("Invalid attraction id");
    }
    try {
      return await this.Review.findAll({
        where: { attraction_id },
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch reviews for attraction: ${error.message}`
      );
    }
  }

  async getReviewsByRestaurantId(restaurant_id) {
    if (!restaurant_id || isNaN(restaurant_id)) {
      throw new Error("Invalid restaurant id");
    }
    try {
      return await this.Review.findAll({
        where: { restaurant_id },
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch reviews for restaurant: ${error.message}`
      );
    }
  }

  async createReview(reviewData) {
    const {
      user_id,
      attraction_id,
      restaurant_id,
      rating,
      title,
      comment,
      visit_type,
      companion,
      purpose,
      photos,
    } = reviewData;

    if (!user_id) {
      throw new Error("User authentication required");
    }

    if (!attraction_id && !restaurant_id) {
      throw new Error("Either attraction_id or restaurant_id is required");
    }

    // Upload ảnh lên Cloudinary with appropriate folder
    const photoUrls = await this.uploadPhotosToCloudinary(
      photos,
      attraction_id,
      restaurant_id
    );

    const data = {
      user_id,
      rating,
      title,
      comment,
      visit_type,
      companion,
      photos: photoUrls, // Lưu mảng URL vào JSONB
      attraction_id: attraction_id || null,
      restaurant_id: restaurant_id || null,
    };

    if (restaurant_id) {
      data.purpose = purpose;
    }

    try {
      return await this.Review.create(data);
    } catch (error) {
      // Xóa ảnh đã upload nếu tạo review thất bại
      await this.deletePhotosFromCloudinary(photoUrls);
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  async updateReview(id, user_id, updateData) {
    try {
      const review = await this.Review.findByPk(id);
      if (!review) {
        throw new Error("Review not found");
      }

      if (review.user_id !== user_id) {
        throw new Error("Unauthorized to update this review");
      }

      const { rating, title, comment, visit_type, companion, purpose, photos } =
        updateData;

      // Xử lý ảnh
      let photoUrls = review.photos; // Giữ ảnh cũ nếu không có ảnh mới
      if (photos && Array.isArray(photos)) {
        // Xóa ảnh cũ khỏi Cloudinary
        await this.deletePhotosFromCloudinary(review.photos);
        // Upload ảnh mới with appropriate folder
        photoUrls = await this.uploadPhotosToCloudinary(
          photos,
          review.attraction_id,
          review.restaurant_id
        );
      }

      const data = {
        rating,
        title,
        comment,
        visit_type,
        companion,
        photos: photoUrls, // Lưu mảng URL vào JSONB
      };

      if (review.restaurant_id) {
        data.purpose = purpose;
      }

      const [updated] = await this.Review.update(data, {
        where: { review_id: id },
      });

      if (updated) {
        return await this.Review.findByPk(id);
      }
      throw new Error("Review not found");
    } catch (error) {
      throw new Error(`Failed to update review: ${error.message}`);
    }
  }

  async deleteReview(id, user_id) {
    try {
      const review = await this.Review.findByPk(id);
      if (!review) {
        throw new Error("Review not found");
      }

      if (review.user_id !== user_id) {
        throw new Error("Unauthorized to delete this review");
      }

      // Xóa ảnh khỏi Cloudinary
      await this.deletePhotosFromCloudinary(review.photos);

      const deleted = await this.Review.destroy({
        where: { review_id: id },
      });

      if (!deleted) {
        throw new Error("Review not found");
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }
}

module.exports = ReviewService;
