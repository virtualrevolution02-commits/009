import 'package:flutter/material.dart';
import 'dart:async';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({super.key});

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> {
  @override
  void initState() {
    super.initState();
    Timer(const Duration(seconds: 4), () {
      Navigator.pushReplacementNamed(context, '/login');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            colors: [Color(0xFF1A1A1C), Colors.black],
            center: Alignment.center,
            radius: 1.0,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(),
            // Brand Logo Placeholder - can be replaced with an image later
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.8, end: 1.0),
              duration: const Duration(seconds: 2),
              curve: Curves.easeInOutSine,
              builder: (context, value, child) {
                return Transform.scale(
                  scale: value,
                  child: Opacity(
                    opacity: value,
                    child: Column(
                      children: [
                        const Icon(Icons.diamond_outlined, size: 80, color: Color(0xFFD4AF37)),
                        const SizedBox(height: 10),
                        Text(
                          'VISTARA TECH',
                          style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            fontSize: 24,
                            letterSpacing: 4,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
              onEnd: () {}, // Handled by Timer
            ),
            const SizedBox(height: 50),
            const SizedBox(
              width: 150,
              child: LinearProgressIndicator(
                backgroundColor: Colors.white12,
                color: Color(0xFFD4AF37),
                minHeight: 1,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'INITIALIZING AR ENGINE',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 10,
                letterSpacing: 2,
              ),
            ),
            const Spacer(),
          ],
        ),
      ),
    );
  }
}
