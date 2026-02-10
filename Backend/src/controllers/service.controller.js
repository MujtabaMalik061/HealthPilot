import Service from "../models/service.model.js";

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id).populate("doctors");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build query: filter by title OR description (case-insensitive)
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const services = await Service.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .populate("doctors");

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addService = async (req, res) => {
  try {
    const { icon, title, description, doctors } = req.body;

    if (!icon || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Icon, title, and description are required",
      });
    }

    const existingService = await Service.findOne({
      title: title.trim(),
    });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service with this title already exists",
      });
    }

    const service = await Service.create({
      icon,
      title: title.trim(),
      description,
      doctors: doctors || [],
    });

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: service,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Service with this title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // 🔍 check duplicate title (exclude current service)
    if (title) {
      const existingService = await Service.findOne({
        title: title.trim(),
        _id: { $ne: id },
      });

      if (existingService) {
        return res.status(409).json({
          success: false,
          message: "Service with this title already exists",
        });
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        ...req.body,
        title: title ? title.trim() : undefined,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Service with this title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
