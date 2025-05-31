import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

class LuxuryMaterials {
    constructor() {
        this.materials = {};
        this.textures = {};
        this.init();
    }
    
    init() {
        this.createBrushedMetalMaterial();
        this.createLeatherMaterial();
        this.createCarbonFiberMaterial();
        this.createCrystalMaterial();
        this.createVintageDialMaterial();
    }
    
    createBrushedMetalMaterial() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, 512, 512);
        
        for (let i = 0; i < 200; i++) {
            ctx.strokeStyle = `rgba(${120 + Math.random() * 40}, ${120 + Math.random() * 40}, ${120 + Math.random() * 40}, 0.1)`;
            ctx.lineWidth = Math.random() * 2;
            ctx.beginPath();
            ctx.moveTo(0, Math.random() * 512);
            ctx.lineTo(512, Math.random() * 512);
            ctx.stroke();
        }
        
        const brushedTexture = new THREE.CanvasTexture(canvas);
        brushedTexture.wrapS = THREE.RepeatWrapping;
        brushedTexture.wrapT = THREE.RepeatWrapping;
        
        this.materials.brushedMetal = new THREE.MeshPhysicalMaterial({
            color: 0x404040,
            metalness: 0.9,
            roughness: 0.1,
            map: brushedTexture,
            envMapIntensity: 1.0
        });
        
        this.textures.brushed = brushedTexture;
    }
    
    createLeatherMaterial() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.5, '#654321');
        gradient.addColorStop(1, '#4A2C0A');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = Math.random() * 3;
            
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const leatherTexture = new THREE.CanvasTexture(canvas);
        
        this.materials.leather = new THREE.MeshLambertMaterial({
            color: 0x8B4513,
            map: leatherTexture
        });
        
        this.textures.leather = leatherTexture;
    }
    
    createCarbonFiberMaterial() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, 128, 128);
        
        for (let x = 0; x < 128; x += 8) {
            for (let y = 0; y < 128; y += 8) {
                if ((Math.floor(x / 8) + Math.floor(y / 8)) % 2) {
                    ctx.fillStyle = '#333333';
                    ctx.fillRect(x, y, 8, 8);
                }
            }
        }
        
        const carbonTexture = new THREE.CanvasTexture(canvas);
        carbonTexture.wrapS = THREE.RepeatWrapping;
        carbonTexture.wrapT = THREE.RepeatWrapping;
        
        this.materials.carbonFiber = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.1,
            roughness: 0.3,
            map: carbonTexture
        });
        
        this.textures.carbon = carbonTexture;
    }
    
    createCrystalMaterial() {
        this.materials.crystal = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0,
            transparent: true,
            opacity: 0.3,
            transmission: 0.95,
            thickness: 0.1,
            ior: 1.5
        });
    }
    
    createVintageDialMaterial() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, '#FFF8DC');
        gradient.addColorStop(0.8, '#F5F5DC');
        gradient.addColorStop(1, '#E5E5E5');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 20;
            
            ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.05})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const dialTexture = new THREE.CanvasTexture(canvas);
        
        this.materials.vintageDial = new THREE.MeshLambertMaterial({
            color: 0xFFF8DC,
            map: dialTexture
        });
        
        this.textures.dial = dialTexture;
    }
    
    getMaterial(name) {
        return this.materials[name] || this.materials.brushedMetal;
    }
    
    getTexture(name) {
        return this.textures[name];
    }
}

