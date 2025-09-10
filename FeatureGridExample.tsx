import React from 'react';
import FeatureGrid from './FeatureGrid';

// Example usage of the FeatureGrid component
const FeatureGridExample: React.FC = () => {
  // Using default features (now includes details)
  const DefaultExample = () => (
    <div>
      <h2>Default Features (with Details)</h2>
      <FeatureGrid />
    </div>
  );

  // Custom features example
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
    },
    {
      title: "Offline Mode",
      body: "Access your watchlist and recommendations even without internet.",
      icon: "📱",
      details: "Download your watchlist and recommendations for offline viewing. Perfect for travel or when you're on the go."
    }
  ];

  const CustomExample = () => (
    <div>
      <h2>Custom Features with Details</h2>
      <FeatureGrid features={customFeatures} />
    </div>
  );

  // Features without details
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

  const TextOnlyExample = () => (
    <div>
      <h2>Features Without Details</h2>
      <FeatureGrid features={textOnlyFeatures} />
    </div>
  );

  // Features with state persistence
  const PersistentExample = () => (
    <div>
      <h2>Features with State Persistence</h2>
      <p>Your expanded/collapsed state will be saved and restored when you return to this page.</p>
      <FeatureGrid features={customFeatures} persistState={true} />
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>FeatureGrid Component Examples</h1>
      
      <DefaultExample />
      
      <div style={{ marginTop: '4rem' }}>
        <CustomExample />
      </div>
      
      <div style={{ marginTop: '4rem' }}>
        <TextOnlyExample />
      </div>

      <div style={{ marginTop: '4rem' }}>
        <PersistentExample />
      </div>
    </div>
  );
};

export default FeatureGridExample;
