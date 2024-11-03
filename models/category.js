module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
      category_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      category_name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      category_description: {
          type: DataTypes.STRING,
      },
  }, {
      tableName: 'categories',
      timestamps: false // Disable timestamps (createdAt, updatedAt)
  });

  return Category;
};
