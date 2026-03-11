import React, { useEffect, useState } from 'react';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        ['BUTTON', 'A', 'label'].includes(target.tagName)
      );
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleFocusIn = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        setIsHidden(true);
      }
    };

    const handleFocusOut = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return (
    <>
      {/* The Central Point */}
      <div 
        className={`fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] transition-opacity duration-300 ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isClicked ? 0.5 : 1})`,
        }}
      />
      
      {/* The Adaptive Outer Ring */}
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white/40 transition-all duration-300 ease-out ${
          isHidden ? 'opacity-0 scale-0' : 'opacity-100'
        } ${
          isPointer 
            ? 'w-10 h-10 -ml-5 -mt-5 bg-white/15 border-white/60' 
            : 'w-6 h-6 -ml-3 -mt-3'
        }`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isClicked ? 0.8 : 1})`,
        }}
      />
    </>
  );
};

export default Cursor;