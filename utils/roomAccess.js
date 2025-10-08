const Reservation = require('../models/reservationModel');

const normalizeId = (value) =>
  value !== undefined && value !== null ? String(value) : null;

const extractUserId = (user) => {
  if (!user) {
    return null;
  }

  return (
    normalizeId(user.id) ||
    normalizeId(user.sub) ||
    normalizeId(user.userId) ||
    null
  );
};

const hasBookedReservation = async (studentId, teacherId) => {
  const normalizedStudentId = normalizeId(studentId);
  const normalizedTeacherId = normalizeId(teacherId);

  if (!normalizedStudentId || !normalizedTeacherId) {
    return false;
  }

  const reservation = await Reservation.findOne({
    where: {
      student_id: normalizedStudentId,
      teacher_id: normalizedTeacherId,
      reservation_status: 'booked',
    },
  });

  return Boolean(reservation);
};

const canAccessRoom = async (user, studentId, teacherId) => {
  const userId = extractUserId(user);
  if (!user || !userId) {
    return false;
  }

  if (user.role === 'ADMIN') {
    return true;
  }

  const isStudentOwner =
    user.role === 'STUDENT' && userId === normalizeId(studentId);
  const isTeacherOwner =
    user.role === 'TEACHER' && userId === normalizeId(teacherId);
  if (!isStudentOwner && !isTeacherOwner) {
    return false;
  }

  const bookedReservation = await hasBookedReservation(studentId, teacherId);
  return bookedReservation;
};

const parseRoomId = (roomId) => {
  if (typeof roomId !== 'string') {
    return { studentId: null, teacherId: null };
  }

  const parts = roomId.split('-');
  if (parts.length !== 3) {
    return { studentId: null, teacherId: null };
  }

  return { studentId: parts[1], teacherId: parts[2] };
};

const canAccessRoomFromRoute = async (user, roomId) => {
  const { studentId, teacherId } = parseRoomId(roomId);
  if (!studentId || !teacherId) {
    return false;
  }

  return canAccessRoom(user, studentId, teacherId);
};

module.exports = {
  normalizeId,
  extractUserId,
  canAccessRoom,
  parseRoomId,
  canAccessRoomFromRoute,
};
