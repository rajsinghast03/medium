import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { loginSchema, signUpSchema } from "@rajsinghast03/medium-common";

enum StatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORISED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/login", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = loginSchema.safeParse(body);

  if (!success) {
    return c.json("Invalid user input", StatusCodes.BAD_REQUEST);
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!dbUser) {
      return c.json("User not found", StatusCodes.BAD_REQUEST);
    }

    if (dbUser?.password != body.password) {
      return c.json("Incorrect Credentials", StatusCodes.BAD_REQUEST);
    }

    const token = await sign({ id: dbUser?.id }, c.env.JWT_SECRET);

    return c.json({ jwtToken: token, name: dbUser.name });
  } catch (error) {
    return c.json(
      `Error while login ${error}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signUpSchema.safeParse(body);

  if (!success) {
    return c.json("Invalid Input", StatusCodes.BAD_REQUEST);
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (dbUser) {
    return c.json("User already exists!", StatusCodes.BAD_REQUEST);
  }

  try {
    await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    return c.json("User created successfully", StatusCodes.OK);
  } catch (error) {
    return c.json(
      `Error creating user ${error}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});
