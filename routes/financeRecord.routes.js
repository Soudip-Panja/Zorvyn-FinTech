const express = require("express");
const router = express.Router();

const FinancialRecord = require("../models/financeRecord.model");
const User = require("../models/users.model");

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

    console.log(populatedRecord);

    return populatedRecord;
  } catch (error) {
    console.log("Error creating new record.", error.message);
    throw error;
  }
}

router.post("/records", async (req, res) => {
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
      "name email role"
    );

    return records;
  } catch (error) {
    console.log("Error fetching records.", error.message);
    throw error;
  }
}

router.get("/records", async (req, res) => {
  try {
    const data = await getAllRecords();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
