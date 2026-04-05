
const mongoose = require("mongoose");
const Record = require("../models/Record");

// ================= CREATE =================
const createRecord = async (req, res) => {
  try {
  
    if (req.user.role === "viewer") {
      return res.status(403).json({
        message: "Viewer cannot create records",
      });
    }

    const { amount, type, category, note } = req.body;

    
    if (!amount || !type || !category) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number",
      });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      note,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Record created successfully",
      data: record,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating record",
      error: error.message,
    });
  }
};

// ================= GET BY ID =================
const getRecordById = async (req, res) => {
  try {
    
    if (req.user.role === "viewer") {
      return res.status(403).json({
        message: "Viewer cannot access records",
      });
    }

    const id = req.params.id;

    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.status(200).json({
      message: "Record fetched successfully",
      data: record,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching record",
      error: error.message,
    });
  }
};

// ================= GET ALL BY USER =================
const getAllRecords = async (req, res) => {
  try {

    if (req.user.role === "viewer") {
      return res.status(403).json({
        message: "Viewer cannot access records",
      });
    }

    const records = await Record.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All records fetched successfully",
      count: records.length,
      data: records,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching records",
      error: error.message,
    });
  }
};

// ================= DELETE =================
const deleteRecord = async (req, res) => {
  try {
    
    if (req.user.role === "viewer") {
      return res.status(403).json({
        message: "Viewer cannot delete records",
      });
    }

    const id = req.params.id;
    let record;

    
    if (req.user.role === "admin") {
      record = await Record.findByIdAndDelete(id);
    }

    else if (req.user.role === "analyst") {
      return res.status(403).json({
        message: "Analyst cannot delete records",
      });
    }

    if (!record) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.status(200).json({
      message: "Record deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting record",
      error: error.message,
    });
  }
};

// ================= UPDATE =================
const updateRecord = async (req, res) => {
  try {
    if (req.user.role === "viewer") {
      return res.status(403).json({
        message: "Viewer cannot update records",
      });
    }

    const id = req.params.id;
    const { amount, type, category, note } = req.body;

    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

  
    if (req.user.role === "analyst") {
      return res.status(403).json({
        message: "Analyst cannot update records",
      });
    }

  
    if (amount !== undefined) {
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
          message: "Amount must be positive",
        });
      }
      record.amount = amount;
    }

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          message: "Invalid type",
        });
      }
      record.type = type;
    }

    if (category !== undefined) record.category = category;
    if (note !== undefined) record.note = note;

    const updatedRecord = await record.save();

    res.status(200).json({
      message: "Record updated successfully",
      data: updatedRecord,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating record",
      error: error.message,
    });
  }
};

// ================= FILTERS =================
const getAllRecordsFilter = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const filter = {};

    // filter by type
    if (type) {
      filter.type = type;
    }

    // filter by category
    if (category) {
      filter.category = category;
    }

    // filter by date
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const records = await Record.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Records fetched successfully",
      count: records.length,
      data: records,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching records",
      error: error.message,
    });
  }
};

module.exports = {
  createRecord,
  getRecordById,
  getAllRecords,
  deleteRecord,
  updateRecord,
  getAllRecordsFilter
};