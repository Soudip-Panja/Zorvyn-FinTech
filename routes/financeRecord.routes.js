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
      "name email role",
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

router.post("/records/:id", async (req, res) => {
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

router.delete("/records/:id", async (req, res) => {
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

module.exports = router;
