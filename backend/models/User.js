const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const bcrypt = require("bcryptjs");

/**
 * User model — handles authentication.
 * Passwords are hashed before being stored using bcrypt.
 */
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Name is required" },
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: "This email is already registered" },
      validate: {
        notNull: { msg: "Email is required" },
        isEmail: { msg: "Please enter a valid email" },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        len: { args: [6, 255], msg: "Password must be at least 6 characters" },
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    // hash the password automatically before saving
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

/**
 * Compare a plain text password with the stored hash.
 * Used during login to verify credentials.
 */
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
