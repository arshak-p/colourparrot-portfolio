import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  className = '',
  containerStyle = {},
  style = {},
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  as: TagAlias,
  tag = 'h2'
}) => {
  const Tag = TagAlias || tag;
  const finalClassName = `scroll-float ${containerClassName} ${className}`.trim();
  const finalStyle = { ...containerStyle, ...style };
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    let charIndex = 0;
    const processNode = (node) => {
      if (typeof node === 'string') {
        return node.split(/(\s+)/).map((word, wIdx) => {
          if (word.trim() === '') {
            return word.split('').map(char => {
              const key = charIndex++;
              return <span className="char" key={key}>{'\u00A0'}</span>;
            });
          }
          return (
            <span key={`w-${wIdx}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {word.split('').map((char) => {
                const key = charIndex++;
                return (
                  <span className="char" key={key}>
                    {char}
                  </span>
                );
              })}
            </span>
          );
        });
      }
      if (React.isValidElement(node)) {
        if (node.props.className && typeof node.props.className === 'string' && node.props.className.includes('shiny-colour')) {
          const key = charIndex++;
          return (
            <span className="char" key={key} style={{ display: 'inline-block' }}>
              {node}
            </span>
          );
        }
        return React.cloneElement(node, {
          children: React.Children.map(node.props.children, processNode)
        });
      }
      return node;
    };
    return React.Children.map(children, processNode);
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.char');

    gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <Tag ref={containerRef} className={finalClassName} style={finalStyle}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Tag>
  );
};

export default ScrollFloat;
