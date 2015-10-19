exports.up = function(knex, Promise) {
     return knex.schema.createTable('urls',
	      function (table) {
               table.uuid("url_id").primary();
               table.string('url');
               table.timestamps();
          }
     ).createTable('url_responses',
          function (table) {
              table.uuid("url_response_id").primary();
              table.uuid("url_id").notNullable().references("url_id").inTable("urls").onDelete("cascade");

              table.integer("googleplus");
              table.integer("linkedin");
              table.integer("twitter");
              table.integer("facebook-shares");
              table.integer("facebook-comments");

              table.timestamps();
          }
     );
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("urls").
        dropTable("url_responses");
};
