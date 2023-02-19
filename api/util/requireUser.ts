import { Request, Response, NextFunction } from "express";

//TODO:
// Need the following middleware functions for controlling access to API endpoints

// requireUser -> ensures that a user is signed in
export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {}

// requireAccess -> ensures that the signedin user is a member of a server
export async function requireAcces(
  req: Request,
  res: Response,
  next: NextFunction
) {}

// requirePermissions -> for creating/deleteing channels, adding/kicking members
export async function requirePermission(
  req: Request,
  res: Response,
  next: NextFunction
) {}

//requireOwner -> reserved for actions only a server owner can make,
// like deleting a server

export async function requireOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {}
