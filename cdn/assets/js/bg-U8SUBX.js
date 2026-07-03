const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let maxParticles = canvas.width < 768 ? 40 : 80; 

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    maxParticles = canvas.width < 768 ? 40 : 80;
    particles.forEach(p => p.resetIfOutOfBounds());
});

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.hue = Math.random() * 60 + 260;
    }

    resetIfOutOfBounds() {
        if (this.x > canvas.width || this.y > canvas.height) {
            this.init();
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
        ctx.fill();
    }
}

class Wave {
    constructor(yOffset, speed, amplitude, frequency) {
        this.yOffset = yOffset;
        this.speed = speed;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.phase = 0;
    }

    update() {
        this.phase += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 + this.yOffset);
        
        for (let x = 0; x < canvas.width; x += 5) {
            const y = canvas.height / 2 + this.yOffset + 
                        Math.sin(x * this.frequency + this.phase) * this.amplitude;
            ctx.lineTo(x, y);
        }
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.1)');
        gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.15)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.1)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

const waves = [
    new Wave(-100, 0.02, 50, 0.008),
    new Wave(0, 0.015, 70, 0.006),
    new Wave(100, 0.01, 40, 0.01)
];

let time = 0;

function drawGradientBackground() {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
    );
    gradient.addColorStop(0, '#1a0033');
    gradient.addColorStop(0.5, '#0f001f');
    gradient.addColorStop(1, '#0a0015');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFloatingOrbs() {
    const orbCount = 3;
    for (let i = 0; i < orbCount; i++) {
        const x = canvas.width / 2 + Math.sin(time * 0.001 + i * 2) * 200;
        const y = canvas.height / 2 + Math.cos(time * 0.0015 + i * 2) * 150;
        const radius = 100 + Math.sin(time * 0.002 + i) * 30;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `hsla(${270 + i * 20}, 80%, 60%, 0.3)`);
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

function connectParticles() {
    for (let i = 0; i < maxParticles; i++) {
        for (let j = i + 1; j < maxParticles; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - distance / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    drawGradientBackground();
    drawFloatingOrbs();

    waves.forEach(wave => {
        wave.update();
        wave.draw();
    });

    for (let i = 0; i < maxParticles; i++) {
        particles[i].update();
        particles[i].draw();
    }

    connectParticles();

    time++;
    requestAnimationFrame(animate);
}

animate();
