const Record = require("../models/Record");

exports.getDashboardData = async (req, res) => {
  try {

    const match = {}; 

    const [summary, categoryWise, recent, monthlyTrends] =
      await Promise.all([

        Record.aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              totalIncome: {
                $sum: {
                  $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                },
              },
              totalExpense: {
                $sum: {
                  $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                },
              },
            },
          },
        ]),

        Record.aggregate([
          { $match: match },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              total: 1,
            },
          },
        ]),

        Record.find()
          .sort({ createdAt: -1 })
          .limit(5),

        Record.aggregate([
          { $match: match },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              month: "$_id",
              total: 1,
            },
          },
          { $sort: { month: 1 } },
        ]),
      ]);

    const summaryData = summary[0] || {
      totalIncome: 0,
      totalExpense: 0,
    };

    const netBalance =
      summaryData.totalIncome - summaryData.totalExpense;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome: summaryData.totalIncome,
          totalExpense: summaryData.totalExpense,
          netBalance,
        },
        categoryWise,
        recent,
        monthlyTrends,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard",
      error: error.message,
    });
  }
};