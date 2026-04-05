//

const express = require("express");
const router = express.Router();

const {
  createRecord,
  getRecordById,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getAllRecordsFilter
} = require("../controllers/recordController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, allowRoles("admin", "analyst"), createRecord);
router.get("/:id", protect, allowRoles("admin", "analyst"), getRecordById);
router.get("/", protect, allowRoles("admin", "analyst"), getAllRecords);
router.get("/records", protect,allowRoles("admin","analyst"), getAllRecordsFilter);
router.put("/:id", protect, allowRoles("admin"), updateRecord);
router.delete("/:id", protect, allowRoles("admin"), deleteRecord);


module.exports = router;