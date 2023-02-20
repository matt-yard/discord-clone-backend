interface ResponseError extends Error {
  status?: number;
}

declare namespace Express {
  export interface Request {
    user?: UserPublicInfo | null;
  }
}

// declare namespace JsonWebToken {
//   export interface JwtPayload {
//     userId?: string;
//     iat?: bigint;
//   }
// }

interface JwtPayload {
  userId?: string;
}

// interface RequestUser extends Request {
//   user?: UserPublicInfo;
// }
