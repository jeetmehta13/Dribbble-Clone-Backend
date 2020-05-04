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
        personalbio: {
            type: DataTypes.STRING,
            allowNull: true
        }
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
        models.user.hasMany(models.follows, {
            foreignKey: 'userId',
            sourceKey: 'userId'
        });
        models.user.hasMany(models.userfollows, {
            foreignKey: 'userId',
            sourceKey: 'userId'
        });
        models.user.hasMany(models.userfollows, {
            foreignKey: 'followedId',
            sourceKey: 'userId'
        });
    };
    return User;
}