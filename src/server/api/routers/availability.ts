// File: ~/server/api/routers/availability.ts

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"; // Adjust the import path as per your project structure
import { db } from '~/server/db';
import { Day } from "@prisma/client"; // Import the Day enum from Prisma

export const availabilityRouter = createTRPCRouter({
  // Get all availabilities for the logged-in user
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const availabilities = await db.availability.findMany({
        where: { user_id: ctx.session.user.id },
      });
      return availabilities;
    }),

  // Add a new availability for the logged-in user
  add: protectedProcedure
    .input(
      z.object({
        day: z.nativeEnum(Day),
        startTime: z.string(), // Expecting 'HH:MM' format
        endTime: z.string(),   // Expecting 'HH:MM' format
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Convert 'HH:MM' to DateTime with a base date
      const startDateTime = new Date(`1970-01-01T${input.startTime}:00.000Z`);
      const endDateTime = new Date(`1970-01-01T${input.endTime}:00.000Z`);

      // Optional: Validate that startTime is before endTime
      if (startDateTime >= endDateTime) {
        throw new Error("Start time must be before end time.");
      }

      // Optional: Prevent overlapping availabilities
      const overlapping = await db.availability.findMany({
        where: {
          user_id: ctx.session.user.id,
          day: input.day,
          OR: [
            {
              start_time: {
                lte: endDateTime,
                gte: startDateTime,
              },
            },
            {
              end_time: {
                lte: endDateTime,
                gte: startDateTime,
              },
            },
          ],
        },
      });

      if (overlapping.length > 0) {
        throw new Error("Overlapping availability exists.");
      }

      const newAvailability = await db.availability.create({
        data: {
          user_id: ctx.session.user.id,
          day: input.day,
          start_time: startDateTime,
          end_time: endDateTime,
        },
      });
      return newAvailability;
    }),

  // Update an existing availability
  update: protectedProcedure
    .input(
      z.object({
        availabilityId: z.number(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch the availability to ensure it belongs to the user
      const availability = await db.availability.findUnique({
        where: { id: input.availabilityId },
      });

      if (!availability || availability.user_id !== ctx.session.user.id) {
        throw new Error("Unauthorized or Availability not found.");
      }

      // Convert 'HH:MM' to DateTime with a base date
      const startDateTime = new Date(`1970-01-01T${input.startTime}:00.000Z`);
      const endDateTime = new Date(`1970-01-01T${input.endTime}:00.000Z`);

      // Validate that startTime is before endTime
      if (startDateTime >= endDateTime) {
        throw new Error("Start time must be before end time.");
      }

      // Optional: Prevent overlapping availabilities
      const overlapping = await db.availability.findMany({
        where: {
          user_id: ctx.session.user.id,
          day: availability.day,
          id: { not: input.availabilityId },
          OR: [
            {
              start_time: {
                lte: endDateTime,
                gte: startDateTime,
              },
            },
            {
              end_time: {
                lte: endDateTime,
                gte: startDateTime,
              },
            },
          ],
        },
      });

      if (overlapping.length > 0) {
        throw new Error("Overlapping availability exists.");
      }

      const updatedAvailability = await db.availability.update({
        where: { id: input.availabilityId },
        data: {
          start_time: startDateTime,
          end_time: endDateTime,
        },
      });
      return updatedAvailability;
    }),

  // Delete an availability
  delete: protectedProcedure
    .input(z.object({ availabilityId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const availability = await db.availability.findUnique({
        where: { id: input.availabilityId },
      });

      if (!availability || availability.user_id !== ctx.session.user.id) {
        throw new Error("Unauthorized or Availability not found.");
      }

      await db.availability.delete({
        where: { id: input.availabilityId },
      });
      return { success: true };
    }),
});
