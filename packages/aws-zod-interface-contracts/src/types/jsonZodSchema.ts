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

const constrainedJsonZodSchema = z.record(z.union([z.string(), z.unknown()]));
type Constrained = z.infer<typeof constrainedJsonZodSchema>;
export type ConstrainedJsonZodSchema = z.ZodType<Constrained>;
