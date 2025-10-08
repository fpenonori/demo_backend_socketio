const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define(
  'Reservation',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    reservation_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'reservations',
    timestamps: false,
  }
);

module.exports = Reservation;
