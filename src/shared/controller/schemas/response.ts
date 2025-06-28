import { z } from 'zod';

export const NonNegativeNumberSchema = z.number().int().nonnegative();
