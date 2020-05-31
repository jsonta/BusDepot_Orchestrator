const pool = require('./pool.js');

var checkForTable = function(name) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT to_regclass($1)', [name],
        (err, results) => {
            if (err)
                return reject(err);

            return resolve(results.rows[0].to_regclass);
        });
    });
}

var createTable = function(tabName, columns) {
    return new Promise((resolve, reject) => {
        pool.query(`CREATE TABLE IF NOT EXISTS ${tabName} (${columns})`,
        (err, results) => {
            if (err)
                return reject(err);
            
            return resolve(results);
        });
    });
}

exports.checkForTable = checkForTable;
exports.createTable = createTable;
