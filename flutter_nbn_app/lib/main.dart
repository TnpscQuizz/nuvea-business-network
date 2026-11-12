import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'ui/screens/main_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NBNFlutterApp());
}

class NBNFlutterApp extends StatelessWidget {
  const NBNFlutterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NBN - Nuvea Business Network',
      debugShowCheckedModeBanner: false,
      theme: NBNTheme.lightTheme,
      home: const MainScreen(),
    );
  }
}
