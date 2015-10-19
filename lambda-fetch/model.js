/**
 * Created by fers on 17.10.15.
 */

exports.knex = require('knex')({
    client: 'mysql',
//    debug: true,
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
});
