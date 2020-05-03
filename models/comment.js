module.exports = (sequelize, DataTypes) => {
    let Comment = sequelize.define('comment', {
        commentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
    });
    return Comment;
}