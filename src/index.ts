import { Result } from "@swan-io/boxed";
import zod, { ZodError, ZodTypeDef } from "zod";

export const wrap = <Z extends object>(z: Z) => {
  Object.defineProperty(zod.ZodType.prototype, "resultify", {
    value: function (this: zod.ZodType, it: any) {
      const result = this.safeParse(it);
      if (result.success) {
        return Result.Ok(result.data);
      }
      return Result.Error(result.error);
    },
    writable: true,
    enumerable: false,
    configurable: true,
  });
  return z;
};

declare module "zod" {
  interface ZodType<
    Output = any,
    Def extends ZodTypeDef = ZodTypeDef,
    Input = Output
  > {
    resultify: (it: unknown) => Result<Output, ZodError<Input>>;
  }
}

wrap(zod);
