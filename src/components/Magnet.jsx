import { useState, useEffect, useRef } from 'react';

const Magnet = ({
  children,
  padding = 80,
  disabled = false,
  magnetStrength = 1.1, // Lower value = closer to cursor (1.0 is 1:1)
  lerpSpeed = 12,       // Speed of the butter-smooth following effect
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  if (isTouchDevice) return <>{children}</>

  const [isActive, setIsActive] = useState(false);
  const magnetRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    if (disabled) {
      if (innerRef.current) {
        innerRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animationFrameId = null;
    let lastTime = performance.now();

    const animate = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Frame-rate independent linear interpolation (lerp)
      const t = 1 - Math.exp(-lerpSpeed * dt);
      currentX += (targetX - currentX) * t;
      currentY += (targetY - currentY) * t;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      const distanceToTarget = Math.sqrt(
        (targetX - currentX) ** 2 + (targetY - currentY) ** 2
      );

      // If mouse left and we are back at the center (0,0), stop the loop
      if (!isHovering && distanceToTarget < 0.05) {
        currentX = 0;
        currentY = 0;
        if (innerRef.current) {
          innerRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        animationFrameId = null;
      } else if (isHovering && distanceToTarget < 0.05) {
        // Hovering but reached target position (e.g. mouse stopped moving)
        currentX = targetX;
        currentY = targetY;
        if (innerRef.current) {
          innerRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        }
        animationFrameId = null;
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        isHovering = true;
        setIsActive(true);

        targetX = (e.clientX - centerX) / magnetStrength;
        targetY = (e.clientY - centerY) / magnetStrength;

        if (!animationFrameId) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        }
      } else {
        if (isHovering) {
          isHovering = false;
          setIsActive(false);
          targetX = 0;
          targetY = 0;
          if (!animationFrameId) {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(animate);
          }
        }
      }
    };

    const handleMouseLeave = () => {
      if (isHovering) {
        isHovering = false;
        setIsActive(false);
        targetX = 0;
        targetY = 0;
        if (!animationFrameId) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [padding, disabled, magnetStrength, lerpSpeed]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          display: 'inline-block',
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
