const Sequelize = require('sequelize');
const config = require('../config/database');

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(
    config.dbname,
    config.dbuser,
    config.dbpassword,
    {
        host: 'localhost',
        dialect: 'mysql',
        operatorsAliases: false,
        logging: false,
        define: {
            underscored: false,
            charset: 'utf8',
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        let model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;