class EliteDashboard {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.composer = null;
        this.luxuryMaterials = new LuxuryMaterials();
        
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
        
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(
            35, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 8);
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        window.addEventListener('resize', () => this.onWindowResize());
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.onWindowResize(), 100);
        });
    }
    
    createSpaceBackground() {
        const spaceGeometry = new THREE.SphereGeometry(500, 64, 32);
        
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
        // Stronger ambient light for better gauge visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Main key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        this.scene.add(keyLight);
        
        // Rim light for definition
        const rimLight = new THREE.DirectionalLight(0xD4AF37, 0.4);
        rimLight.position.set(-5, -2, -5);
        this.scene.add(rimLight);
        
        // Front gauge illumination
        const gaugeLight1 = new THREE.PointLight(0xD4AF37, 0.8, 15);
        gaugeLight1.position.set(0, 2, 3);
        this.scene.add(gaugeLight1);
        
        // Side gauge illumination
        const gaugeLight2 = new THREE.PointLight(0xE5E5E5, 0.6, 12);
        gaugeLight2.position.set(-3, 2, 2);
        this.scene.add(gaugeLight2);
        
        // Additional front light for gauge faces
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
        frontLight.position.set(0, 0, 10);
        this.scene.add(frontLight);
    }
    
    createDashboardChassis() {
        const chassisGroup = new THREE.Group();
        
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
        
        const bezelGeometry = new THREE.TorusGeometry(3.2, 0.1, 16, 32);
        const bezelMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xD4AF37,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
        bezel.rotation.x = -Math.PI / 2;
        chassisGroup.add(bezel);
        
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
    
    createRevenueDisplays() {
        // Create displays exactly like RANK: 03 for each revenue target
        const targets = [
            { text: '25K', pos: [-1.5, 0.5, 1], color: '#D4AF37' },
            { text: '50K', pos: [1.5, 0.5, 1], color: '#D4AF37' },
            { text: '75K', pos: [-1.5, -0.5, 1], color: '#D4AF37' },
            { text: '100K', pos: [1.5, -0.5, 1], color: '#ff4444' }
        ];
        
        targets.forEach(target => {
            const targetGroup = new THREE.Group();
            
            // MUCH LARGER Housing 
            const housingGeometry = new THREE.BoxGeometry(2.4, 0.8, 0.3);
            const housingMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x1a1a1a,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const housing = new THREE.Mesh(housingGeometry, housingMaterial);
            targetGroup.add(housing);
            
            // MUCH LARGER Display background
            const displayGeometry = new THREE.PlaneGeometry(2.0, 0.6);
            const displayMaterial = new THREE.MeshBasicMaterial({
                color: 0x001100,
                transparent: true,
                opacity: 0.9
            });
            
            const display = new THREE.Mesh(displayGeometry, displayMaterial);
            display.position.z = 0.16;
            targetGroup.add(display);
            
            // MUCH LARGER Text display
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 128;
            
            // Clear background first
            context.fillStyle = '#001100';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // MASSIVE text
            context.fillStyle = target.color;
            context.font = 'bold 64px Courier New';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(target.text, 256, 64);
            
            const textTexture = new THREE.CanvasTexture(canvas);
            const textMaterial = new THREE.MeshBasicMaterial({ 
                map: textTexture,
                transparent: false
            });
            
            const textMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(1.8, 0.5),
                textMaterial
            );
            textMesh.position.z = 0.17;
            targetGroup.add(textMesh);
            
            targetGroup.position.set(target.pos[0], target.pos[1], target.pos[2]);
            this.scene.add(targetGroup);
        });
    }
    
    createHTMLNumbers() {
        // Create HTML overlay numbers that are DEFINITELY visible
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '50px';
        overlay.style.left = '50%';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.zIndex = '1000';
        overlay.style.pointerEvents = 'none';
        overlay.innerHTML = `
            <div style="display: flex; gap: 20px; font-family: Arial; font-weight: bold;">
                <div style="background: red; color: white; padding: 20px; font-size: 48px; border: 5px solid white;">25K</div>
                <div style="background: blue; color: white; padding: 20px; font-size: 48px; border: 5px solid white;">50K</div>
                <div style="background: green; color: white; padding: 20px; font-size: 48px; border: 5px solid white;">75K</div>
                <div style="background: purple; color: white; padding: 20px; font-size: 48px; border: 5px solid white;">100K</div>
            </div>
            <div style="background: black; color: yellow; padding: 15px; font-size: 36px; text-align: center; margin-top: 20px; border: 3px solid yellow;">
                REVENUE TARGETS
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    createDigitDisplay(text, basePos) {
        // Create simple digit patterns using small white boxes
        const boxes = [];
        const boxSize = 0.02;
        const spacing = 0.1;
        
        // Simple patterns for digits/letters
        const patterns = {
            '2': [[0,0],[1,0],[2,0],[2,1],[1,1],[0,1],[0,2],[1,2],[2,2]],
            '5': [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[2,2]],
            'K': [[0,0],[0,1],[0,2],[1,1],[2,0],[2,2]],
            '7': [[0,0],[1,0],[2,0],[2,1],[2,2]],
            '0': [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2]],
            '1': [[1,0],[1,1],[1,2]]
        };
        
        let charX = 0;
        for (let char of text) {
            const pattern = patterns[char] || [];
            pattern.forEach(([x, y]) => {
                const box = new THREE.Mesh(
                    new THREE.BoxGeometry(boxSize, boxSize, boxSize),
                    new THREE.MeshBasicMaterial({ color: 0xffffff })
                );
                box.position.set(
                    basePos[0] + charX + (x * boxSize * 2) - 0.15,
                    basePos[1] + (y * boxSize * 2) - 0.1,
                    basePos[2] + 0.1
                );
                boxes.push(box);
            });
            charX += spacing;
        }
        
        return boxes;
    }
    
    createPerformanceChronometer() {
        const chronometerGroup = new THREE.Group();
        
        const faceGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.05, 64);
        const faceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x404040,
            metalness: 0.1,
            roughness: 0.8,
            emissive: 0x202020
        });
        
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.rotation.x = -Math.PI / 2;
        chronometerGroup.add(face);
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const markerGeometry = new THREE.BoxGeometry(0.02, 0.15, 0.02);
            const markerMaterial = new THREE.MeshBasicMaterial({
                color: 0xD4AF37
            });
            
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.x = Math.cos(angle) * 1.6;
            marker.position.z = Math.sin(angle) * 1.6;
            marker.position.y = 0.05;
            chronometerGroup.add(marker);
            
            // Add SIMPLE BRIGHT RECTANGLES 
            if (i % 3 === 0) {
                const numberBg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 0.2, 0.1),
                    new THREE.MeshBasicMaterial({ color: 0xD4AF37 })
                );
                numberBg.position.x = Math.cos(angle) * 1.1;
                numberBg.position.z = Math.sin(angle) * 1.1;
                numberBg.position.y = 0.15;
                chronometerGroup.add(numberBg);
            }
        }
        
        const needleGeometry = new THREE.ConeGeometry(0.02, 1.4, 8);
        const needleMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444
        });
        
        const revenueNeedle = new THREE.Mesh(needleGeometry, needleMaterial);
        revenueNeedle.rotation.x = -Math.PI / 2;
        revenueNeedle.position.y = 0.1;
        chronometerGroup.add(revenueNeedle);
        
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
        // Create revenue displays in the EXACT same style as RANK: 03
        this.createRevenueDisplays();
        
        // Remove HTML overlay since you want the RANK: 03 style
        // this.createHTMLNumbers();
        
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
        
        const housingGeometry = new THREE.CylinderGeometry(0.3, 0.25, 1.5, 16);
        const housingMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2a2a2a,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const housing = new THREE.Mesh(housingGeometry, housingMaterial);
        housing.castShadow = true;
        fuelGroup.add(housing);
        
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
        
        fuelGroup.position.set(-2.5, 0, 0);
        fuelGroup.rotation.z = 0;
        
        
        // Add fuel gauge label
        const fuelLabelCanvas = document.createElement('canvas');
        const fuelLabelContext = fuelLabelCanvas.getContext('2d');
        fuelLabelCanvas.width = 128;
        fuelLabelCanvas.height = 32;
        
        fuelLabelContext.fillStyle = 'rgba(0, 0, 0, 0.9)';
        fuelLabelContext.fillRect(0, 0, fuelLabelCanvas.width, fuelLabelCanvas.height);
        
        fuelLabelContext.fillStyle = '#00ff88';
        fuelLabelContext.font = 'bold 16px Arial';
        fuelLabelContext.textAlign = 'center';
        fuelLabelContext.fillText('GOAL FUEL', 64, 20);
        
        const fuelLabelTexture = new THREE.CanvasTexture(fuelLabelCanvas);
        const fuelLabelMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.2),
            new THREE.MeshBasicMaterial({ 
                map: fuelLabelTexture,
                transparent: true,
                side: THREE.DoubleSide
            })
        );
        fuelLabelMesh.position.set(-2.5, 1.2, 0);
        fuelLabelMesh.rotation.x = -Math.PI / 2;
        
        this.scene.add(fuelGroup);
        this.scene.add(fuelLabelMesh);
        
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
        
        const housingGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.3);
        const housingMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const housing = new THREE.Mesh(housingGeometry, housingMaterial);
        odometerGroup.add(housing);
        
        const displayGeometry = new THREE.PlaneGeometry(1.0, 0.3);
        const displayMaterial = new THREE.MeshBasicMaterial({
            color: 0x001100,
            transparent: true,
            opacity: 0.9
        });
        
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.z = 0.16;
        odometerGroup.add(display);
        
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
        
        odometerGroup.position.set(2.5, 0, 0);
        odometerGroup.rotation.y = 0;
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
        
        const faceGeometry = new THREE.CylinderGeometry(1.0, 1.0, 0.03, 32);
        const faceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x404040,
            metalness: 0.1,
            roughness: 0.8,
            emissive: 0x202020
        });
        
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.rotation.x = -Math.PI / 2;
        tachoGroup.add(face);
        
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
        
        tachoGroup.position.set(-1.5, -2, 0);
        tachoGroup.rotation.y = 0;
        
        
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
        
        const starPositions = [
            { x: 1.5, y: 2, z: -1 },
            { x: 2, y: 1.5, z: -1.2 },
            { x: 1.8, y: 2.5, z: -0.8 },
            { x: 2.3, y: 2.2, z: -1.1 },
            { x: 1.2, y: 2.3, z: -0.9 }
        ];
        
        starPositions.forEach((pos, index) => {
            // Make ALL stars bright and visible
            const starGeometry = new THREE.SphereGeometry(0.08, 8, 6);
            const starMaterial = new THREE.MeshBasicMaterial({
                color: 0xD4AF37, // All gold
                transparent: false
            });
            
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(pos.x, pos.y, pos.z);
            constellationGroup.add(star);
            
            // Add bright glow to all stars
            const glowGeometry = new THREE.SphereGeometry(0.12, 8, 6);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xD4AF37,
                transparent: true,
                opacity: 0.4
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(pos.x, pos.y, pos.z);
            constellationGroup.add(glow);
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
        
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
        const bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2a2a2a,
            metalness: 0.8,
            roughness: 0.3
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = -Math.PI / 2;
        pressureGroup.add(body);
        
        const dialGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 32);
        const dialMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        
        const dial = new THREE.Mesh(dialGeometry, dialMaterial);
        dial.rotation.x = -Math.PI / 2;
        dial.position.y = 0.03;
        pressureGroup.add(dial);
        
        const indicatorGeometry = new THREE.ConeGeometry(0.02, 0.3, 6);
        const indicatorMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88
        });
        
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.rotation.x = -Math.PI / 2;
        indicator.position.y = 0.05;
        pressureGroup.add(indicator);
        
        pressureGroup.position.set(1.5, -2, 0);
        pressureGroup.rotation.y = 0;
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
            
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        };
        
        window.addEventListener('touchstart', onTouch, { passive: false });
        window.addEventListener('mousedown', onTouch);
        
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                const gamma = event.gamma || 0;
                const beta = event.beta || 0;
                
                this.camera.position.x += (gamma * 0.001);
                this.camera.position.y += (beta * 0.001);
            });
        }
    }
    
    setupPostProcessing() {
        try {
            this.composer = new EffectComposer(this.renderer);
            
            const renderPass = new RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);
            
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.5,
                0.4,
                0.85
            );
            this.composer.addPass(bloomPass);
            
            // Create custom film grain shader
            const filmShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    time: { value: 0 },
                    nIntensity: { value: 0.15 },
                    sIntensity: { value: 0.1 },
                    sCount: { value: 512 },
                    grayscale: { value: 0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D tDiffuse;
                    uniform float time;
                    uniform float nIntensity;
                    uniform float sIntensity;
                    uniform float sCount;
                    uniform bool grayscale;
                    varying vec2 vUv;
                    
                    float random(vec2 n) {
                        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
                    }
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        
                        // Add film grain
                        float dx = random(vUv + time);
                        vec3 cResult = color.rgb + color.rgb * clamp(0.1 + dx, 0.0, 1.0);
                        
                        // Add scanlines
                        vec2 sc = vec2(sin(vUv.y * sCount), cos(vUv.y * sCount));
                        cResult += color.rgb * vec3(sc.x, sc.y, sc.x) * sIntensity;
                        
                        cResult = color.rgb + clamp(nIntensity, 0.0, 1.0) * (cResult - color.rgb);
                        
                        if (grayscale) {
                            cResult = vec3(cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11);
                        }
                        
                        gl_FragColor = vec4(cResult, color.a);
                    }
                `
            };
            
            const filmPass = new ShaderPass(filmShader);
            this.composer.addPass(filmPass);
            
            // Create custom vignette shader
            const vignetteShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    offset: { value: 0.5 },
                    darkness: { value: 0.8 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D tDiffuse;
                    uniform float offset;
                    uniform float darkness;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
                        gl_FragColor = vec4(mix(color.rgb, vec3(1.0 - darkness), dot(uv, uv)), color.a);
                    }
                `
            };
            
            const vignettePass = new ShaderPass(vignetteShader);
            this.composer.addPass(vignettePass);
            
            // Store shader passes for animation
            this.shaderPasses = {
                film: filmPass,
                vignette: vignettePass
            };
            
        } catch (error) {
            console.warn('Post-processing setup failed, falling back to basic rendering:', error);
            this.composer = null;
        }
    }
    
    updateGauges() {
        const time = Date.now() * 0.001;
        
        if (this.gauges.chronometer) {
            const progress = this.performanceData.revenue / this.performanceData.target;
            const targetRotation = progress * Math.PI * 2 - Math.PI / 2;
            this.gauges.chronometer.needle.rotation.z = THREE.MathUtils.lerp(
                this.gauges.chronometer.needle.rotation.z,
                targetRotation,
                0.02
            );
        }
        
        if (this.gauges.fuel) {
            const fuelLevel = this.performanceData.goalProgress / 100;
            const targetY = -0.6 + (fuelLevel * 1.0);
            this.gauges.fuel.liquid.position.y = THREE.MathUtils.lerp(
                this.gauges.fuel.liquid.position.y,
                targetY,
                0.02
            );
            
            const color = fuelLevel > 0.7 ? 0x00ff88 : 
                         fuelLevel > 0.3 ? 0xffaa00 : 0xff4444;
            this.gauges.fuel.material.color.setHex(color);
        }
        
        if (this.gauges.tachometer) {
            const activity = this.performanceData.calls / 100;
            const targetRotation = activity * Math.PI - Math.PI / 2;
            this.gauges.tachometer.needle.rotation.z = THREE.MathUtils.lerp(
                this.gauges.tachometer.needle.rotation.z,
                targetRotation,
                0.02
            );
        }
        
        if (this.gauges.pressure) {
            const pressure = this.performanceData.velocity / 100;
            const targetRotation = pressure * Math.PI - Math.PI / 2;
            this.gauges.pressure.indicator.rotation.z = THREE.MathUtils.lerp(
                this.gauges.pressure.indicator.rotation.z,
                targetRotation,
                0.02
            );
        }
        
        if (this.gauges.odometer) {
            this.updateRankingDisplay();
        }
        
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
        this.performanceData.revenue += Math.sin(time * 0.1) * 50;
        this.performanceData.conversion += Math.sin(time * 0.05) * 0.5;
        this.performanceData.calls = 40 + Math.sin(time * 0.08) * 15;
        this.performanceData.velocity = 70 + Math.sin(time * 0.03) * 10;
        
        this.performanceData.revenue = Math.max(70000, Math.min(95000, this.performanceData.revenue));
        this.performanceData.conversion = Math.max(20, Math.min(30, this.performanceData.conversion));
        this.performanceData.calls = Math.max(30, Math.min(60, this.performanceData.calls));
        this.performanceData.velocity = Math.max(60, Math.min(85, this.performanceData.velocity));
        
        this.performanceData.goalProgress = (this.performanceData.revenue / this.performanceData.target) * 100;
    }
    
    animate() {
        const time = Date.now() * 0.001;
        
        if (this.materials.space) {
            this.materials.space.uniforms.time.value = time;
        }
        
        if (this.animations.particles) {
            this.animations.particles.rotation.y += 0.0005;
        }
        
        // Update shader uniforms for post-processing
        if (this.shaderPasses && this.shaderPasses.film) {
            this.shaderPasses.film.uniforms.time.value = time;
        }
        
        this.updateGauges();
        
        this.camera.position.x += Math.sin(time * 0.1) * 0.002;
        this.camera.position.y += Math.cos(time * 0.15) * 0.001;
        
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

document.addEventListener('DOMContentLoaded', () => {
    new EliteDashboard();
});