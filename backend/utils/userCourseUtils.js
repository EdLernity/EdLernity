const mongoose = require("mongoose");
const UserCourseModel = require("../models/userCourseSchema");

function uniqueObjectIds(ids = []) {
  const seen = new Set();
  const normalized = [];
  for (const id of ids) {
    if (!id) continue;
    const key = String(id);
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(id);
  }
  return normalized;
}

async function getMergedUserCourseState(userId) {
  const docs = await UserCourseModel.find({ userId }).sort({ updatedAt: -1, createdAt: -1 });
  if (!docs.length) return null;

  const primary = docs[0];
  const mergedCourseIds = uniqueObjectIds(
    docs.flatMap((doc) => doc.courseIds || [])
  );
  const isAllCourse = docs.some((doc) => doc.isAllCourse);

  return {
    primary,
    docs,
    mergedCourseIds,
    isAllCourse,
    duplicateDocIds: docs.slice(1).map((doc) => doc._id),
  };
}

async function consolidateUserCourseRecords(userId) {
  const state = await getMergedUserCourseState(userId);
  if (!state) return null;

  const { primary, mergedCourseIds, isAllCourse, duplicateDocIds } = state;
  primary.courseIds = mergedCourseIds;
  primary.isAllCourse = isAllCourse || primary.isAllCourse;
  primary.paid = true;
  await primary.save();

  if (duplicateDocIds.length) {
    await UserCourseModel.deleteMany({ _id: { $in: duplicateDocIds } });
  }

  return primary;
}

async function grantSingleCourseAccess(userId, courseId, transactionId) {
  const normalizedCourseId = mongoose.Types.ObjectId.isValid(courseId)
    ? new mongoose.Types.ObjectId(courseId)
    : courseId;

  const state = await getMergedUserCourseState(userId);
  if (!state) {
    return UserCourseModel.create({
      userId,
      courseIds: [normalizedCourseId],
      paid: true,
      transactionId,
    });
  }

  const { primary, mergedCourseIds, duplicateDocIds } = state;
  primary.courseIds = uniqueObjectIds([...mergedCourseIds, normalizedCourseId]);
  primary.paid = true;
  primary.transactionId = transactionId;
  await primary.save();

  if (duplicateDocIds.length) {
    await UserCourseModel.deleteMany({ _id: { $in: duplicateDocIds } });
  }

  return primary;
}

async function grantAllCoursesAccess(userId, courseIds, transactionId) {
  const normalizedIds = uniqueObjectIds(courseIds);
  const state = await getMergedUserCourseState(userId);

  if (!state) {
    return UserCourseModel.create({
      userId,
      courseIds: normalizedIds,
      paid: true,
      transactionId,
      isAllCourse: true,
    });
  }

  const { primary, mergedCourseIds, duplicateDocIds } = state;
  primary.courseIds = uniqueObjectIds([...mergedCourseIds, ...normalizedIds]);
  primary.paid = true;
  primary.transactionId = transactionId;
  primary.isAllCourse = true;
  await primary.save();

  if (duplicateDocIds.length) {
    await UserCourseModel.deleteMany({ _id: { $in: duplicateDocIds } });
  }

  return primary;
}

async function revokeSingleCourseAccess(userId, courseId) {
  const state = await getMergedUserCourseState(userId);
  if (!state) return null;

  const { primary, mergedCourseIds, duplicateDocIds } = state;
  const target = String(courseId);
  primary.courseIds = mergedCourseIds.filter((id) => String(id) !== target);
  // Removing a specific course means the user no longer has blanket access.
  primary.isAllCourse = false;
  await primary.save();

  if (duplicateDocIds.length) {
    await UserCourseModel.deleteMany({ _id: { $in: duplicateDocIds } });
  }

  return primary;
}

async function revokeAllCourseAccess(userId) {
  const state = await getMergedUserCourseState(userId);
  if (!state) return null;

  const { primary, duplicateDocIds } = state;
  primary.courseIds = [];
  primary.isAllCourse = false;
  await primary.save();

  if (duplicateDocIds.length) {
    await UserCourseModel.deleteMany({ _id: { $in: duplicateDocIds } });
  }

  return primary;
}

const createUserCourse = async (userId, courseIds, isAllCourse) => {
  try {
    let userCourse = await UserCourseModel.findOne({ userId });
    if (userCourse) {
      userCourse.courseIds = uniqueObjectIds(courseIds);
      userCourse.isAllCourse = isAllCourse;
    } else {
      userCourse = new UserCourseModel({
        userId,
        courseIds: uniqueObjectIds(courseIds),
        isAllCourse,
      });
    }
    await userCourse.save();
    return userCourse;
  } catch (error) {
    throw error;
  }
};

const getUserCourseById = async (userId) => {
  try {
    if (!userId) {
      const err = new Error("Invalid input");
      err.statusCode = 400;
      throw err;
    }

    const state = await getMergedUserCourseState(userId);
    if (!state) {
      const err = new Error(`No record found for the given user id ${userId}`);
      err.statusCode = 404;
      throw err;
    }

    return {
      userCourseIds: state.mergedCourseIds,
      isAllCourse: state.isAllCourse,
    };
  } catch (error) {
    return null;
  }
};

module.exports = {
  createUserCourse,
  getUserCourseById,
  getMergedUserCourseState,
  consolidateUserCourseRecords,
  grantSingleCourseAccess,
  grantAllCoursesAccess,
  revokeSingleCourseAccess,
  revokeAllCourseAccess,
  uniqueObjectIds,
};
