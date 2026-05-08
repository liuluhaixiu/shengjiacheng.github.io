import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../pages/Showcase.css'

function MarkdownCard({ item, isSelected, category, onClick }) {
  const actionUrl = category === 'paper' ? (item.pdf || item.link) : item.link

  return (
    <div className={`content-card${isSelected ? ' selected' : ''}`}>
      <div className="card-preview" onClick={onClick}>
        {item.image && (
          <div className="card-image-wrapper">
            <img
              src={item.image}
              alt={`${item.title} cover`}
              className="card-image"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
        <h3 className="card-title">{item.title}</h3>
        <div className="card-meta">
          {item.conference && <span>📌 {item.conference}</span>}
          {item.journal && <span>📌 {item.journal}</span>}
          {item.type && <span>🎯 {item.type}</span>}
          {item.date && <span>📅 {item.date}</span>}
        </div>
        {item.description && (
          <p className="card-description">{item.description}</p>
        )}
        {item.abstract && (
          <p className="card-description">{item.abstract}</p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="card-tags">
            {item.tags.map((tag) => (
              <span key={tag} className={`tag ${category}`}>{tag}</span>
            ))}
          </div>
        )}
      </div>
      {isSelected && (
        <div className="card-detail">
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.content}
            </ReactMarkdown>
          </div>
          {actionUrl && (
            <a
              href={actionUrl}
              target={category === 'paper' ? undefined : '_blank'}
              rel={category === 'paper' ? undefined : 'noopener noreferrer'}
              download={category === 'paper' ? '' : undefined}
              className="card-link"
            >
              {category === 'paper' ? 'Download PDF ↗' : 'View Details ↗'}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default MarkdownCard
