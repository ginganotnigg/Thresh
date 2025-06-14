import { z } from "zod";
import { PracticeResourceSchema } from "./resource.schema";

export const PostPracticeBodySchema = PracticeResourceSchema.omit({});
