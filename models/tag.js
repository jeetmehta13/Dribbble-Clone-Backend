module.exports = (sequelize, DataTypes) => {
    let Tag = sequelize.define('tag', {
        tag: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        postId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        }
    });
    Tag.associate = models => {
        models.tag.belongsTo(models.post, {
            foreignKey: 'postId',
            targetKey: 'postId'
        });
    }
    return Tag;
}