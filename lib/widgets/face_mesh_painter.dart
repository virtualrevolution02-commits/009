import 'package:flutter/material.dart';
import 'package:google_mlkit_face_mesh/google_mlkit_face_mesh.dart';

class FaceMeshPainter extends CustomPainter {
  final List<FaceMesh> meshes;
  final Size absoluteImageSize;
  final InputImageRotation rotation;

  FaceMeshPainter(this.meshes, this.absoluteImageSize, this.rotation);

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0
      ..color = const Color(0xFFD4AF37).withOpacity(0.5);

    for (final mesh in meshes) {
      // Draw points for landmarks (especially ears)
      final List<Point> points = mesh.points;
      
      for (final point in points) {
        canvas.drawCircle(
          Offset(
            _translateX(point.x.toDouble(), size, absoluteImageSize, rotation),
            _translateY(point.y.toDouble(), size, absoluteImageSize, rotation),
          ),
          1.0,
          paint,
        );
      }
      
      // Specifically highlight ear points if needed
      // Logic to identify ear indices in MediaPipe face mesh (e.g., indices near 234, 454)
    }
  }

  double _translateX(double x, Size size, Size absoluteImageSize, InputImageRotation rotation) {
    switch (rotation) {
      case InputImageRotation.rotation90deg:
        return x * size.width / absoluteImageSize.height;
      case InputImageRotation.rotation270deg:
        return size.width - x * size.width / absoluteImageSize.height;
      default:
        return x * size.width / absoluteImageSize.width;
    }
  }

  double _translateY(double y, Size size, Size absoluteImageSize, InputImageRotation rotation) {
    switch (rotation) {
      case InputImageRotation.rotation90deg:
      case InputImageRotation.rotation270deg:
        return y * size.height / absoluteImageSize.width;
      default:
        return y * size.height / absoluteImageSize.height;
    }
  }

  @override
  bool shouldRepaint(FaceMeshPainter oldDelegate) {
    return oldDelegate.meshes != meshes;
  }
}
