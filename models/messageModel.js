const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./studentModel');
const Teacher = require('./teacherModel');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'studentid',
    references: {
      model: Student,
      key: 'studentid',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  teacherId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'teacherid',
    references: {
      model: Teacher,
      key: 'teacherid',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  roomId: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sender: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: 'messages',
  timestamps: false,
});

Message.belongsTo(Student, { foreignKey: 'studentId', targetKey: 'studentid' });
Message.belongsTo(Teacher, { foreignKey: 'teacherId', targetKey: 'teacherid' });

module.exports = Message;
