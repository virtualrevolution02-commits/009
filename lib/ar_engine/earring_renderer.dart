import 'dart:math' as math;
import 'package:flutter/material.dart';

class AREarringRenderer extends StatefulWidget {
  final String imagePath;
  final bool isDangle;

  const AREarringRenderer({
    super.key,
    required this.imagePath,
    this.isDangle = true,
  });

  @override
  State<AREarringRenderer> createState() => _AREarringRendererState();
}

class _AREarringRendererState extends State<AREarringRenderer> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _swingAnimation;
  late Animation<double> _shimmerAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);

    // Pendulum swing for dangle earrings
    _swingAnimation = Tween<double>(
      begin: -0.05, // -~3 degrees
      end: 0.05,    // ~3 degrees
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOutSine,
    ));

    // Shimmer effect (moving light reflection)
    _shimmerAnimation = Tween<double>(
      begin: -1.0,
      end: 2.0,
    ).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform(
          alignment: Alignment.topCenter,
          transform: Matrix4.identity()
            ..rotateZ(widget.isDangle ? _swingAnimation.value : 0),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              // Grounding Shadow
              Positioned(
                top: 5,
                left: 2,
                child: Opacity(
                  opacity: 0.3,
                  child: Image.asset(
                    widget.imagePath,
                    width: 60,
                    color: Colors.black,
                    colorBlendMode: BlendMode.srcIn,
                  ),
                ),
              ),
              // Main Earring Asset
              ShaderMask(
                shaderCallback: (bounds) {
                  return LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.transparent,
                      Colors.white.withOpacity(0.1),
                      Colors.white.withOpacity(0.4),
                      Colors.white.withOpacity(0.1),
                      Colors.transparent,
                    ],
                    stops: [
                      0.0,
                      _shimmerAnimation.value - 0.2,
                      _shimmerAnimation.value,
                      _shimmerAnimation.value + 0.2,
                      1.0,
                    ],
                  ).createShader(bounds);
                },
                blendMode: BlendMode.srcATop,
                child: Image.asset(
                  widget.imagePath,
                  width: 60,
                  filterQuality: FilterQuality.high,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
