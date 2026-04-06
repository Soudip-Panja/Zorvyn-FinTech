const express = require("express");
const router = express.Router();

const FinancialRecord = require("../models/financeRecord.model");
const User = require("../models/users.model");

const verifyJwt = require("../middleware/auth.middleware");
router.use(verifyJwt);

const allowRoles = require("../middleware/role.middleware");

//Creating new financial record
async function createRecord(newRecord) {
  try {
    if (!newRecord.recordBy) {
      throw new Error("recordBy (user ID) is required.");
    }
    const userExist = await User.findById(newRecord.recordBy);

    if (!userExist) {
      throw new Error(`User with ID ${newRecord.recordBy} not found.`);
    }

    if (userExist.status === "inactive") {
      throw new Error("User is inactive. Cannot create record.");
    }

    const record = new FinancialRecord(newRecord);
    const savedRecord = await record.save();

    const populatedRecord = await savedRecord.populate(
      "recordBy",
      "name email role",
    );

    return populatedRecord;
  } catch (error) {
    console.log("Error creating new record.", error.message);
    throw error;
  }
}

router.post("/", allowRoles("admin"), async (req, res) => {
  try {
    const data = await createRecord(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Viewing all records
async function getAllRecords() {
  try {
    const records = await FinancialRecord.find().populate(
      "recordBy",
      "name email role",
    );

    return records;
  } catch (error) {
    console.log("Error fetching records.", error.message);
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const data = await getAllRecords();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update record
async function updateRecord(recordId, updatedData) {
  try {
    const updatedRecord = await FinancialRecord.findByIdAndUpdate(
      recordId,
      updatedData,
      { returnDocument: "after", runValidators: true },
    ).populate("recordBy", "name email role");

    if (!updatedRecord) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    return updatedRecord;
  } catch (error) {
    console.log("Error updating record.", error.message);
    throw error;
  }
}

router.post("/:id", allowRoles("admin"), async (req, res) => {
  try {
    const data = await updateRecord(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete record
async function deleteRecord(recordId) {
  try {
    const deletedRecord = await FinancialRecord.findByIdAndDelete(recordId);

    if (!deletedRecord) {
      throw new Error(`Record with ID ${recordId} not found.`);
    }

    return deletedRecord;
  } catch (error) {
    console.log("Error deleting record.", error.message);
    throw error;
  }
}

router.delete("/:id", allowRoles("admin"), async (req, res) => {
  try {
    const data = await deleteRecord(req.params.id);
    res.status(200).json({
      message: "Record deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter records
async function filterRecords(filters) {
  try {
    let query = {};

    // Filter by type (income / expense)
    if (filters.type) {
      query.type = filters.type;
    }

    // Filter by category
    if (filters.category) {
      query.category = filters.category;
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      query.date = {};

      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }

      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    const records = await FinancialRecord.find(query).populate(
      "recordBy",
      "name email role",
    );

    return records;
  } catch (error) {
    console.log("Error filtering records.", error.message);
    throw error;
  }
}

router.get("/filter", allowRoles("admin"), async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const filters = {
      type,
      category,
      startDate,
      endDate,
    };

    const data = await filterRecords(filters);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete Dashboard Summary
async function getDashboardSummary() {
  try {
    // Total Income
    const incomeResult = await FinancialRecord.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = incomeResult[0]?.total || 0;

    // Total Expense
    const expenseResult = await FinancialRecord.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenses = expenseResult[0]?.total || 0;

    // Net Balance
    const netBalance = totalIncome - totalExpenses;

    // Category Wise
    const categoryTotals = await FinancialRecord.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Recent Activity (last 5)
    const recentActivity = await FinancialRecord.find()
      .sort({ date: -1 })
      .limit(5)
      .populate("recordBy", "name email role");

    // Monthly Trends
    const monthlyTrends = await FinancialRecord.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      categoryTotals,
      recentActivity,
      monthlyTrends,
    };
  } catch (error) {
    console.log("Error generating dashboard summary.", error.message);
    throw error;
  }
}

//Summary Route
router.get("/summary", allowRoles("admin", "analyst"), async (req, res) => {
  try {
    const data = await getDashboardSummary();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
