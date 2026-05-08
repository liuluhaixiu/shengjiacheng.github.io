const paperModules = import.meta.glob('../../paper/*.md', { as: 'raw', eager: true })
const gameModules = import.meta.glob('../../game/*.md', { as: 'raw', eager: true })
const otherModules = import.meta.glob('../../other/*.md', { as: 'raw', eager: true })
const paperPdfModules = import.meta.glob('../../paper/*.pdf', { as: 'url', eager: true })
const paperImageModules = import.meta.glob('../../paper/**/*.{png,jpg,jpeg,gif,webp,svg,avif}', {
  as: 'url',
  eager: true,
})
const gameImageModules = import.meta.glob('../../game/**/*.{png,jpg,jpeg,gif,webp,svg,avif}', {
  as: 'url',
  eager: true,
})
const otherImageModules = import.meta.glob('../../other/**/*.{png,jpg,jpeg,gif,webp,svg,avif}', {
  as: 'url',
  eager: true,
})

function parseFrontmatter(raw) {
  const result = { data: {}, content: raw }
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---')) return result

  const secondDelim = trimmed.indexOf('\n---', 4)
  if (secondDelim === -1) return result

  const fmBlock = trimmed.slice(4, secondDelim).trim()
  result.content = trimmed.slice(secondDelim + 4).trim()

  const data = {}
  const lines = fmBlock.split('\n')
  let currentKey = null

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    if (currentKey && trimmedLine.startsWith('- ')) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = []
      }
      data[currentKey].push(unquote(trimmedLine.slice(2).trim()))
      continue
    }

    currentKey = null

    const colonIdx = trimmedLine.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmedLine.slice(0, colonIdx).trim()
    let value = trimmedLine.slice(colonIdx + 1).trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1)
      if (inner.trim() === '') {
        data[key] = []
      } else {
        data[key] = inner.split(',').map((s) => unquote(s.trim()))
      }
      currentKey = null
    } else if (value === '' || value === '|' || value === '>') {
      currentKey = key
    } else {
      data[key] = unquote(value)
      currentKey = null
    }
  }

  result.data = data
  return result
}

function unquote(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1)
  }
  return s
}

function parseModules(modules, category) {
  const imageMap = getImageMapByCategory(category)
  const paperPdfs = getPaperPdfEntries()
  const moduleEntries = Object.entries(modules).sort((a, b) => a[0].localeCompare(b[0]))

  return moduleEntries
    .map(([path, raw], index) => {
      const { data, content } = parseFrontmatter(raw)
      const filename = path.split('/').pop().replace('.md', '')
      return {
        id: filename,
        path,
        category,
        ...data,
        image: resolveImageUrl(data.image, path, imageMap),
        pdf: resolvePaperPdfUrl(data, path, paperPdfs, index),
        content,
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

function getImageMapByCategory(category) {
  if (category === 'paper') return paperImageModules
  if (category === 'game') return gameImageModules
  return otherImageModules
}

function resolveImageUrl(imageValue, markdownPath, imageMap) {
  if (!imageValue || typeof imageValue !== 'string') return ''

  const trimmed = imageValue.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    return trimmed
  }

  const markdownDir = markdownPath.slice(0, markdownPath.lastIndexOf('/') + 1)
  const normalizedRelative = trimmed.replace(/\\/g, '/').replace(/^\.\//, '')
  const candidate = `${markdownDir}${normalizedRelative}`
  const normalizedCandidate = normalizePath(candidate)
  return imageMap[normalizedCandidate] || trimmed
}

function getPaperPdfEntries() {
  return Object.entries(paperPdfModules)
    .map(([path, url]) => {
      const filename = path.split('/').pop() || ''
      return {
        path,
        url,
        filename,
        normalized: normalizeText(filename.replace(/\.pdf$/i, '')),
        tokens: new Set(tokenize(filename.replace(/\.pdf$/i, ''))),
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

function resolvePaperPdfUrl(frontmatter, markdownPath, paperPdfs, markdownIndex) {
  if (!paperPdfs.length) return ''

  if (frontmatter.pdf && typeof frontmatter.pdf === 'string') {
    const resolved = resolveRelativeAsset(frontmatter.pdf, markdownPath, paperPdfModules)
    if (resolved) return resolved
  }

  const scoreSource = [
    markdownPath.split('/').pop()?.replace('.md', '') || '',
    frontmatter.title || '',
    frontmatter.conference || '',
    frontmatter.journal || '',
  ].join(' ')

  const queryTokens = new Set(tokenize(scoreSource))
  let best = null

  for (const pdf of paperPdfs) {
    let score = 0
    for (const token of queryTokens) {
      if (pdf.tokens.has(token)) {
        score += 3
      } else if (pdf.normalized.includes(token)) {
        score += 1
      }
    }
    if (!best || score > best.score) {
      best = { score, url: pdf.url }
    }
  }

  if (best && best.score > 0) {
    return best.url
  }

  return paperPdfs[markdownIndex]?.url || ''
}

function resolveRelativeAsset(assetValue, markdownPath, assetMap) {
  const trimmed = assetValue.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }
  if (trimmed.startsWith('/')) {
    return trimmed
  }

  const markdownDir = markdownPath.slice(0, markdownPath.lastIndexOf('/') + 1)
  const normalizedRelative = trimmed.replace(/\\/g, '/').replace(/^\.\//, '')
  const candidate = normalizePath(`${markdownDir}${normalizedRelative}`)
  return assetMap[candidate] || ''
}

function tokenize(input) {
  const text = normalizeText(input)
  return text
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
}

function normalizeText(input) {
  return String(input || '').toLowerCase()
}

function normalizePath(path) {
  const parts = path.split('/')
  const stack = []

  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop()
      } else {
        stack.push('..')
      }
      continue
    }
    stack.push(part)
  }

  return stack.join('/')
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'this', 'that', 'assessing',
  'beyond', 'visual', 'user', 'generated', 'content', 'paper', 'work',
])

export function loadPapers() {
  return parseModules(paperModules, 'paper')
}

export function loadGames() {
  return parseModules(gameModules, 'game')
}

export function loadOthers() {
  return parseModules(otherModules, 'other')
}

export function loadAllContent() {
  return {
    paper: loadPapers(),
    game: loadGames(),
    other: loadOthers(),
  }
}
