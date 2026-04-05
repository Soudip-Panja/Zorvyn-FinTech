const fs = require("fs");
const financialRecord = require("../models/financeRecord.model");

const jsonData = fs.readFileSync("./data/financeRecord.json", "utf-8");
const financeData = JSON.parse(jsonData);

async function seedFinanceRecord() {
  try {
    for (const recordData of financeData) {
      const newRecord = new financialRecord({
        amount: recordData.amount,
        type: recordData.type,
        category: recordData.category,
        date: recordData.date,
        notes: recordData.notes,
        recordBy: recordData.recordBy,
      });

    //   console.log(newRecord);
      await newRecord.save();
    }
    console.log("Financial record data successfully seeded.");
  } catch (error) {
    console.log("Error seeding finance data:", error);
  }
}

module.exports = { seedFinanceRecord };