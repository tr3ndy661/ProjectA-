import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      posX += (mouseX - posX) * 0.1;
      posY += (mouseY - posY) * 0.1;

      if (follower) {
        follower.style.transform = `translate3d(${posX - 25}px, ${posY - 25}px, 0)`;
      }
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    // Add hover effect for links and buttons
    const handleMouseEnter = () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    // Add event listeners for all interactive elements
    const links = document.querySelectorAll('a, button, .nav-link');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
};

export default CustomCursor; 