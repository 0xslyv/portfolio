import { motion, MotionValue,  type SpringOptions } from 'motion/react';
import React, {  cloneElement, useEffect, useState } from 'react';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

export type DockItemData = {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
};

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  isMobile: boolean;
};

function DockItem({
  children,
  className = '',
  onClick,
  isMobile
}: DockItemProps) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick(e);
  };

  const isInteractive = !!onClick;

  return (
    <motion.div
      onClick={isInteractive ? handleClick : undefined}
      role={isInteractive ? 'button' : 'group'}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      } : undefined}
      // Mobile: Column layout (Icon over Label) | Desktop: Row layout (Icon left of Label)
      className={`
        relative rounded-4xl inline-flex items-center justify-center gap-1.5 align-middle transition-colors duration-200 ease-out
        ${isMobile ? 'flex-col p-1 min-w-[60px]' : 'flex-row px-4 py-2.5 rounded-full hover:bg-primary-text/20'}
        ${className} ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return cloneElement(child as React.ReactElement<any>, { isMobile });
      })}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <span className={`${className} text-[10px] md:text-sm font-medium text-primary-text/90 whitespace-nowrap tracking-tight md:tracking-wide`}>
      {children}
    </span>
  );
}

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`flex items-center justify-center align-middle ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  baseItemSize = 44
}: DockProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <motion.div
      className="fixed inset-x-0 bottom-4 md:bottom-8 flex justify-center z-50 pointer-events-none px-2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.nav
        // Container adapts styling based on mobile/desktop
        className={`
          ${className} flex flex-row items-end gap-1 md:gap-3 p-2 md:p-3 rounded-[2rem] md:rounded-full 
          bg-main/30 backdrop-blur-2xl border border-primary-text/10 shadow-2xl pointer-events-auto
          ${isMobile ? 'w-full justify-around max-w-md' : 'w-auto'}
        `}
      >
        {items.map((item, index) => {
          if (item.label === 'separator') {
            return <div key={`sep-${index}`} className="h-10 w-px bg-primary-text/10 mx-1 self-center" />;
          }

          return (
            <DockItem
              key={index}
              onClick={item.onClick}
              className={item.className}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              isMobile={isMobile} 
            >
              <DockIcon className="text-theme-color">{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          );
        })}
      </motion.nav>
    </motion.div>
  );
}