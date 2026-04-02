import { Router } from 'express'

const router = Router()

// Placeholder — full RSS proxy implemented in Phase 5
router.get('/', (req, res) => {
  res.json({ articles: [] })
})

export default router
