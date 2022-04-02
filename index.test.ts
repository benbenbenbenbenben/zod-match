import { expect, test } from "vitest";
import z, { ZodError } from "zod";
import ".";

test("matchParse", () => {
  const NewCarRequest = z.object({
    wheels: z.number().min(3).max(4),
    engine: z.object({
      size: z.number().optional(),
      fuel: z.enum(["petrol", "diesel", "electric"]),
    }),
  });

  NewCarRequest.resultify({
    engine: {
      fuel: "electric",
    },
  } as any).match({
    Ok: (_) => {
      throw "never reached";
    },
    Error: (e) => {
      expect(e).toBeDefined();
      expect(e).toStrictEqual(
        new z.ZodError([
          {
            code: "invalid_type",
            expected: "number",
            received: "undefined",
            path: ["wheels"],
            message: "Required",
          },
        ])
      );
    },
  });

  NewCarRequest.resultify({ wheels: 4, engine: { fuel: "electric" } }).match({
    Ok: (x) =>
      expect(x).toStrictEqual({
        wheels: 4,
        engine: {
          fuel: "electric",
        },
      }),
    Error: (_) => {
      throw "never reached";
    },
  });

  const shipTheMotor = (_motor: z.infer<typeof NewCarRequest>) => {
    expect(true).toBe(false);
  };

  const logBadThing = (_error: ZodError) => {
    expect(true).toBe(true);
  }

  const iffyRequest = {
    make: "homosapien",
    model: "northern",
    legs: 2,
    engine: {
      fuel: "potatoes",
      size: "12st",
    },
  };

  NewCarRequest.resultify(iffyRequest).match({
    Ok: (car) => shipTheMotor(car),
    Error: (error) => logBadThing(error),
  });
});
