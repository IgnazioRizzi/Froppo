import React, { useEffect, useState } from 'react';

interface ViewTransitionProps {
  children: React.ReactNode;
  viewMode: 'cards' | 'list';
}

const ViewTransition: React.FC<ViewTransitionProps> = ({ children, viewMode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentView, setCurrentView] = useState(viewMode);

  useEffect(() => {
    if (currentView !== viewMode) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setCurrentView(viewMode);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [viewMode, currentView]);

  return (
    <div 
      className={`view-transition ${isTransitioning ? 'transitioning' : ''}`}
      data-view={currentView}
    >
      {children}
    </div>
  );
};

export default ViewTransition;
