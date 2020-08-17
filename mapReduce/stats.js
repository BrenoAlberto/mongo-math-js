module.exports.euclidianDistance = (vector, vectorFieldName, key = "_id") => {
  const map = function () {
    const target = vector;
    for (let i = 0; i < this[vectorFieldName].length; i++) {
      emit(this[key], this[vectorFieldName] - target[i]);
    }
  };

  const reduce = function (_, values) {
    var total = 0;
    for (let i = 0; i < values.length; i++) {
      total = total + Math.pow(values[i], 2);
    }
    return Math.sqrt(total);
  };

  return {
    map,
    reduce,
  };
};
