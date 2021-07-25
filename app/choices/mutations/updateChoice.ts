import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateChoice = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateChoice),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const choice = await db.choice.update({
      where: { id },
      data: { votes: { increment: 1 } },
    })

    return choice
  }
)
