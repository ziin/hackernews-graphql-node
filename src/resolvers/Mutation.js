import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { APP_SECRET, getUserId } from "../utils";

export async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

export async function login(parent, { password, email }, context) {
  const user = await context.prisma.user({ email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

export function post(parent, { url, description }, context) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url,
    description,
    postedBy: { connect: { id: userId } }
  });
}

export async function vote(parent, args, context) {
  const userId = getUserId(context);

  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });

  if (voteExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
}
