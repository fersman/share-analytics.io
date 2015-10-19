// Update with your config settings.

module.exports = {

  production: {
    client: 'mysql',
    connection: {
      host: 'share-analytics-cluster.cluster-csco2glq0o6b.eu-west-1.rds.amazonaws.com',
      database: 'share',
      user:     'share',
      password: 'share-analytics'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  development: {
    client: 'mysql',
    connection: {
      host: 'share-analytics-cluster.cluster-csco2glq0o6b.eu-west-1.rds.amazonaws.com',
      database: 'share',
      user:     'share',
      password: 'share-analytics'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }


};
