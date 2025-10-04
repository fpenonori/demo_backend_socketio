const normalizeId = (value) => (value !== undefined && value !== null ? String(value) : null);

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

const canAccessRoom = (user, studentId, teacherId) => {
  const userId = extractUserId(user);
  if (!user || !userId) {
    return false;
  }

  if (user.role === 'ADMIN') {
    return true;
  }

  if (user.role === 'STUDENT') {
    return userId === normalizeId(studentId);
  }

  if (user.role === 'TEACHER') {
    return userId === normalizeId(teacherId);
  }

  return false;
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

const canAccessRoomFromRoute = (user, roomId) => {
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

