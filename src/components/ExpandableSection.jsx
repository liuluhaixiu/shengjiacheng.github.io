import MarkdownCard from './MarkdownCard'
import '../pages/Showcase.css'

function ExpandableSection({ section, isExpanded, selectedCard, onToggle, onCardClick }) {
  return (
    <div className={`expandable-section${isExpanded ? ' expanded' : ''}`}>
      <div className="section-header" onClick={onToggle}>
        <div className="section-header-left">
          <div className={`section-icon ${section.iconClass}`}>
            {section.icon}
          </div>
          <div className="section-title-area">
            <h2>{section.title}</h2>
            <div className="section-count">{section.items.length} items</div>
          </div>
        </div>
        <span className="section-arrow">▼</span>
      </div>
      <div className="section-body">
        {section.items.length > 0 ? (
          <div className="section-cards">
            {section.items.map((item) => (
              <MarkdownCard
                key={item.id}
                item={item}
                isSelected={selectedCard === item.id}
                category={section.id}
                onClick={() => onCardClick(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-section">
            <p>{section.emptyMessage}</p>
            <p className="hint">{section.emptyHint}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpandableSection
