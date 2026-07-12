"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEventType = exports.NotificationType = exports.SubmissionStatus = exports.CourseLevel = exports.GroupType = exports.FriendRequestStatus = exports.ReactionType = exports.PostStatus = exports.PostVisibility = exports.PostType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "STUDENT";
    UserRole["TEACHER"] = "TEACHER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MODERATOR"] = "MODERATOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var PostType;
(function (PostType) {
    PostType["TEXT"] = "TEXT";
    PostType["IMAGE"] = "IMAGE";
    PostType["VIDEO"] = "VIDEO";
    PostType["PDF"] = "PDF";
    PostType["ASSIGNMENT"] = "ASSIGNMENT";
    PostType["QUIZ"] = "QUIZ";
    PostType["LESSON"] = "LESSON";
    PostType["POLL"] = "POLL";
})(PostType || (exports.PostType = PostType = {}));
var PostVisibility;
(function (PostVisibility) {
    PostVisibility["PUBLIC"] = "PUBLIC";
    PostVisibility["FRIENDS"] = "FRIENDS";
    PostVisibility["GROUP"] = "GROUP";
    PostVisibility["COURSE"] = "COURSE";
    PostVisibility["PRIVATE"] = "PRIVATE";
})(PostVisibility || (exports.PostVisibility = PostVisibility = {}));
var PostStatus;
(function (PostStatus) {
    PostStatus["DRAFT"] = "DRAFT";
    PostStatus["PUBLISHED"] = "PUBLISHED";
    PostStatus["ARCHIVED"] = "ARCHIVED";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "LIKE";
    ReactionType["LOVE"] = "LOVE";
    ReactionType["CARE"] = "CARE";
    ReactionType["HAHA"] = "HAHA";
    ReactionType["WOW"] = "WOW";
    ReactionType["SAD"] = "SAD";
    ReactionType["ANGRY"] = "ANGRY";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
var FriendRequestStatus;
(function (FriendRequestStatus) {
    FriendRequestStatus["PENDING"] = "PENDING";
    FriendRequestStatus["ACCEPTED"] = "ACCEPTED";
    FriendRequestStatus["DECLINED"] = "DECLINED";
})(FriendRequestStatus || (exports.FriendRequestStatus = FriendRequestStatus = {}));
var GroupType;
(function (GroupType) {
    GroupType["SCHOOL"] = "SCHOOL";
    GroupType["CLASSROOM"] = "CLASSROOM";
    GroupType["CLUB"] = "CLUB";
})(GroupType || (exports.GroupType = GroupType = {}));
var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "BEGINNER";
    CourseLevel["INTERMEDIATE"] = "INTERMEDIATE";
    CourseLevel["ADVANCED"] = "ADVANCED";
})(CourseLevel || (exports.CourseLevel = CourseLevel = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["PENDING"] = "PENDING";
    SubmissionStatus["SUBMITTED"] = "SUBMITTED";
    SubmissionStatus["GRADED"] = "GRADED";
    SubmissionStatus["LATE"] = "LATE";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["FRIEND_REQUEST"] = "FRIEND_REQUEST";
    NotificationType["MESSAGE"] = "MESSAGE";
    NotificationType["HOMEWORK"] = "HOMEWORK";
    NotificationType["EXAM"] = "EXAM";
    NotificationType["COMMENT"] = "COMMENT";
    NotificationType["LIKE"] = "LIKE";
    NotificationType["AI_TASK"] = "AI_TASK";
    NotificationType["GROUP"] = "GROUP";
    NotificationType["COURSE"] = "COURSE";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var CalendarEventType;
(function (CalendarEventType) {
    CalendarEventType["HOMEWORK"] = "HOMEWORK";
    CalendarEventType["EXAM"] = "EXAM";
    CalendarEventType["EVENT"] = "EVENT";
    CalendarEventType["LIVE_CLASS"] = "LIVE_CLASS";
})(CalendarEventType || (exports.CalendarEventType = CalendarEventType = {}));
//# sourceMappingURL=index.js.map