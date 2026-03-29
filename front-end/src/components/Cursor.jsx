import React, { useEffect, useState } from 'react';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [variant, setVariant] = useState('default');
  const [isHidden, setIsHidden] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    let frameId;
    let x = 0;
    let y = 0;
    let nextX = 0;
    let nextY = 0;

    const animate = () => {
      x += (nextX - x) * 0.22;
      y += (nextY - y) * 0.22;
      setPosition({ x, y });
      frameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      nextX = e.clientX;
      nextY = e.clientY;

      const target = e.target;
      const isCard = !!target.closest('[data-cursor="card"]');
      const isInteractive =
        window.getComputedStyle(target).cursor === 'pointer' ||
        ['BUTTON', 'A', 'LABEL'].includes(target.tagName);

      if (isInteractive) {
        setVariant('interactive');
      } else if (isCard) {
        setVariant('card');
      } else {
        setVariant('default');
      }
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
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const pointerStyle = {
    width: variant === 'interactive' ? '20px' : variant === 'card' ? '18px' : '16px',
    height: variant === 'interactive' ? '24px' : variant === 'card' ? '22px' : '20px',
    background:
      variant === 'interactive'
        ? 'linear-gradient(145deg, #6366f1, #4f46e5)'
        : variant === 'card'
          ? 'linear-gradient(145deg, #64748b, #475569)'
          : 'linear-gradient(145deg, #94a3b8, #64748b)',
    border: '1px solid rgba(255,255,255,0.45)',
    borderRadius: '4px 14px 10px 14px',
    boxShadow:
      variant === 'interactive'
        ? '0 10px 22px rgba(79,70,229,0.35), inset 0 1px 0 rgba(255,255,255,0.45)'
        : '0 8px 18px rgba(15,23,42,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
    transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(-22deg) scale(${isClicked ? 0.92 : 1})`,
    clipPath: 'polygon(10% 0%, 88% 52%, 60% 56%, 68% 95%, 45% 100%, 38% 60%, 10% 75%)',
  };

  const glowStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    width: variant === 'interactive' ? '30px' : '26px',
    height: variant === 'interactive' ? '30px' : '26px',
    background:
      variant === 'interactive'
        ? 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 70%)'
        : 'radial-gradient(circle, rgba(100,116,139,0.18) 0%, rgba(100,116,139,0) 70%)',
  };

  return (
    <>
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-200 ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={pointerStyle}
      />

      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full -ml-3 -mt-3 transition-opacity duration-200 ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={glowStyle}
      />
    </>
  );
};

export default Cursor;