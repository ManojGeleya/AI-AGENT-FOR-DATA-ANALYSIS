function Background3D() {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // 3D perspective constants
        const fov = 250; 
        const speed = 2; // Movement speed

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(width * 0.5, 400); // Responsive count
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width - width / 2,
                    y: Math.random() * height - height / 2,
                    z: Math.random() * width, // Depth
                    color: Math.random() > 0.5 ? '#6366f1' : '#a855f7' // Indigo or Purple
                });
            }
        };

        const render = () => {
            ctx.fillStyle = '#0f172a'; // Match bg-slate-900
            ctx.fillRect(0, 0, width, height);
            
            // Add a subtle gradient overlay
            const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
            gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Sort particles by Z for correct depth rendering (painters algorithm)
            particles.sort((a, b) => b.z - a.z);

            particles.forEach(p => {
                // Move particle towards viewer
                p.z -= speed;

                // Reset if passes viewer
                if (p.z <= 0) {
                    p.z = width;
                    p.x = Math.random() * width - width / 2;
                    p.y = Math.random() * height - height / 2;
                }

                // Project 3D coordinates to 2D screen
                const scale = fov / (fov + p.z);
                const x2d = (p.x * scale) + width / 2;
                const y2d = (p.y * scale) + height / 2;
                
                // Draw particle
                const size = (1 - p.z / width) * 4; // Closer = bigger
                const alpha = (1 - p.z / width); // Closer = more opaque
                
                ctx.beginPath();
                ctx.arc(x2d, y2d, Math.max(0, size), 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.fill();

                // Draw connecting lines to nearby particles (neural network effect)
                // Only for closest particles to avoid performance hit
                if (p.z < width * 0.3) {
                     particles.forEach(p2 => {
                        if (p !== p2 && Math.abs(p.z - p2.z) < 50) {
                             const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                             if (dist < 100) {
                                 const scale2 = fov / (fov + p2.z);
                                 const x2d2 = (p2.x * scale2) + width / 2;
                                 const y2d2 = (p2.y * scale2) + height / 2;
                                 
                                 ctx.beginPath();
                                 ctx.moveTo(x2d, y2d);
                                 ctx.lineTo(x2d2, y2d2);
                                 ctx.strokeStyle = p.color;
                                 ctx.lineWidth = 0.5;
                                 ctx.globalAlpha = alpha * 0.2; // Faint lines
                                 ctx.stroke();
                             }
                        }
                     });
                }
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(render);
        };

        window.addEventListener('resize', resize);
        resize();
        render();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}