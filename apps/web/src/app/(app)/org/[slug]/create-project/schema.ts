import z from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1, {
        message: 'Nome é obrigatório',
    }),
    description: z.string().min(1, {
        message: 'Descrição é obrigatória',
    }),
})