exports.getMin = (array, field) => {
  if (field == undefined) {
    let min = array[0];
    for (let i = 1; i < array.length; i++) {
      if (min > array[i]) {
        min = array[i];
      }
    }
    return min;
  } else {
    let min = array[0][field];
    for (let i = 1; i < array.length; i++) {
      if (min > array[i][field]) {
        min = array[i][field];
      }
    }
    return min;
  }
};

exports.sortByDate = (array = [], dateField = "date") => {
  array.sort((a, b) => {
    a.date = dateField ? a[dateField] : a;
    b.date = dateField ? b[dateField] : b;
    a = new Date(a.date);
    b = new Date(b.date);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
  return array.reverse();
};
