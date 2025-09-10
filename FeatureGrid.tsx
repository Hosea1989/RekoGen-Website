import React, { useState, useEffect } from 'react';

interface Feature {
  title: string;
  body: string;
  icon?: React.ReactNode;
  details?: string; // Optional additional details (max 50 words)
}

interface FeatureGridProps {
  features?: Feature[];
  className?: string;
  persistState?: boolean; // Optional: persist expanded state
}

const defaultFeatures: Feature[] = [
  { 
    title: "Smarter Picks", 
    body: "AI learns your taste to surface anime you'll actually enjoy.",
    icon: "🎯",
    details: "Our recommendation engine analyzes your watching patterns, ratings, and preferences to suggest shows that match your unique taste profile."
  },
  { 
    title: "Realms Community", 
    body: "Join vibrant spaces to discuss, share, and connect around favorites.",
    icon: "🏠",
    details: "Create and join themed communities around specific anime, genres, or topics. Share thoughts, theories, and discover new perspectives."
  },
  { 
    title: "Where to Watch", 
    body: "See streaming availability instantly across platforms—no more searching.",
    icon: "📺",
    details: "Instantly see which streaming services have your anime and launch them directly from the app with one tap."
  },
  { 
    title: "Watchlist & Progress", 
    body: "Track what you're watching and manage your queue effortlessly.",
    icon: "📱",
    details: "Keep detailed track of your anime journey with episode progress, ratings, completion stats, and personalized recommendations."
  },
  { 
    title: "Built for Fans", 
    body: "Fast, clean, cross-device experience that syncs preferences and communities.",
    icon: "🚀",
    details: "Designed specifically for anime enthusiasts with smooth animations, dark/light themes, and seamless cross-device synchronization."
  }
];

const FeatureGrid: React.FC<FeatureGridProps> = ({ 
  features = defaultFeatures, 
  className = "",
  persistState = false
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // Load persisted state from localStorage
  useEffect(() => {
    if (persistState) {
      const saved = localStorage.getItem('featureGrid-expanded');
      if (saved) {
        try {
          const expanded = JSON.parse(saved);
          setExpandedCards(new Set(expanded));
        } catch (e) {
          console.warn('Failed to load persisted feature grid state');
        }
      }
    }
  }, [persistState]);

  // Save state to localStorage
  const saveExpandedState = (expanded: Set<number>) => {
    if (persistState) {
      localStorage.setItem('featureGrid-expanded', JSON.stringify([...expanded]));
    }
  };

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
    saveExpandedState(newExpanded);
  };

  return (
    <div className={`feature-grid ${className}`}>
      <style jsx>{`
        .feature-grid {
          display: grid;
          gap: 1.5rem;
          width: 100%;
        }

        /* Mobile: 1 column */
        .feature-grid {
          grid-template-columns: 1fr;
        }

        /* Tablet: 2 columns */
        @media (min-width: 768px) {
          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Desktop: 4-5 columns if width allows */
        @media (min-width: 1200px) {
          .feature-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            max-width: 1400px;
            margin: 0 auto;
          }
        }

        .feature-card {
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--card-border, #e5e7eb);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
          outline: none;
        }

        .feature-card:hover,
        .feature-card:focus {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.06);
          border-color: var(--primary-color, #6d5ef9);
        }

        .feature-card:focus {
          outline: 2px solid var(--primary-color, #6d5ef9);
          outline-offset: 2px;
        }

        .feature-icon {
          font-size: 3rem;
          line-height: 1;
          display: inline-block;
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(109, 94, 249, 0.15), rgba(56, 189, 248, 0.12));
          border: 2px solid rgba(109, 94, 249, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover .feature-icon,
        .feature-card:focus .feature-icon {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(109, 94, 249, 0.25);
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.75rem 0;
          color: var(--text-primary, #111827);
          line-height: 1.3;
        }

        .feature-body {
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0 0 1rem 0;
          color: var(--text-secondary, #6b7280);
        }

        .feature-details-toggle {
          background: none;
          border: none;
          color: var(--primary-color, #6d5ef9);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem 0;
          margin: 0;
          transition: color 0.2s ease;
          outline: none;
        }

        .feature-details-toggle:hover {
          color: var(--primary-color-dark, #5846f5);
          text-decoration: underline;
        }

        .feature-details-toggle:focus {
          outline: 2px solid var(--primary-color, #6d5ef9);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .feature-details {
          overflow: hidden;
          transition: height 0.3s ease, opacity 0.3s ease;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--card-border, #e5e7eb);
        }

        .feature-details-content {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-secondary, #6b7280);
          margin: 0;
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .feature-card {
            background: var(--card-bg-dark, #1f2937);
            border-color: var(--card-border-dark, #374151);
          }

          .feature-title {
            color: var(--text-primary-dark, #f9fafb);
          }

          .feature-body,
          .feature-details-content {
            color: var(--text-secondary-dark, #9ca3af);
          }

          .feature-icon {
            background: linear-gradient(135deg, rgba(109, 94, 249, 0.2), rgba(56, 189, 248, 0.15));
            border-color: rgba(109, 94, 249, 0.25);
          }

          .feature-details {
            border-top-color: var(--card-border-dark, #374151);
          }
        }

        /* Mobile adjustments */
        @media (max-width: 767px) {
          .feature-grid {
            gap: 1rem;
          }

          .feature-card {
            padding: 1.25rem;
          }

          .feature-icon {
            font-size: 2.5rem;
            width: 70px;
            height: 70px;
            border-radius: 18px;
          }

          .feature-title {
            font-size: 1.1rem;
          }

          .feature-body {
            font-size: 0.9rem;
          }

          .feature-details-content {
            font-size: 0.85rem;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .feature-card,
          .feature-icon,
          .feature-details {
            transition: none;
          }
        }
      `}</style>

      {features.map((feature, index) => (
        <article 
          key={index}
          className="feature-card"
          tabIndex={0}
          role="article"
          aria-labelledby={`feature-title-${index}`}
        >
          {feature.icon && (
            <div className="feature-icon" aria-hidden="true">
              {feature.icon}
            </div>
          )}
          <h3 
            id={`feature-title-${index}`}
            className="feature-title"
          >
            {feature.title}
          </h3>
          <p className="feature-body">
            {feature.body}
          </p>
          
          {feature.details && (
            <>
              <button
                className="feature-details-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCard(index);
                }}
                aria-expanded={expandedCards.has(index)}
                aria-controls={`feature-details-${index}`}
              >
                {expandedCards.has(index) ? 'Less details' : 'More details'}
              </button>
              
              <div 
                className="feature-details"
                id={`feature-details-${index}`}
                style={{
                  height: expandedCards.has(index) ? 'auto' : '0',
                  opacity: expandedCards.has(index) ? '1' : '0'
                }}
                aria-hidden={!expandedCards.has(index)}
              >
                <p className="feature-details-content">
                  {feature.details}
                </p>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
};

export default FeatureGrid;
