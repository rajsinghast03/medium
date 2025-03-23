import { Hono } from "hono";
import { decode, verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { SignatureKey } from "hono/utils/jwt/jws";
import {
  createBlogSchema,
  updateBlogSchema,
} from "@rajsinghast03/medium-common";

enum StatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORISED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: SignatureKey;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use(async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = decode(token);
      if (decoded) {
        const jwtPayload = await verify(token, c.env.JWT_SECRET);
        if (jwtPayload) {
          c.set("userId", jwtPayload.id as string);
        }
      }
    } catch (error) {
      return c.json("Unauthorized User", StatusCodes.UNAUTHORISED);
    }
  } else {
    return c.json("Please login to proceed", StatusCodes.UNAUTHORISED);
  }
  await next();
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get(`userId`);
  const { success } = createBlogSchema.safeParse(body);

  if (!success) {
    return c.json("Invalid input", StatusCodes.BAD_REQUEST);
  }
  try {
    const newBlog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        publishedAt: new Date().toISOString(),
        authorId: userId,
      },
    });

    return c.json({ blogId: newBlog.id }, StatusCodes.OK);
  } catch (error) {
    return c.json(
      `Error while creating blog ${error}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const allBlogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json(allBlogs, StatusCodes.OK);
  } catch (error) {
    return c.json(
      `Error while getting all blogs ${error}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogId = c.req.param("id");

  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json(blog);
  } catch (error) {
    return c.json(
      `Error while getting blog ${error}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

blogRouter.delete("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogId = c.req.param("id");

  try {
    const blog = await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });

    return c.json("Deleted successfully", StatusCodes.OK);
  } catch (error) {
    return c.json(
      `Error while getting blog ${error}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get("userId");
  const { success } = updateBlogSchema.safeParse(body);

  if (!success) {
    return c.json("Invalid input", StatusCodes.BAD_REQUEST);
  }

  try {
    await prisma.blog.update({
      where: {
        id: body.blogId,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
        publishedAt: new Date().toISOString(),
      },
    });

    return c.json("Blog updated!", StatusCodes.OK);
  } catch (error) {
    return c.json(
      `Error while updating blog ${error}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});
