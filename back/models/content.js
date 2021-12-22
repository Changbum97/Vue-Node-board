module.exports = (sequelize, DataTypes) => {
    return sequelize.define('content', {
        writer: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING(3000),
        },
        boardnum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imagecnt: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci',		// 이걸 해줌으로써 DB에 한글사용 가능
    });
}