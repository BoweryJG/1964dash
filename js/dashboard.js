class EliteDashboard {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.composer = null;
        
        this.gauges = {};
        this.animations = {};
        this.materials = {};
        this.interactions = {};
        
        this.performanceData = {
            revenue: 85000,
            target: 100000,
            conversion: 23.5,
            calls: 47,
            ranking: 3,
            goalProgress: 85,
            velocity: 75.2,
            pipeline: 320000,
            achievements: 8
        };
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.createSpaceBackground();
        this.createLighting();
        this.createDashboardChassis();
        this.createPerformanceChronometer();
        this.createGoalFuelGauge();
        this.createLeaderboardOdometer();
        this.createPerformanceTachometer();
        this.createAchievementConstellation();
        this.createPipelinePressureGauge();
        this.setupInteractions();
        this.setupPostProcessing();
        this.startAnimationLoop();
        this.hideLoadingScreen();
    }
    
    setupScene() {
        const canvas = document.getElementById('performance-canvas');
        
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera with luxury FOV
        this.camera = new THREE.PerspectiveCamera(
            35, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 8);
        
        // Renderer with premium settings
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Responsive handling
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mobile orientation handling
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.onWindowResize(), 100);
        });
    }
    
    createSpaceBackground() {
        // Deep space geometry
        const spaceGeometry = new THREE.SphereGeometry(500, 64, 32);
        
        // Custom space shader
        const spaceShader = {
            uniforms: {
                time: { value: 0 },
                colorShift: { value: new THREE.Color(0x1a1a2e) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 colorShift;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                void main() {
                    vec2 st = vUv * 100.0;
                    float stars = step(0.998, random(floor(st)));
                    
                    vec3 nebula = mix(
                        vec3(0.1, 0.1, 0.2),
                        vec3(0.2, 0.1, 0.3),
                        sin(time * 0.1 + vPosition.x * 0.1) * 0.5 + 0.5
                    );
                    
                    vec3 color = nebula + stars * vec3(0.8, 0.9, 1.0);
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        };
        
        const spaceMaterial = new THREE.ShaderMaterial(spaceShader);
        spaceMaterial.side = THREE.BackSide;
        
        const spaceSphere = new THREE.Mesh(spaceGeometry, spaceMaterial);
        this.scene.add(spaceSphere);
        
        this.materials.space = spaceMaterial;
        
        // Floating particles
        this.createSpaceParticles();
    }
    
    createSpaceParticles() {
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            colors[i3] = 0.8 + Math.random() * 0.2;
            colors[i3 + 1] = 0.9 + Math.random() * 0.1;
            colors[i3 + 2] = 1.0;
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        
        this.animations.particles = particles;
    }
    
    createLighting() {
        // Ambient lighting for luxury feel
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Key light for metal reflections
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        this.scene.add(keyLight);
        
        // Rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0xD4AF37, 0.3);
        rimLight.position.set(-5, -2, -5);
        this.scene.add(rimLight);
        
        // Point lights for gauge illumination
        const gaugeLight1 = new THREE.PointLight(0xD4AF37, 0.5, 10);
        gaugeLight1.position.set(0, 0, 2);
        this.scene.add(gaugeLight1);
        
        const gaugeLight2 = new THREE.PointLight(0xE5E5E5, 0.3, 8);
        gaugeLight2.position.set(-3, 2, 1);
        this.scene.add(gaugeLight2);
    }
    
    createDashboardChassis() {
        const chassisGroup = new THREE.Group();
        
        // Main dashboard base
        const baseGeometry = new THREE.CylinderGeometry(3.5, 3.8, 0.3, 32);
        const baseMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2a2a2a,
            metalness: 0.8,
            roughness: 0.2,
            envMapIntensity: 1.0
        });
        
        const chassisBase = new THREE.Mesh(baseGeometry, baseMaterial);
        chassisBase.position.y = -0.15;
        chassisBase.receiveShadow = true;
        chassisGroup.add(chassisBase);
        
        // Luxury bezel
        const bezelGeometry = new THREE.TorusGeometry(3.2, 0.1, 16, 32);
        const bezelMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xD4AF37,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
        bezel.rotation.x = -Math.PI / 2;
        chassisGroup.add(bezel);
        
        // Leather padding
        const leatherGeometry = new THREE.RingGeometry(2.8, 3.0, 32);
        const leatherMaterial = new THREE.MeshLambertMaterial({
            color: 0x8B4513,
            transparent: true,
            opacity: 0.8
        });
        
        const leatherRing = new THREE.Mesh(leatherGeometry, leatherMaterial);
        leatherRing.rotation.x = -Math.PI / 2;
        leatherRing.position.y = 0.05;
        chassisGroup.add(leatherRing);
        
        this.scene.add(chassisGroup);
        this.materials.chassis = { base: baseMaterial, bezel: bezelMaterial, leather: leatherMaterial };
    }
    
    createPerformanceChronometer() {
        const chronometerGroup = new THREE.Group();
        
        // Main dial face
        const faceGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.05, 64);
        const faceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.1,
            roughness: 0.8
        });
        
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.rotation.x = -Math.PI / 2;
        chronometerGroup.add(face);
        
        // Hour markers (quarterly targets)
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const markerGeometry = new THREE.BoxGeometry(0.02, 0.15, 0.02);
            const markerMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xE5E5E5,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.x = Math.cos(angle) * 1.6;
            marker.position.z = Math.sin(angle) * 1.6;
            marker.position.y = 0.05;
            chronometerGroup.add(marker);
        }
        
        // Revenue needle
        const needleGeometry = new THREE.ConeGeometry(0.02, 1.4, 8);
        const needleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xD4AF37,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const revenueNeedle = new THREE.Mesh(needleGeometry, needleMaterial);
        revenueNeedle.rotation.x = -Math.PI / 2;
        revenueNeedle.position.y = 0.1;
        chronometerGroup.add(revenueNeedle);
        
        // Center hub
        const hubGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
        const hubMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.3
        });
        
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.position.y = 0.08;
        chronometerGroup.add(hub);
        
        chronometerGroup.position.set(0, 0, 0);
        this.scene.add(chronometerGroup);
        
        this.gauges.chronometer = {
            group: chronometerGroup,
            needle: revenueNeedle,
            value: 0,
            target: 100
        };
    }
    
    createGoalFuelGauge() {
        const fuelGroup = new THREE.Group();
        
        // Gauge housing
        const housingGeometry = new THREE.CylinderGeometry(0.3, 0.25, 1.5, 16);
        const housingMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2a2a2a,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const housing = new THREE.Mesh(housingGeometry, housingMaterial);
        housing.castShadow = true;
        fuelGroup.add(housing);
        
        // Glass tube
        const glassGeometry = new THREE.CylinderGeometry(0.22, 0.18, 1.3, 16);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0,
            transparent: true,
            opacity: 0.3,
            transmission: 0.9
        });
        
        const glassShell = new THREE.Mesh(glassGeometry, glassMaterial);
        fuelGroup.add(glassShell);
        
        // Fuel liquid
        const fuelGeometry = new THREE.CylinderGeometry(0.2, 0.16, 0.1, 16);
        const fuelMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ff88,
            metalness: 0.1,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const fuelLevel = new THREE.Mesh(fuelGeometry, fuelMaterial);
        fuelLevel.position.y = -0.5;
        fuelGroup.add(fuelLevel);
        
        fuelGroup.position.set(-2.5, 0, 0.5);
        fuelGroup.rotation.z = Math.PI;
        this.scene.add(fuelGroup);
        
        this.gauges.fuel = {
            group: fuelGroup,
            liquid: fuelLevel,
            material: fuelMaterial,
            value: 0,
            target: 100
        };
    }
    
    createLeaderboardOdometer() {
        const odometerGroup = new THREE.Group();
        
        // Housing
        const housingGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.3);
        const housingMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const housing = new THREE.Mesh(housingGeometry, housingMaterial);
        odometerGroup.add(housing);
        
        // Digital display background
        const displayGeometry = new THREE.PlaneGeometry(1.0, 0.3);
        const displayMaterial = new THREE.MeshBasicMaterial({
            color: 0x001100,
            transparent: true,
            opacity: 0.9
        });
        
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.z = 0.16;
        odometerGroup.add(display);
        
        // Text display
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = '#00ff00';
        context.font = '24px Courier New';
        context.textAlign = 'center';
        context.fillText('RANK: 03', 128, 40);
        
        const textTexture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({ 
            map: textTexture,
            transparent: true 
        });
        
        const textMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.2),
            textMaterial
        );
        textMesh.position.z = 0.17;
        odometerGroup.add(textMesh);
        
        odometerGroup.position.set(2.5, 1.5, 0);
        odometerGroup.rotation.y = -0.3;
        this.scene.add(odometerGroup);
        
        this.gauges.odometer = {
            group: odometerGroup,
            textMesh: textMesh,
            canvas: canvas,
            context: context,
            texture: textTexture,
            value: 3
        };
    }
    
    createPerformanceTachometer() {
        const tachoGroup = new THREE.Group();
        
        // Tachometer face
        const faceGeometry = new THREE.CylinderGeometry(1.0, 1.0, 0.03, 32);
        const faceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            metalness: 0.2,
            roughness: 0.8
        });
        
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.rotation.x = -Math.PI / 2;
        tachoGroup.add(face);
        
        // RPM markings
        for (let i = 0; i <= 10; i++) {
            const angle = (i / 10) * Math.PI - Math.PI / 2;
            const radius = 0.85;
            
            const markGeometry = new THREE.BoxGeometry(0.01, 0.08, 0.01);
            const markMaterial = new THREE.MeshBasicMaterial({
                color: i > 8 ? 0xff0000 : 0xffffff
            });
            
            const mark = new THREE.Mesh(markGeometry, markMaterial);
            mark.position.x = Math.cos(angle) * radius;
            mark.position.z = Math.sin(angle) * radius;
            mark.position.y = 0.02;
            tachoGroup.add(mark);
        }
        
        // Tachometer needle
        const needleGeometry = new THREE.ConeGeometry(0.015, 0.7, 6);
        const needleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff4444,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const tachoNeedle = new THREE.Mesh(needleGeometry, needleMaterial);
        tachoNeedle.rotation.x = -Math.PI / 2;
        tachoNeedle.position.y = 0.05;
        tachoGroup.add(tachoNeedle);
        
        tachoGroup.position.set(-2, -1.5, 0);
        tachoGroup.rotation.y = 0.3;
        this.scene.add(tachoGroup);
        
        this.gauges.tachometer = {
            group: tachoGroup,
            needle: tachoNeedle,
            value: 0,
            maxValue: 100
        };
    }
    
    createAchievementConstellation() {
        const constellationGroup = new THREE.Group();
        
        // Achievement stars
        const starPositions = [
            { x: 1.5, y: 2, z: -1 },
            { x: 2, y: 1.5, z: -1.2 },
            { x: 1.8, y: 2.5, z: -0.8 },
            { x: 2.3, y: 2.2, z: -1.1 },
            { x: 1.2, y: 2.3, z: -0.9 }
        ];
        
        starPositions.forEach((pos, index) => {
            const starGeometry = new THREE.SphereGeometry(0.03, 8, 6);
            const starMaterial = new THREE.MeshBasicMaterial({
                color: index < this.performanceData.achievements ? 0xD4AF37 : 0x333333,
                transparent: true,
                opacity: index < this.performanceData.achievements ? 1.0 : 0.3
            });
            
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(pos.x, pos.y, pos.z);
            constellationGroup.add(star);
            
            if (index < this.performanceData.achievements) {
                const glowGeometry = new THREE.SphereGeometry(0.05, 8, 6);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: 0xD4AF37,
                    transparent: true,
                    opacity: 0.3
                });
                
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                glow.position.set(pos.x, pos.y, pos.z);
                constellationGroup.add(glow);
            }
        });
        
        this.scene.add(constellationGroup);
        
        this.gauges.constellation = {
            group: constellationGroup,
            stars: constellationGroup.children.filter(child => child.geometry instanceof THREE.SphereGeometry),
            count: this.performanceData.achievements
        };
    }
    
    createPipelinePressureGauge() {
        const pressureGroup = new THREE.Group();
        
        // Pressure gauge body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
        const bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2a2a2a,
            metalness: 0.8,
            roughness: 0.3
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = -Math.PI / 2;
        pressureGroup.add(body);
        
        // Pressure dial
        const dialGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 32);
        const dialMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        
        const dial = new THREE.Mesh(dialGeometry, dialMaterial);
        dial.rotation.x = -Math.PI / 2;
        dial.position.y = 0.03;
        pressureGroup.add(dial);
        
        // Pressure indicator
        const indicatorGeometry = new THREE.ConeGeometry(0.02, 0.3, 6);
        const indicatorMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88
        });
        
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.rotation.x = -Math.PI / 2;
        indicator.position.y = 0.05;
        pressureGroup.add(indicator);
        
        pressureGroup.position.set(2, -1.5, 0);
        pressureGroup.rotation.y = -0.3;
        this.scene.add(pressureGroup);
        
        this.gauges.pressure = {
            group: pressureGroup,
            indicator: indicator,
            value: 0,
            maxValue: 100
        };
    }
    
    setupInteractions() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const onTouch = (event) => {
            event.preventDefault();
            
            const touch = event.touches ? event.touches[0] : event;
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            
            // Add haptic feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        };
        
        // Touch and mouse events
        window.addEventListener('touchstart', onTouch, { passive: false });
        window.addEventListener('mousedown', onTouch);
        
        // Device orientation for parallax
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                const gamma = event.gamma || 0; // Left to right
                const beta = event.beta || 0;   // Front to back
                
                this.camera.position.x += (gamma * 0.001);
                this.camera.position.y += (beta * 0.001);
            });
        }
    }
    
    setupPostProcessing() {
        // Create effect composer for luxury post-processing
        this.composer = new THREE.EffectComposer(this.renderer);
        
        // Base render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Bloom pass for luxury glow
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.5,  // strength
            0.4,  // radius
            0.85  // threshold
        );
        this.composer.addPass(bloomPass);
        
        // Film grain for vintage luxury feel
        const filmPass = new THREE.ShaderPass(THREE.FilmShader);
        filmPass.uniforms.nIntensity.value = 0.15;
        filmPass.uniforms.sIntensity.value = 0.1;
        filmPass.uniforms.sCount.value = 512;
        filmPass.uniforms.grayscale.value = 0;
        this.composer.addPass(filmPass);
        
        // Subtle vignette
        const vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
        vignettePass.uniforms.offset.value = 0.5;
        vignettePass.uniforms.darkness.value = 0.8;
        this.composer.addPass(vignettePass);
        
        // Make sure the final pass renders to screen
        vignettePass.renderToScreen = true;
    }
    
    updateGauges() {
        const time = Date.now() * 0.001;
        
        // Update chronometer needle based on revenue
        if (this.gauges.chronometer) {
            const progress = this.performanceData.revenue / this.performanceData.target;
            const targetRotation = progress * Math.PI * 2 - Math.PI / 2;
            this.gauges.chronometer.needle.rotation.z = THREE.MathUtils.lerp(
                this.gauges.chronometer.needle.rotation.z,
                targetRotation,
                0.02
            );
        }
        
        // Update fuel gauge
        if (this.gauges.fuel) {
            const fuelLevel = this.performanceData.goalProgress / 100;
            const targetY = -0.6 + (fuelLevel * 1.0);
            this.gauges.fuel.liquid.position.y = THREE.MathUtils.lerp(
                this.gauges.fuel.liquid.position.y,
                targetY,
                0.02
            );
            
            // Color change based on level
            const color = fuelLevel > 0.7 ? 0x00ff88 : 
                         fuelLevel > 0.3 ? 0xffaa00 : 0xff4444;
            this.gauges.fuel.material.color.setHex(color);
        }
        
        // Update tachometer
        if (this.gauges.tachometer) {
            const activity = this.performanceData.calls / 100;
            const targetRotation = activity * Math.PI - Math.PI / 2;
            this.gauges.tachometer.needle.rotation.z = THREE.MathUtils.lerp(
                this.gauges.tachometer.needle.rotation.z,
                targetRotation,
                0.02
            );
        }
        
        // Update pressure gauge
        if (this.gauges.pressure) {
            const pressure = this.performanceData.velocity / 100;
            const targetRotation = pressure * Math.PI - Math.PI / 2;
            this.gauges.pressure.indicator.rotation.z = THREE.MathUtils.lerp(
                this.gauges.pressure.indicator.rotation.z,
                targetRotation,
                0.02
            );
        }
        
        // Update ranking display
        if (this.gauges.odometer) {
            this.updateRankingDisplay();
        }
        
        // Simulate data changes for demo
        this.simulateDataUpdates(time);
    }
    
    updateRankingDisplay() {
        const ctx = this.gauges.odometer.context;
        const canvas = this.gauges.odometer.canvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#001100';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = '24px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`RANK: ${String(this.performanceData.ranking).padStart(2, '0')}`, 128, 40);
        
        this.gauges.odometer.texture.needsUpdate = true;
    }
    
    simulateDataUpdates(time) {
        // Simulate realistic performance fluctuations
        this.performanceData.revenue += Math.sin(time * 0.1) * 50;
        this.performanceData.conversion += Math.sin(time * 0.05) * 0.5;
        this.performanceData.calls = 40 + Math.sin(time * 0.08) * 15;
        this.performanceData.velocity = 70 + Math.sin(time * 0.03) * 10;
        
        // Ensure realistic bounds
        this.performanceData.revenue = Math.max(70000, Math.min(95000, this.performanceData.revenue));
        this.performanceData.conversion = Math.max(20, Math.min(30, this.performanceData.conversion));
        this.performanceData.calls = Math.max(30, Math.min(60, this.performanceData.calls));
        this.performanceData.velocity = Math.max(60, Math.min(85, this.performanceData.velocity));
        
        this.performanceData.goalProgress = (this.performanceData.revenue / this.performanceData.target) * 100;
    }
    
    animate() {
        const time = Date.now() * 0.001;
        
        // Update space background
        if (this.materials.space) {
            this.materials.space.uniforms.time.value = time;
        }
        
        // Rotate particles
        if (this.animations.particles) {
            this.animations.particles.rotation.y += 0.0005;
        }
        
        // Update all gauges
        this.updateGauges();
        
        // Subtle camera sway for luxury feel
        this.camera.position.x += Math.sin(time * 0.1) * 0.002;
        this.camera.position.y += Math.cos(time * 0.15) * 0.001;
        
        // Use post-processing composer for final render
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.animate();
        };
        animate();
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update post-processing composer size
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progress = document.getElementById('loadingProgress');
        
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            currentProgress += Math.random() * 15;
            progress.style.width = Math.min(currentProgress, 100) + '%';
            
            if (currentProgress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 800);
                }, 500);
            }
        }, 100);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new EliteDashboard();
});