module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('user', {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
    User.associate = models => {
        models.user.hasMany(models.post, {
            foreignKey: 'author'
        });
        models.user.hasMany(models.comment, {
            foreignKey: 'author'
        });
        models.user.hasMany(models.like, {
            foreignKey: 'likedBy',
            sourceKey: 'userId'
        });
    };
    return User;
}