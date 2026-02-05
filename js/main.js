document.addEventListener('DOMContentLoaded', () => {
    initParticleTitle();
    initStarfieldAndMeteors();
    initEnhancedNoteRain();
    initTypewriter();
    initScrollAnimations();
    initClickRipple();
    initTiltEffect();
    initMouseTrail();
    // 移除流体背景 - 用户反馈不喜欢
    // initFluidBackground();
});

/* === 1. PARTICLE TEXT TITLE - 粒子爆炸文字标题 === */
function initParticleTitle() {
    const canvas = document.getElementById('particle-title-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const text = '忆古陌烟';
    let particles = [];
    let mouse = { x: null, y: null };

    // 设置canvas尺寸
    function resize() {
        const isMobile = window.innerWidth < 768;
        canvas.width = isMobile ? window.innerWidth * 0.9 : 800;
        canvas.height = isMobile ? 120 : 200;
        initParticles();
    }

    // 生成粒子
    function initParticles() {
        particles = [];
        ctx.fillStyle = '#66CCFF';
        ctx.font = 'bold 80px "M PLUS Rounded 1c", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 采样像素创建粒子
        const gap = 3; // 粒子密度
        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {
                const index = (y * canvas.width + x) * 4;
                const alpha = imageData.data[index + 3];

                if (alpha > 128) {
                    particles.push({
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        size: Math.random() * 2 + 1,
                        color: `hsl(${190 + Math.random() * 20}, 100%, ${60 + Math.random() * 20}%)`
                    });
                }
            }
        }
    }

    // 动画循环 - 移除鼠标交互
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // 绘制静态粒子
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

/* === 2. STARFIELD & METEORS - 星空和流星 === */
function initStarfieldAndMeteors() {
    const canvas = document.getElementById('meteor-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let meteors = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Meteor {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.3;
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 10 + 15;
            this.angle = Math.PI / 4 + Math.random() * 0.5;
            this.opacity = 1;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.01;

            if (this.opacity <= 0 || this.y > canvas.height || this.x > canvas.width) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;

            const gradient = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            gradient.addColorStop(0, '#66CCFF');
            gradient.addColorStop(0.5, 'rgba(102, 204, 255, 0.5)');
            gradient.addColorStop(1, 'transparent');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            ctx.stroke();
            ctx.restore();
        }
    }

    function init() {
        meteors = [];
        for (let i = 0; i < 3; i++) {
            meteors.push(new Meteor());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 随机生成新流星
        if (Math.random() < 0.005) {
            meteors.push(new Meteor());
        }

        meteors.forEach(m => {
            m.update();
            m.draw();
        });

        // 限制流星数量
        if (meteors.length > 10) {
            meteors = meteors.slice(-10);
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();
}

/* === 3. ENHANCED NOTE RAIN - 樱花+音符粒子系统 === */
function initEnhancedNoteRain() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // 音符和樱花符号
    const musicSymbols = ['♪', '♫', '♩', '♬', '✧'];
    const sakuraSymbols = ['❀', '✿', '❁', '🌸'];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 20;
            this.isSakura = Math.random() < 0.4; // 40%樱花，60%音符
            this.symbols = this.isSakura ? sakuraSymbols : musicSymbols;
            this.symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];

            if (this.isSakura) {
                // 樱花下落
                this.speed = -(Math.random() * 0.8 + 0.3);
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 2;
            } else {
                // 音符上升
                this.speed = Math.random() * 1.2 + 0.6;
                this.rotation = 0;
                this.rotationSpeed = 0;
            }

            this.size = Math.random() * 12 + 10;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.color = this.isSakura ? '#FFB7C5' : '#66CCFF';
            this.oscillation = Math.random() * 2;
            this.oscillationSpeed = Math.random() * 0.02 + 0.01;
            this.step = Math.random() * Math.PI * 2;
            this.depth = Math.random(); // 景深效果
        }

        update() {
            if (this.isSakura) {
                this.y -= this.speed; // 下落
                this.rotation += this.rotationSpeed;
            } else {
                this.y -= this.speed; // 上升
            }

            // 移除左右晃动，保持直线运动
            // this.step += this.oscillationSpeed;
            // this.x += Math.sin(this.step) * 0.8;

            // 淡出效果
            if (!this.isSakura && this.y < height * 0.2) {
                this.opacity -= 0.005;
            }

            // 重置条件
            if (this.y < -20 || this.y > height + 20 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);

            const depthSize = this.size * (0.5 + this.depth * 0.5);
            const depthOpacity = this.opacity * (0.3 + this.depth * 0.7);

            ctx.fillStyle = this.color;
            ctx.globalAlpha = depthOpacity;
            ctx.font = `${depthSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);

            ctx.restore();
        }
    }

    function init() {
        resize();
        const particleCount = window.innerWidth < 768 ? 50 : 120;

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
}

/* === 4. TYPEWRITER - 打字机效果 === */
function initTypewriter() {
    const sloganElement = document.getElementById('slogan-text');
    const texts = [
        "天依蓝是 66CCFF ~",
        "今天的 Bug 也是一种旋律",
        "来，给代码加点魔法",
        "Hello World, Hello Tianyi",
        "Connect, 连接你我的世界",
        "吃饱了才有力气写代码"
    ];
    let textIndex = Math.floor(Math.random() * texts.length);
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        let displayText = currentText.substring(0, charIndex);

        sloganElement.innerHTML = displayText + '<span class="cursor">|</span>';

        if (isDeleting) {
            charIndex--;
            typeSpeed = 50;
        } else {
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentText.length + 1) {
            isDeleting = true;
            typeSpeed = 2500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * texts.length);
            } while (texts.length > 1 && nextIndex === textIndex);
            textIndex = nextIndex;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .cursor {
            color: #66CCFF;
            animation: breathe 1s infinite alternate;
            margin-left: 2px;
            font-weight: bold;
        }
        @keyframes breathe {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    type();
}

/* === 5. SCROLL ANIMATIONS - 3D翻页转场 + 进度条动画 === */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // 触发技能进度条动画
                if (entry.target.id === 'skills') {
                    const skillBars = entry.target.querySelectorAll('.spectrum-fill');
                    skillBars.forEach((bar, index) => {
                        const targetWidth = bar.parentElement.querySelector('.spectrum-fill').style.width;
                        // 阶梯式延迟
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, index * 100 + 100);
                    });
                }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/* === 6. CLICK RIPPLE - 点击涟漪 === */
function initClickRipple() {
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('click-ripple');
        ripple.style.left = `${e.pageX}px`;
        ripple.style.top = `${e.pageY}px`;
        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 800);
    });
}

/* === 7. 3D TILT EFFECT - 卡片倾斜 === */
function initTiltEffect() {
    if (window.innerWidth <= 768) return;

    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        // 排除 skills-card-wrapper，避免晃动
        if (card.classList.contains('skills-card-wrapper')) {
            return;
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;

            const rotateX = yPct * -10;
            const rotateY = xPct * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });
}

/* === 8. MOUSE TRAIL - 鼠标粒子拖尾 === */
function initMouseTrail() {
    if (window.innerWidth <= 768) return; // 移动端禁用

    const canvas = document.getElementById('trail-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 2;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = Math.random() > 0.5 ? '#66CCFF' : '#FFB7C5';
            this.symbol = Math.random() > 0.7 ? '✧' : '●';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.98;
        }

        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.font = `${this.size * 3}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    let lastTime = Date.now();
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // 控制生成频率
        if (now - lastTime > 30) {
            for (let i = 0; i < 2; i++) {
                particles.push(new TrailParticle(e.clientX, e.clientY));
            }
            lastTime = now;
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.life > 0);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

/* === 9. WEBGL FLUID BACKGROUND - 流体背景 === */
function initFluidBackground() {
    const canvas = document.getElementById('fluid-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.warn('WebGL not supported, fluid background disabled');
        return;
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    // 简化版流体着色器
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;

        void main() {
            vec2 st = gl_FragCoord.xy / u_resolution;
            vec2 mouse = u_mouse / u_resolution;

            float dist = distance(st, mouse);
            float ripple = sin(dist * 20.0 - u_time * 3.0) * 0.5 + 0.5;
            ripple *= smoothstep(0.5, 0.0, dist);

            vec3 color = vec3(0.4, 0.8, 1.0) * ripple * 0.3;
            gl_FragColor = vec4(color, ripple * 0.5);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = canvas.height - e.clientY;
    });

    let startTime = Date.now();
    function render() {
        const time = (Date.now() - startTime) / 1000;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, time);
        gl.uniform2f(mouseLocation, mouseX, mouseY);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    resize();
    render();
}
