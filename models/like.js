module.exports = (sequelize, DataTypes) => {
    let Like = sequelize.define('like', {
        likedBy: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        postId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });
    Like.associate = models => {
        models.like.belongsTo(models.post, {
            foreignKey: 'postId',
            targetKey: 'postId'
        });
        models.like.belongsTo(models.user, {
            foreignKey: 'likedBy',
            targetKey: 'userId'
        });
    }
    return Like;
}