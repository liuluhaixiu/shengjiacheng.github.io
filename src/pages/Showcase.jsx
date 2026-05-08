import { useState } from 'react'
import { loadAllContent } from '../utils/loadMarkdown'
import ExpandableSection from '../components/ExpandableSection'
import './Showcase.css'

function Showcase() {
  const [expanded, setExpanded] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const content = loadAllContent()

  const sections = [
    {
      id: 'paper',
      title: 'Publications',
      icon: '📄',
      iconClass: 'paper',
      items: content.paper,
      color: 'var(--color-paper)',
      emptyMessage: 'No publications yet',
      emptyHint: 'Add .md files to the paper/ folder to display',
    },
    {
      id: 'game',
      title: 'Indie Games',
      icon: '🎮',
      iconClass: 'game',
      items: content.game,
      color: 'var(--color-game)',
      emptyMessage: 'No games yet',
      emptyHint: 'Add .md files to the game/ folder to display',
    },
    {
      id: 'other',
      title: 'Life & More',
      icon: '✨',
      iconClass: 'other',
      items: content.other,
      color: 'var(--color-other)',
      emptyMessage: 'No posts yet',
      emptyHint: 'Add .md files to the other/ folder to display',
    },
  ]

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id)
    setSelectedCard(null)
  }

  const handleCardClick = (cardId) => {
    setSelectedCard(selectedCard === cardId ? null : cardId)
  }

  return (
    <div className="showcase-page">
      <div className="showcase-header">
        <h1>Portfolio</h1>
        <p>Click a module below to explore my publications, games, and personal stories</p>
      </div>

      {sections.map((section) => (
        <ExpandableSection
          key={section.id}
          section={section}
          isExpanded={expanded === section.id}
          selectedCard={selectedCard}
          onToggle={() => handleToggle(section.id)}
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  )
}

export default Showcase
