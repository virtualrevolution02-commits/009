import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/loading_screen.dart';
import 'screens/login_screen.dart';
import 'screens/product_selection_screen.dart';
import 'screens/ar_camera_screen.dart';
import 'screens/final_preview_screen.dart';
import 'services/app_state.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AppState(),
      child: const VistaraARApp(),
    ),
  );
}

class VistaraARApp extends StatelessWidget {
  const VistaraARApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Vistara Tech AR',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0A0A0B),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD4AF37),
          brightness: Brightness.dark,
          primary: const Color(0xFFD4AF37),
          secondary: const Color(0xFF19191B),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
          displayLarge: GoogleFonts.playfairDisplay(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          titleLarge: GoogleFonts.playfairDisplay(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        useMaterial3: true,
      ),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        if (settings.name == '/') {
          return MaterialPageRoute(builder: (_) => const LoadingScreen());
        }
        if (settings.name == '/login') {
          return MaterialPageRoute(builder: (_) => const LoginScreen());
        }
        if (settings.name == '/products') {
          return MaterialPageRoute(builder: (_) => const ProductSelectionScreen());
        }
        if (settings.name == '/ar_camera') {
          final productId = settings.arguments as String? ?? '1';
          return MaterialPageRoute(builder: (_) => ARCameraScreen(productId: productId));
        }
        if (settings.name == '/final') {
          return MaterialPageRoute(builder: (_) => const FinalPreviewScreen());
        }
        return null;
      },
    );
  }
}
