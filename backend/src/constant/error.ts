export enum ERROR_CODE {
  UNKNOWN_HTTP_METHOD = 'unknownHttpMethod',

  // users
  PERMISSION_DENIED = 'permissionDenied',

  // groups
  DUPLICATED_GROUP_OF_USER = 'duplicatedGroupOfUser',
  DUPLICATED_GROUP_OF_STAR = 'duplicatedGroupOfStar',
  UNEXPECTED_ACTION = 'unexpectedAction',
  USER_EXISTS = 'userExists',
  USER_NOT_EXIST = 'userNotExist',
  GROUP_SHOULD_HAVE_STAR = 'groupShouldHaveStar',
}
