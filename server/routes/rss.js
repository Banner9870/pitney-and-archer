import { Router } from 'express'
import { XMLParser } from 'fast-xml-parser'

const router = Router()

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
let cache = null
let cacheTime = 0

const FEED_URLS = {
  suntimes: 'https://chicago.suntimes.com/rss/index.xml',
  wbez: 'https://www.wbez.org/rss/index.xml',
}

const parser = new XMLParser({ ignoreAttributes: false })

function stripHtml(html) {
  if (!html) return ''
  return String(html)
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
    .slice(0, 200)
}

async function fetchFeed(source) {
  const url = FEED_URLS[source]
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${source}`)
  const xml = await res.text()
  const parsed = parser.parse(xml)
  const items = parsed?.rss?.channel?.item ?? []
  const arr = Array.isArray(items) ? items : [items]
  return arr.map((item, idx) => ({
    id: `rss-${source}-${idx}-${String(item.link ?? '').slice(-20).replace(/[^a-z0-9]/gi, '')}`,
    title: String(item.title ?? ''),
    url: String(item.link ?? ''),
    summary: stripHtml(item.description ?? ''),
    source,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    isCitywide: true,
  }))
}

router.get('/', async (req, res) => {
  const source = req.query.source

  // Return cached response if within TTL (source-specific requests bypass cache)
  if (!source && cache && Date.now() - cacheTime < CACHE_TTL) {
    return res.json(cache)
  }

  try {
    if (source === 'suntimes' || source === 'wbez') {
      const articles = await fetchFeed(source)
      return res.json(articles)
    }

    // No source param — fetch both and combine
    const results = await Promise.allSettled([
      fetchFeed('suntimes'),
      fetchFeed('wbez'),
    ])

    const articles = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    cache = articles
    cacheTime = Date.now()
    return res.json(articles)
  } catch {
    // On any error return empty array — feed renders guides only
    return res.json([])
  }
})

export default router
