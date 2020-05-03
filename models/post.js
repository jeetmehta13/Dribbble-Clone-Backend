module.exports = (sequelize, DataTypes) => {
    let Post = sequelize.define('post', {
        postId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subtitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
    });
    Post.associate = models => {
        models.post.hasMany(models.tag, {
            foreignKey: 'postId',
            sourceKey: 'postId'
        });
        models.post.hasMany(models.comment, {
            foreignKey: 'postId'
        });
        models.post.hasMany(models.like, {
            foreignKey: 'postId',
            sourceKey: 'postId'
        })
    };
    return Post;
}