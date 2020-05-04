module.exports = (sequelize, DataTypes) => {
    let Follow = sequelize.define('follows', {
        tag: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });
    Follow.associate = models => {
        models.follows.belongsTo(models.user, {
            foreignKey: 'userId',
            targetKey: 'userId'
        });
    }
    return Follow;
}