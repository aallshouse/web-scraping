
exports.up = function(knex, Promise) {
  return knex.schema.createTable('notes', function(table) {
    table.increments();
    table.integer('transaction_id');
    table.foreign('transaction_id').references('id').inTable('transactions');
    table.string('note');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('notes');
};
