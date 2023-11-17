import { z } from 'zod';

const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.unknown(),
]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export type JsonZodSchema = z.ZodType<Json>;

export type ConstrainedJsonZodSchema = z.ZodObject<{
  [x: string]: z.ZodString | z.ZodOptional<z.ZodString>;
}>;
