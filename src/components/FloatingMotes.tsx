import React, { useEffect, useState } from 'react';

interface Mote {
    id: number;
    char: string;
    left: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
}

const PARTICLES = ['$', '💳', '💵', '🪙', '$', '🪙', '💳', '💵'];

export default function FloatingMotes() {
    const [motes, setMotes] = useState<Mote[]>([]);

    useEffect(() => {
        // Generate random floating particles
        const generated: Mote[] = Array.from({ length: 24 }).map((_, i) => ({
            id: i,
            char: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
            left: Math.random() * 100, // horizontal placement in %
            size: Math.floor(Math.random() * 16) + 16, // size from 16px to 32px
            delay: Math.random() * -30, // distributed start times
            duration: Math.random() * 20 + 20, // speed: 20s to 40s (so they drift gently)
            opacity: Math.random() * 0.35 + 0.25 // clear visibility (0.25 to 0.60)
        }));
        setMotes(generated);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-[15]">
            {motes.map(mote => (
                <div
                    key={mote.id}
                    className="absolute text-yellow-400/80 animate-float"
                    style={{
                        left: `${mote.left}%`,
                        fontSize: `${mote.size}px`,
                        animationDelay: `${mote.delay}s`,
                        animationDuration: `${mote.duration}s`,
                        bottom: '-50px',
                        opacity: mote.opacity,
                        transformOrigin: 'center center'
                    }}
                >
                    {mote.char}
                </div>
            ))}
        </div>
    );
}
