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
        // Create procedural brushed metal texture
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        // Base metal color
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, 512, 512);
        
        // Brush strokes
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
        // Create leather texture
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        
        // Base leather color
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.5, '#654321');
        gradient.addColorStop(1, '#4A2C0A');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // Leather grain
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
        // Create carbon fiber pattern
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        
        // Carbon fiber weave pattern
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, 128, 128);
        
        // Weave pattern
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
        // Create vintage watch dial texture
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        // Base dial color - cream/ivory
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, '#FFF8DC');
        gradient.addColorStop(0.8, '#F5F5DC');
        gradient.addColorStop(1, '#E5E5E5');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Subtle aging marks
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