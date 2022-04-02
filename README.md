# zod-match

Adds a `resultify` method to `ZodType`s so you can match Without Exceptions™️!

## Because exceptions are not flow control...

This little library brings [zod](https://github.com/colinhacks/zod) and [@swan-io/boxed](https://github.com/swan-io/boxed) together to give you a nifty way to turn a zod `parse` into a boxed `Result`.

Of course, it is TypeScript too.

```TypeScript
import z from "zod";
import "zod-match";

const NewCarRequest = z.object({
    wheels: z.number().min(3).max(4),
    engine: z.object({
        size: z.number().optional(),
        fuel: z.enum(["petrol", "diesel", "electric"]),
    }),
});

const iffyRequest = {
    make: "homosapien",
    model: "northern",
    legs: 2,
    engine: {
        fuel: "potatoes",
        size: "12st"
    }
}

NewCarRequest.resultify(iffyRequest).match({
    Ok: (car) => shipTheMotor(car),
    Error: (error) => logBadThing(error),
});
```
