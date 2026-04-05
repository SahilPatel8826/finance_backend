const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= CREATE =================
const createUser = async (req, res) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create users",
      });
    } 

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, password required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "viewer",
    });

    res.status(201).json({
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GET ONE =================
const getUser = async (req, res) => {
  try {
    
    if (!["admin", "analyst"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GET ALL =================
const getAllUsers = async (req, res) => {
  try {
    
    if (!["admin", "analyst"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      data: users,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
    });
  }
};

// ================= UPDATE =================
const updateUser = async (req, res) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update users",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, email, role, status } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= DELETE =================
const deleteUser = async (req, res) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete users",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};