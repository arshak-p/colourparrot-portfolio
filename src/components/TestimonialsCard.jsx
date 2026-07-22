import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './TestimonialsCard.css';

export function TestimonialsCard({
    items,
    className = "",
    width = 400,
    showNavigation = true,
    showCounter = true,
    autoPlay = false,
    autoPlayInterval = 3000,
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const activeItem = items[activeIndex];

    useEffect(() => {
        if (!autoPlay || items.length <= 1) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, items.length]);

    const handleNext = () => {
        if (activeIndex < items.length - 1) {
            setDirection(1);
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setDirection(-1);
            setActiveIndex(activeIndex - 1);
        }
    };

    const rotations = useMemo(() => [4, -2, -9, 7], []);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className={`tc-container ${className}`}>
            <div
                className="tc-grid"
                style={{ perspective: "1400px", maxWidth: `${width}px` }}
            >
                {/* Counter */}
                {showCounter && (
                    <div className="tc-counter">
                        {activeIndex + 1} / {items.length}
                    </div>
                )}

                {/* Image Card Stack */}
                <div className="tc-stack">
                    <AnimatePresence custom={direction}>
                        {items.map((item, index) => {
                            const isActive = index === activeIndex;
                            const offset = index - activeIndex;

                            return (
                                <motion.div
                                    key={item.id}
                                    className="tc-card"
                                    style={{ borderColor: item.color || 'var(--green)' }}
                                    initial={{
                                        x: offset * 15,
                                        y: Math.abs(offset) * 6,
                                        z: -150 * Math.abs(offset),
                                        scale: 0.85 - Math.abs(offset) * 0.04,
                                        rotateZ: rotations[index % 4],
                                        opacity: isActive ? 1 : 0.5,
                                        zIndex: 10 - Math.abs(offset),
                                    }}
                                    animate={
                                        isActive
                                            ? {
                                                x: [offset * 15, direction === 1 ? -200 : 200, 0],
                                                y: [Math.abs(offset) * 6, 0, 0],
                                                z: [-200, 150, 250],
                                                scale: [0.85, 1.05, 1],
                                                rotateZ: [rotations[index % 4], -5, 0],
                                                opacity: 1,
                                                zIndex: 100,
                                            }
                                            : {
                                                x: offset * 15,
                                                y: Math.abs(offset) * 6,
                                                z: -150 * Math.abs(offset),
                                                rotateZ: rotations[index % 4],
                                                scale: 0.85 - Math.abs(offset) * 0.04,
                                                opacity: 0.55,
                                                zIndex: 10 - Math.abs(offset),
                                            }
                                    }
                                    exit={{
                                        x: direction === 1 ? -250 : 250,
                                        z: -260,
                                        scale: 0.75,
                                        rotateZ: direction === 1 ? -10 : 10,
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.75,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    {item.image ? (
                                      <img
                                          src={item.image}
                                          alt={item.title}
                                          className="tc-image"
                                          draggable={false}
                                      />
                                    ) : (
                                      <div className="tc-initial" style={{ color: item.color || 'var(--green)' }}>
                                        {item.initial}
                                      </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Text Area */}
                <div className="tc-text-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem.id}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -25 }}
                            transition={{ duration: 0.35 }}
                        >
                            <h3 className="tc-title" style={{ color: activeItem.color || 'white' }}>
                                {activeItem.title}
                            </h3>
                            <p className="tc-desc">
                                {activeItem.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                {showNavigation && items.length > 1 && (
                    <div className="tc-nav">
                        <button
                            disabled={activeIndex === 0}
                            onClick={handlePrev}
                            className={`tc-btn ${activeIndex === 0 ? "disabled" : ""}`}
                            aria-label="Previous card"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button
                            disabled={activeIndex === items.length - 1}
                            onClick={handleNext}
                            className={`tc-btn ${activeIndex === items.length - 1 ? "disabled" : ""}`}
                            aria-label="Next card"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TestimonialsCard;
