import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimations = () => {
  useEffect(() => {
    // Initial hero animation
    gsap.from('.hero h1', {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: 'elastic.out(1, 0.75)',
      delay: 0.5,
    });

    gsap.from('.hero p', {
      duration: 1.5,
      y: 50,
      opacity: 0,
      ease: 'elastic.out(1, 0.75)',
      delay: 0.8,
    });

    // Section transitions with wobble effect
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
      // Create wobble timeline for each section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
          scrub: 1,
        }
      });

      // Add wobble animation
      tl.from(section, {
        scale: 0.95,
        opacity: 0,
        y: 100,
        rotation: 2,
        duration: 1,
        ease: 'elastic.out(1, 0.75)',
      })
      .to(section, {
        scale: 1,
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
      });

      // Add content animation
      gsap.from(section.children, {
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'center center',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.75)',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}; 