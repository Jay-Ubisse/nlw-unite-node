import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify();

const prisma = new PrismaClient({
  log: ["query"],
});

app.post("/events", async (request, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  });

  const data = createEventSchema.parse(request.body);

  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      slug: new Date().toISOString(),
      maximumAttendees: data.maximumAttendees,
    },
  });

  return reply.status(201).send({ eventID: event.id });
});

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
