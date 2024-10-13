const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your Sequelize setup

const Message = sequelize.define('Message', {
  studentId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'messages',
});

module.exports = Message;
