/* ═══════════════════════════════════════════════════
   VISTARA TECH — App Controller
   Zara-Inspired Premium UI Engine
   30 Gen Z Trending Earring Collection
   + MediaPipe Face Mesh AR Engine
   ═══════════════════════════════════════════════════ */

(() => {
    'use strict';

    // ── 30 Gen Z Trending Earring Collection ──────────
    let PRODUCTS = [];

    let currentProduct = null;
    let faceMesh = null;
    let mpCamera = null;
    let cameraActive = false;

    // ── Screen Management ─────────────────────────────
    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
            requestAnimationFrame(() => target.classList.add('active'));
        }
        // Stop camera when leaving camera screen
        if (id !== 'camera-screen' && cameraActive) {
            stopCamera();
        }
    }

    // ── Loading Screen ────────────────────────────────
    function initLoading() {
        const bar = document.getElementById('loading-bar');
        if (bar) {
            requestAnimationFrame(() => { bar.style.width = '100%'; });
        }
        setTimeout(() => showScreen('login-screen'), 2800);
    }

    // ── Login Screen ──────────────────────────────────
    function initLogin() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                showScreen('products-screen');
            });
        }
    }

    // ── Category Filter ───────────────────────────────
    let activeCategory = 'all';

    function renderCategoryBar() {
        const container = document.getElementById('category-bar');
        if (!container) return;

        const simplified = [
            { label: 'All', value: 'all' },
            { label: 'Dangles', value: 'dangle' },
            { label: 'Studs', value: 'stud' },
            { label: 'Hoops', value: 'hoop' },
            { label: 'Cuffs', value: 'cuff' },
            { label: 'Trending', value: 'trending' },
        ];

        container.innerHTML = simplified.map(cat => `
      <button class="category-chip ${cat.value === activeCategory ? 'active' : ''}" 
              data-category="${cat.value}" 
              title="Filter by ${cat.label}">
        ${cat.label}
      </button>
    `).join('');

        container.querySelectorAll('.category-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.category;
                container.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProducts();
            });
        });
    }

    function getFilteredProducts() {
        if (activeCategory === 'all') return PRODUCTS;
        if (activeCategory === 'dangle') return PRODUCTS.filter(p => p.isDangle);
        if (activeCategory === 'stud') return PRODUCTS.filter(p => p.type.toLowerCase().includes('stud'));
        if (activeCategory === 'hoop') return PRODUCTS.filter(p => p.type.toLowerCase().includes('hoop') || p.type.toLowerCase().includes('huggie'));
        if (activeCategory === 'cuff') return PRODUCTS.filter(p => p.type.toLowerCase().includes('cuff') || p.type.toLowerCase().includes('climber'));
        if (activeCategory === 'trending') return PRODUCTS.filter(p =>
            ['Y2K Charm', 'Celestial', 'Edgy Minimal', 'Mixed Metal', 'Baroque Pearl'].includes(p.type)
        );
        return PRODUCTS;
    }

    // ── Product Grid ──────────────────────────────────
    function renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const filtered = getFilteredProducts();
        const count = document.querySelector('.section-count');
        if (count) count.textContent = `${filtered.length} pieces`;

        grid.innerHTML = filtered.map((p, i) => `
      <div class="product-card" data-product-id="${p.id}" style="animation: fadeInUp 0.5s ease ${0.04 * (i + 1)}s both">
        <div class="product-image-wrapper">
          <img src="${p.image}" alt="${p.name}" loading="lazy" 
               style="${p.filter ? 'filter:' + p.filter : ''}">
          <div class="product-overlay">
            <button class="btn-tryon" data-id="${p.id}" title="Try on ${p.name}">Try On</button>
          </div>
        </div>
        <div class="product-meta">
          <div>
            <div class="product-name">${p.name}</div>
            <div class="product-type">${p.type}</div>
          </div>
          <div class="product-price">${p.price}</div>
        </div>
      </div>
    `).join('');

        grid.querySelectorAll('.btn-tryon').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id, 10);
                openCamera(id);
            });
        });
    }

    // ═══════════════════════════════════════════════════
    // AR CAMERA — MediaPipe Face Mesh
    // ═══════════════════════════════════════════════════

    /*
     * MediaPipe Face Mesh Landmark Index Reference:
     *   234 = Right ear tragion (right side of face)
     *   454 = Left ear tragion (left side of face)
     *   10  = Forehead top (for scale reference)
     *   152 = Chin bottom (for face height/scale)
     *   
     * Because the webcam video is MIRRORED (scaleX(-1)),
     * but landmark coordinates are from the raw video,
     * we need to mirror X: displayX = containerWidth - landmarkX
     */

    const EAR_LANDMARK_RIGHT = 234;  // Right ear in raw video = LEFT on mirrored display
    const EAR_LANDMARK_LEFT = 454;  // Left ear in raw video = RIGHT on mirrored display
    const FOREHEAD_TOP = 10;
    const CHIN_BOTTOM = 152;

    // Smoothing for earring position (prevents jitter)
    const smoothing = 0.35;
    let prevLeftPos = null;
    let prevRightPos = null;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function initFaceMesh() {
        if (typeof FaceMesh === 'undefined') {
            console.warn('MediaPipe FaceMesh not loaded yet');
            return null;
        }

        const fm = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        fm.onResults(onFaceMeshResults);
        return fm;
    }

    function onFaceMeshResults(results) {
        const statusEl = document.getElementById('detection-status');
        const leftEarring = document.getElementById('earring-left');
        const rightEarring = document.getElementById('earring-right');
        const msgEl = document.getElementById('camera-status-msg');

        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            // No face detected
            if (statusEl) statusEl.textContent = 'No face detected — look at camera';
            if (leftEarring) leftEarring.classList.remove('visible');
            if (rightEarring) rightEarring.classList.remove('visible');
            prevLeftPos = null;
            prevRightPos = null;
            return;
        }

        // Hide initialization message
        if (msgEl) msgEl.classList.add('hidden');
        if (statusEl) statusEl.textContent = 'Face detected — earrings placed';

        const landmarks = results.multiFaceLandmarks[0];
        const feed = document.getElementById('camera-feed');
        const videoEl = document.getElementById('webcam');
        if (!videoEl || !videoEl.videoWidth) return;

        const feedW = feed.offsetWidth;
        const feedH = feed.offsetHeight;

        // Calculate actual rendered video dimensions due to object-fit: cover
        const videoRatio = videoEl.videoWidth / videoEl.videoHeight;
        const containerRatio = feedW / feedH;
        let renderW, renderH, offsetX, offsetY;

        if (containerRatio > videoRatio) {
            renderW = feedW;
            renderH = feedW / videoRatio;
            offsetX = 0;
            offsetY = (renderH - feedH) / 2;
        } else {
            renderH = feedH;
            renderW = feedH * videoRatio;
            offsetX = (renderW - feedW) / 2;
            offsetY = 0;
        }

        // Calculate face scale from forehead to chin
        // Face height is mapped using renderH
        const foreheadY = (landmarks[FOREHEAD_TOP].y * renderH) - offsetY;
        const chinY = (landmarks[CHIN_BOTTOM].y * renderH) - offsetY;
        const faceHeight = Math.abs(chinY - foreheadY);

        // Earring size relative to face height
        const scale = currentProduct.scale || 1.0;
        const earringHeight = faceHeight * 0.45 * scale;
        const earringWidth = earringHeight * 0.6; // Aspect ratio

        // ── Right ear (raw) → displayed on LEFT side (mirrored) ──
        // Landmark 177 is the lower cheek/jawline right near the earlobe (more accurate than 234 tragion)
        const EAR_LOBE_RIGHT = 177;
        const rawRightX = (landmarks[EAR_LOBE_RIGHT].x * renderW) - offsetX;
        const rawRightY = (landmarks[EAR_LOBE_RIGHT].y * renderH) - offsetY;
        const mirroredRightX = feedW - rawRightX;

        // ── Left ear (raw) → displayed on RIGHT side (mirrored) ──
        // Landmark 401 is the lower cheek/jawline right near the earlobe
        const EAR_LOBE_LEFT = 401;
        const rawLeftX = (landmarks[EAR_LOBE_LEFT].x * renderW) - offsetX;
        const rawLeftY = (landmarks[EAR_LOBE_LEFT].y * renderH) - offsetY;
        const mirroredLeftX = feedW - rawLeftX;

        // ── Head Rotation (Occlusion) Detection ──
        // Landmark 1 is the nose tip
        const noseX = (landmarks[1].x * renderW) - offsetX;

        // Calculate horizontal distance from nose to each earlobe in rendered space
        const distToRightEar = Math.abs(noseX - rawRightX);
        const distToLeftEar = Math.abs(rawLeftX - noseX);

        // When the head turns, the ear turning away gets closer to the nose in 2D projection.
        // If distance ratio falls below 0.35, that ear is effectively hidden behind the head.
        const turnRatioRight = distToRightEar / (distToLeftEar + 1); // Physical right ear (UI left)
        const turnRatioLeft = distToLeftEar / (distToRightEar + 1); // Physical left ear (UI right)

        const showPhysicalRightEar = turnRatioRight > 0.35; // Controls leftEarring UI
        const showPhysicalLeftEar = turnRatioLeft > 0.35;  // Controls rightEarring UI

        // Fine-tune offsets to snap exactly to earlobe
        // Move slightly inward towards face center, and up
        const inwardOffset = earringWidth * 0.3;
        const verticalOffset = -earringHeight * 0.15; // Shift UP slightly

        let targetLeftX = mirroredLeftX - (earringWidth / 2) - inwardOffset;
        let targetLeftY = rawLeftY + verticalOffset;
        let targetRightX = mirroredRightX - (earringWidth / 2) + inwardOffset;
        let targetRightY = rawRightY + verticalOffset;

        // Apply smoothing to prevent jitter
        if (prevLeftPos) {
            targetLeftX = lerp(prevLeftPos.x, targetLeftX, smoothing);
            targetLeftY = lerp(prevLeftPos.y, targetLeftY, smoothing);
            targetRightX = lerp(prevRightPos.x, targetRightX, smoothing);
            targetRightY = lerp(prevRightPos.y, targetRightY, smoothing);
        }

        prevLeftPos = { x: targetLeftX, y: targetLeftY };
        prevRightPos = { x: targetRightX, y: targetRightY };

        // ── Calculate 3D Head Yaw for perspective rotation ──
        // MediaPipe Z coordinates map depth. 454=left ear, 234=right ear.
        const earDx = landmarks[454].x - landmarks[234].x;
        const earDz = landmarks[454].z - landmarks[234].z;
        const headYawDeg = Math.atan2(earDz, earDx) * (180 / Math.PI);

        // Since the video display is mirrored, we reverse the yaw
        const displayYaw = -headYawDeg;

        // Base outward flare so earrings aren't flat cardboard against cheeks
        const baseFlare = 20;

        // Left UI earring (Physical Right Ear)
        const leftYaw = baseFlare + displayYaw;

        // Right UI earring (Physical Left Ear) 
        // We add 180deg to perfectly mirror the PNG design symmetrically
        const rightYaw = 180 - baseFlare + displayYaw;

        // Position left earring overlay (mirrored left = raw right / physical right ear)
        if (leftEarring) {
            leftEarring.style.left = `${targetRightX}px`;
            leftEarring.style.top = `${targetRightY}px`;
            leftEarring.style.width = `${earringWidth}px`;
            leftEarring.style.height = `${earringHeight}px`;
            leftEarring.style.transform = `perspective(600px) rotateY(${leftYaw}deg)`;
            if (showPhysicalRightEar) leftEarring.classList.add('visible');
            else leftEarring.classList.remove('visible');
        }

        // Position right earring overlay (mirrored right = raw left / physical left ear)
        if (rightEarring) {
            rightEarring.style.left = `${targetLeftX}px`;
            rightEarring.style.top = `${targetLeftY}px`;
            rightEarring.style.width = `${earringWidth}px`;
            rightEarring.style.height = `${earringHeight}px`;
            rightEarring.style.transform = `perspective(600px) rotateY(${rightYaw}deg)`;
            if (showPhysicalLeftEar) rightEarring.classList.add('visible');
            else rightEarring.classList.remove('visible');
        }
    }

    async function startCamera() {
        const videoEl = document.getElementById('webcam');
        const statusMsg = document.getElementById('camera-status-msg');

        if (!videoEl) return;

        try {
            // Initialize FaceMesh
            faceMesh = initFaceMesh();
            if (!faceMesh) {
                if (statusMsg) statusMsg.textContent = 'Loading face detection model...';
                // Retry after a short delay for CDN scripts to load
                await new Promise(r => setTimeout(r, 1000));
                faceMesh = initFaceMesh();
            }

            if (statusMsg) statusMsg.textContent = 'Starting camera...';

            // Use MediaPipe Camera utility for real-time frame processing
            if (typeof Camera !== 'undefined' && faceMesh) {
                mpCamera = new Camera(videoEl, {
                    onFrame: async () => {
                        if (faceMesh && cameraActive) {
                            await faceMesh.send({ image: videoEl });
                        }
                    },
                    width: 1280,
                    height: 720,
                    facingMode: 'user',
                });

                await mpCamera.start();
                cameraActive = true;

                if (statusMsg) {
                    statusMsg.textContent = 'Detecting face...';
                    setTimeout(() => statusMsg.classList.add('hidden'), 2000);
                }
            } else {
                // Fallback: use getUserMedia directly if MediaPipe Camera util not available
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
                videoEl.srcObject = stream;
                cameraActive = true;

                if (statusMsg) statusMsg.textContent = 'Camera active (face detection loading...)';

                // Process frames manually
                if (faceMesh) {
                    const processFrame = async () => {
                        if (!cameraActive) return;
                        if (videoEl.readyState >= 2) {
                            await faceMesh.send({ image: videoEl });
                        }
                        requestAnimationFrame(processFrame);
                    };
                    videoEl.addEventListener('loadeddata', () => {
                        requestAnimationFrame(processFrame);
                    });
                }
            }
        } catch (err) {
            console.error('Camera Error:', err);
            if (statusMsg) statusMsg.textContent = 'Camera access denied — please allow camera';
        }
    }

    function stopCamera() {
        cameraActive = false;

        const videoEl = document.getElementById('webcam');
        if (videoEl && videoEl.srcObject) {
            videoEl.srcObject.getTracks().forEach(t => t.stop());
            videoEl.srcObject = null;
        }

        if (mpCamera) {
            mpCamera.stop();
            mpCamera = null;
        }

        // Hide earrings and info card
        const leftEarring = document.getElementById('earring-left');
        const rightEarring = document.getElementById('earring-right');
        const floatCard = document.getElementById('camera-floating-info');

        if (leftEarring) leftEarring.classList.remove('visible');
        if (rightEarring) rightEarring.classList.remove('visible');
        if (floatCard) floatCard.classList.remove('active');

        prevLeftPos = null;
        prevRightPos = null;
    }

    function openCamera(productId) {
        currentProduct = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

        // Update product label
        const label = document.getElementById('camera-product-label');
        if (label) label.textContent = currentProduct.name;

        // Set earring images with life-like animation class
        const leftEarring = document.getElementById('earring-left');
        const rightEarring = document.getElementById('earring-right');
        const animClass = currentProduct.isDangle ? 'dangle' : 'stud';

        if (leftEarring) {
            leftEarring.src = currentProduct.image;
            leftEarring.style.filter = currentProduct.filter || '';
            leftEarring.className = `ar-earring-overlay ${animClass}`;
        }
        if (rightEarring) {
            rightEarring.src = currentProduct.image;
            rightEarring.style.filter = currentProduct.filter || '';
            rightEarring.className = `ar-earring-overlay ${animClass}`;
        }

        // Inject sparkle overlay layers for light catch effect
        const feed = document.getElementById('camera-feed');
        feed.querySelectorAll('.ar-sparkle-layer').forEach(el => el.remove());

        const sparkleLeft = document.createElement('div');
        sparkleLeft.className = 'ar-sparkle-layer';
        sparkleLeft.id = 'sparkle-left';
        feed.appendChild(sparkleLeft);

        const sparkleRight = document.createElement('div');
        sparkleRight.className = 'ar-sparkle-layer';
        sparkleRight.id = 'sparkle-right';
        feed.appendChild(sparkleRight);

        // Reset status
        const msgEl = document.getElementById('camera-status-msg');
        if (msgEl) {
            msgEl.classList.remove('hidden');
            msgEl.textContent = 'Initializing camera...';
        }

        // Populate floating product info
        const floatName = document.getElementById('floating-product-name');
        const floatDesc = document.getElementById('floating-product-desc');
        const floatPrice = document.getElementById('floating-product-price');
        const floatCard = document.getElementById('camera-floating-info');

        if (floatName) floatName.textContent = currentProduct.name;
        if (floatDesc) floatDesc.textContent = currentProduct.type + ' | Curated Collection';
        if (floatPrice) floatPrice.textContent = currentProduct.price;

        if (floatCard) {
            floatCard.classList.remove('active');
        }

        showScreen('camera-screen');

        // Start camera with a small delay to ensure the screen is visible
        setTimeout(() => {
            startCamera();
            // Animate floating info card in after camera starts
            if (floatCard) {
                floatCard.classList.add('active');
            }
        }, 500);
    }

    function initCamera() {
        document.getElementById('btn-camera-close')?.addEventListener('click', () => {
            stopCamera();
            showScreen('products-screen');
        });
        document.getElementById('btn-capture')?.addEventListener('click', () => captureAndPreview());
    }

    // ── Capture screenshot ────────────────────────────
    function captureAndPreview() {
        if (!currentProduct) return;

        const videoEl = document.getElementById('webcam');
        const leftEarring = document.getElementById('earring-left');
        const rightEarring = document.getElementById('earring-right');
        const feed = document.getElementById('camera-feed');

        // Create an offscreen canvas to composite the capture
        const canvas = document.createElement('canvas');
        const feedW = feed.offsetWidth;
        const feedH = feed.offsetHeight;
        canvas.width = feedW;
        canvas.height = feedH;
        const ctx = canvas.getContext('2d');

        // Draw mirrored video
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(videoEl, -feedW, 0, feedW, feedH);
        ctx.restore();

        // Draw earrings at their current positions
        [leftEarring, rightEarring].forEach(earring => {
            if (earring && earring.classList.contains('visible')) {
                const left = parseFloat(earring.style.left);
                const top = parseFloat(earring.style.top);
                const w = parseFloat(earring.style.width);
                const h = parseFloat(earring.style.height);
                ctx.drawImage(earring, left, top, w, h);
            }
        });

        // Convert to data URL and show in preview
        const dataUrl = canvas.toDataURL('image/png');

        const img = document.getElementById('preview-image');
        const name = document.getElementById('preview-name');
        const price = document.getElementById('preview-price');

        if (img) {
            img.src = dataUrl;
            img.style.filter = '';
        }
        if (name) name.textContent = currentProduct.name;
        if (price) price.textContent = currentProduct.price;

        stopCamera();
        showScreen('preview-screen');
    }

    // ── Final Preview ─────────────────────────────────
    function initPreview() {
        document.getElementById('btn-preview-back')?.addEventListener('click', () => showScreen('products-screen'));
        document.getElementById('btn-buy')?.addEventListener('click', () => {
            alert(`🛒 ${currentProduct?.name || 'Item'} added to bag!`);
        });
        document.getElementById('btn-save')?.addEventListener('click', () => {
            // Download the captured image
            const img = document.getElementById('preview-image');
            if (img && img.src.startsWith('data:')) {
                const a = document.createElement('a');
                a.href = img.src;
                a.download = `vistara-tryon-${currentProduct?.name?.replace(/\s+/g, '-') || 'capture'}.png`;
                a.click();
            } else {
                alert('📸 Image saved to your gallery!');
            }
        });
    }

    // ── Init ──────────────────────────────────────────
    async function init() {
        initLoading();
        initLogin();

        try {
            console.log('Fetching products from Neon PostgreSQL via Express API...');
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const fetchUrl = isLocal ? '/api/products' : 'https://tryonery.vercel.app/api/products';
            const res = await fetch(fetchUrl);
            PRODUCTS = await res.json();
            // Ensure schema types map correctly to frontend logic
            PRODUCTS.forEach(p => p.scale = parseFloat(p.scale));
            console.log('Successfully loaded', PRODUCTS.length, 'products');
        } catch (e) {
            console.error('Failed to load products from API:', e);
        }

        renderCategoryBar();
        renderProducts();
        initCamera();
        initPreview();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
