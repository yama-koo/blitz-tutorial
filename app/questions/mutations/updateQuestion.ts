import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateQuestion = z.object({
  id: z.number(),
  text: z.string(),
  choices: z.array(z.object({ id: z.number().optional(), text: z.string() })),
})

export default resolver.pipe(
  resolver.zod(UpdateQuestion),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const question = await db.question.update({
      where: { id },
      data: {
        ...data,
        choices: {
          upsert: data.choices.map((choice) => ({
            where: { id: choice.id || 0 },
            create: { text: choice.text },
            update: { text: choice.text },
          })),
        },
      },
      include: {
        choices: true,
      },
    })

    return question
  }
)
