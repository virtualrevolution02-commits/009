import 'package:flutter/material.dart';
import 'package:google_mlkit_face_mesh/google_mlkit_face_mesh.dart';
import 'package:camera/camera.dart';
import '../ar_engine/earring_renderer.dart';

class ARCameraScreen extends StatefulWidget {
  final String productId;
  const ARCameraScreen({super.key, required this.productId});

  @override
  State<ARCameraScreen> createState() => _ARCameraScreenState();
}

class _ARCameraScreenState extends State<ARCameraScreen> {
  CameraController? _controller;
  bool _isDetecting = false;
  final FaceMeshDetector _meshDetector = FaceMeshDetector(option: FaceMeshDetectorOptions.faceMesh);
  
  // Mock product data for internal selection in this screen
  final Map<String, dynamic> _productData = {
    '1': {'image': 'assets/images/earring1.png', 'dangle': true},
    '2': {'image': 'assets/images/earring2.png', 'dangle': true},
    '3': {'image': 'assets/images/earring3.png', 'dangle': false},
    '4': {'image': 'assets/images/earring4.png', 'dangle': true},
    '5': {'image': 'assets/images/earring5.png', 'dangle': false},
  };

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  void _initializeCamera() async {
    final cameras = await availableCameras();
    final frontCamera = cameras.firstWhere((c) => c.lensDirection == CameraLensDirection.front);
    
    _controller = CameraController(frontCamera, ResolutionPreset.high, enableAudio: false);
    await _controller!.initialize();
    
    if (mounted) {
      setState(() {});
      _startDetection();
    }
  }

  void _startDetection() {
    _controller!.startImageStream((CameraImage image) {
      if (_isDetecting) return;
      _isDetecting = true;
      // Real-time detection logic would go here
      _isDetecting = false;
    });
  }

  @override
  void dispose() {
    _controller?.dispose();
    _meshDetector.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_controller == null || !_controller!.value.isInitialized) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final currentProduct = _productData[widget.productId] ?? _productData['1'];

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // 1. Camera Feed
          ClipRRect(
            child: SizedOverflowBox(
              size: MediaQuery.of(context).size,
              alignment: Alignment.center,
              child: CameraPreview(_controller!),
            ),
          ),
          
          // 2. AR Earring Overlay (Mocked at Ear position)
          Positioned(
            left: MediaQuery.of(context).size.width * 0.15, // Left Ear approximate
            top: MediaQuery.of(context).size.height * 0.45,
            child: AREarringRenderer(
              imagePath: currentProduct['image'],
              isDangle: currentProduct['dangle'],
            ),
          ),
          Positioned(
            right: MediaQuery.of(context).size.width * 0.15, // Right Ear approximate
            top: MediaQuery.of(context).size.height * 0.45,
            child: AREarringRenderer(
              imagePath: currentProduct['image'],
              isDangle: currentProduct['dangle'],
            ),
          ),

          // 3. Face Guide UI
          Center(
            child: Container(
              width: 280,
              height: 400,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white24, width: 2),
                borderRadius: BorderRadius.circular(150),
              ),
            ),
          ),
          
          // 4. Interface Elements
          Positioned(
            top: 50,
            left: 20,
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 24),
              onPressed: () => Navigator.pop(context),
            ),
          ),

          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Column(
              children: [
                const Text(
                   'STAY STILL FOR PERFECT FIT',
                   style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 2, fontSize: 12),
                ),
                const SizedBox(height: 30),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.favorite_border, color: Colors.white, size: 30),
                      onPressed: () {},
                    ),
                    GestureDetector(
                      onTap: () => Navigator.pushNamed(context, '/final'),
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 4),
                        ),
                        child: Center(
                          child: Container(
                            width: 60,
                            height: 60,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.shopping_bag_outlined, color: Colors.white, size: 30),
                      onPressed: () {},
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
