const operators = {
  equal: (value) => value[0],
  notEqual: (value) => ({ $ne: value }),
  lessThan: (value) => ({ $lt: value }),
  lessThanEqual: (value) => ({ $lte: value }),
  greaterThan: (value) => ({ $gt: value }),
  greaterThanEqual: (value) => ({ $gte: value }),

  search: (value) => ({ $text: { $search: value } }),

  orderDesc: (value) => ({ $gt: value }),
  orderAsc: (value) => ({ $gt: value }),

  limit: (value) => ({ $gt: value }),
  offset: (value) => ({ $gt: value }),
  cursorAfter: (value) => ({ $gt: value }),
  cursorBefore: (value) => ({ $gt: value }),
};

export const QueryUtil = (method, attribute, values) => {
  const queryFormatted = {};
  queryFormatted[attribute] = operators[method](values);
  return queryFormatted;
};

export const parseQuery = (query: string) => {
  // method("attribute", [value,value])
  const rgxMethod = /(.*?)(?=\()/g;
  const rgxValues = /(?<=\[)(.*?)(?=\])/g;
  const rgxAttribute = /(?<=\(")(.*?)(?=\")/g;
  const method = (query.match(rgxMethod) || [''])[0];
  const values = (query.match(rgxValues) || [''])[0].split(',').map((qry) => qry.replaceAll('"', ''));
  const attribute = (query.match(rgxAttribute) || [''])[0];
  return QueryUtil(method, `data.${attribute}`, values);
};
