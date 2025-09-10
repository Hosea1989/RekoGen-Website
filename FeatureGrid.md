# FeatureGrid Component

A responsive, accessible React component for displaying feature cards in a grid layout with optional expandable details.

## Features

- ✅ **Responsive Grid Layout**: 1 column on mobile, 2 on tablet, 4-5 on desktop
- ✅ **Accessible**: Proper ARIA labels, semantic HTML, keyboard navigation
- ✅ **Hover & Focus States**: Subtle lift animation with shadow effects
- ✅ **Dark Theme Support**: Automatically adapts to system preferences
- ✅ **Mobile-First**: Optimized for touch devices with generous spacing
- ✅ **Reduced Motion**: Respects user's motion preferences
- ✅ **TypeScript**: Fully typed with interfaces
- ✅ **Expandable Details**: Optional "More details" disclosure for each card
- ✅ **State Persistence**: Optional localStorage persistence for expanded states

## Usage

### Basic Usage (Default Features)

```tsx
import FeatureGrid from './FeatureGrid';

function App() {
  return (
    <div>
      <h1>Our Features</h1>
      <FeatureGrid />
    </div>
  );
}
```

### Custom Features with Details

```tsx
import FeatureGrid from './FeatureGrid';

const customFeatures = [
  {
    title: "Smart Search",
    body: "Find exactly what you're looking for with intelligent filters.",
    icon: "🔍",
    details: "Advanced search with filters for genre, year, rating, and streaming platform. Get instant results as you type."
  },
  {
    title: "Sync Everywhere", 
    body: "Your preferences and progress sync across all devices seamlessly.",
    icon: "☁️",
    details: "Cloud synchronization ensures your watchlist, ratings, and preferences are always up-to-date across all your devices."
  }
];

function App() {
  return (
    <div>
      <h1>Our Features</h1>
      <FeatureGrid features={customFeatures} />
    </div>
  );
}
```

### Features Without Details

```tsx
const textOnlyFeatures = [
  {
    title: "Fast Performance",
    body: "Lightning-fast loading times and smooth animations throughout."
  },
  {
    title: "Privacy First",
    body: "Your data stays private and secure with end-to-end encryption."
  }
];

<FeatureGrid features={textOnlyFeatures} />
```

### With State Persistence

```tsx
<FeatureGrid 
  features={customFeatures} 
  persistState={true} 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `features` | `Feature[]` | `defaultFeatures` | Array of feature objects to display |
| `className` | `string` | `""` | Additional CSS classes |
| `persistState` | `boolean` | `false` | Whether to persist expanded states in localStorage |

## Feature Interface

```tsx
interface Feature {
  title: string;        // 1-3 words, displayed as h3
  body: string;         // Max 12-15 words, displayed as p
  icon?: ReactNode;     // Optional emoji or SVG icon
  details?: string;     // Optional additional details (max 50 words)
}
```

## Default Features

The component comes with these default features (all include details):

1. **Smarter Picks** — AI learns your taste to surface anime you'll actually enjoy.
   - *Details*: Our recommendation engine analyzes your watching patterns, ratings, and preferences to suggest shows that match your unique taste profile.

2. **Realms Community** — Join vibrant spaces to discuss, share, and connect around favorites.
   - *Details*: Create and join themed communities around specific anime, genres, or topics. Share thoughts, theories, and discover new perspectives.

3. **Where to Watch** — See streaming availability instantly across platforms—no more searching.
   - *Details*: Instantly see which streaming services have your anime and launch them directly from the app with one tap.

4. **Watchlist & Progress** — Track what you're watching and manage your queue effortlessly.
   - *Details*: Keep detailed track of your anime journey with episode progress, ratings, completion stats, and personalized recommendations.

5. **Built for Fans** — Fast, clean, cross-device experience that syncs preferences and communities.
   - *Details*: Designed specifically for anime enthusiasts with smooth animations, dark/light themes, and seamless cross-device synchronization.

## Expandable Details

Each feature card can optionally include additional details that are hidden by default:

- **Toggle Button**: "More details" / "Less details" button
- **Smooth Animation**: Height and opacity transitions
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Motion Respect**: Respects `prefers-reduced-motion` setting
- **State Persistence**: Optional localStorage persistence

## Responsive Behavior

- **Mobile (< 768px)**: 1 column, reduced spacing
- **Tablet (768px - 1199px)**: 2 columns
- **Desktop (≥ 1200px)**: 4-5 columns (auto-fit with minmax 240px)

## Accessibility Features

- Semantic `<article>` elements for each feature
- Proper heading hierarchy with `<h3>` titles
- ARIA labels and relationships
- Keyboard navigation support
- Focus indicators with outline
- Screen reader friendly structure
- Expandable content with proper ARIA attributes

## Styling

The component uses CSS-in-JS with styled-jsx and includes:

- CSS custom properties for theming
- Dark mode support via `prefers-color-scheme`
- Smooth transitions and hover effects
- Mobile-optimized typography
- Reduced motion support
- Expandable content animations

## State Persistence

When `persistState={true}` is enabled:

- Expanded/collapsed states are saved to localStorage
- States are restored when the component mounts
- Uses the key `'featureGrid-expanded'` in localStorage
- Gracefully handles localStorage errors

## Customization

You can customize the appearance by overriding CSS custom properties:

```css
:root {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --primary-color: #6d5ef9;
}
```

## Browser Support

- Modern browsers with CSS Grid support
- Graceful fallback for older browsers
- Progressive enhancement approach
- localStorage support for state persistence
