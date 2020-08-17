module.exports.medianPipeline = (field, conditions = {}, groupBy = "") => {
  if (groupBy !== "") groupBy = "$" + groupBy;

  return [
    {
      $match: {
        [field]: {
          $gt: 0,
        },
      },
    },
    {
      $match: conditions,
    },
    {
      $group: {
        _id: groupBy,
        count: {
          $sum: 1,
        },
        allFields: {
          $push: {
            $cond: ["$" + field, "$" + field, null],
          },
        },
      },
    },
    {
      $unwind: {
        path: "$allFields",
      },
    },
    {
      $sort: {
        allFields: 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        count: {
          $first: "$count",
        },
        allFields: {
          $push: "$allFields",
        },
      },
    },
    {
      $project: {
        count: 1,
        allFields: 1,
        midpoint: {
          $divide: ["$count", 2],
        },
      },
    },
    {
      $project: {
        count: 1,
        allFields: 1,
        midpoint: 1,
        high: {
          $ceil: "$midpoint",
        },
        low: {
          $floor: "$midpoint",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        allFields: {
          $first: "$allFields",
        },
        high: {
          $avg: "$high",
        },
        low: {
          $avg: "$low",
        },
      },
    },
    {
      $project: {
        beginValue: {
          $arrayElemAt: ["$allFields", "$high"],
        },
        endValue: {
          $arrayElemAt: ["$allFields", "$low"],
        },
      },
    },
    {
      $project: {
        median: {
          $avg: ["$beginValue", "$endValue"],
        },
      },
    },
  ];
};
