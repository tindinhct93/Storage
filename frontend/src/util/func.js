function DescendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function GetComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => DescendingComparator(a, b, orderBy)
    : (a, b) => -DescendingComparator(a, b, orderBy);
}

export const ParseObjectToValueLabel = (obj) => {
  let lst = [];
  for (let size in obj) {
    lst.push({
      value: size,
      label: size,
    });
  }
  return lst;
};
