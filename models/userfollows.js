module.exports = (sequelize, DataTypes) => {
    let UserFollow = sequelize.define('userfollows', {
        followedId: {
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
    UserFollow.associate = models => {
        models.userfollows.belongsTo(models.user, {
            foreignKey: 'userId',
            targetKey: 'userId'
        });
        models.userfollows.belongsTo(models.user, {
            foreignKey: 'followedId',
            targetKey: 'userId'
        });
    }
    return UserFollow;
}