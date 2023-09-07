const knex = require("knex");
const getTransactionsByDateRange = function (data, db, tableNames) {
  console.log('executing getTransactions()');

  const startDate = data.startDate;
  const endDate = data.endDate;
  return transactionPromise = db(tableNames.transactions)
      .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc, description")
      .select(knex.raw("id, description, amount, category, notprocessed, pending, isbill, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
      .whereBetween('transactiondate', [startDate, endDate]);
};

const getTransactions = function (data, db, tableNames) {
  console.log('executing getTransactions()');

  let page = data.page;
  if (page > 0) {
    page = page - 1;
  }

  const count = data.count || 100;
  return transactionPromise = db(tableNames.transactions)
      .orderByRaw("date_part('year', transactiondate) desc, date_part('month', transactiondate) desc, date_part('day', transactiondate) desc, description")
      .select(knex.raw("id, description, amount, category, notprocessed, pending, isbill, to_char(transactiondate, 'MM/DD/YYYY') as transactiondate"))
      .limit(count).offset(page * count);
};

const getBankBalance = function (db, tableNames) {
  return db(tableNames.transactions).where({notprocessed: 'f', pending: 'f'})
      .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

const getAvailableBalance = function (db, tableNames) {
  return db(tableNames.transactions)
      .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

const getPendingBalance = function (db, tableNames) {
  return db(tableNames.transactions).where({pending: 't'}).orWhere({notprocessed: 'f', pending: 'f'})
      .select(knex.raw("sum(to_number(amount, 'S9999999.99'))"));
};

module.exports = {
  getTransactionsByDateRange,
  getTransactions,
  getBankBalance,
  getAvailableBalance,
  getPendingBalance
};
