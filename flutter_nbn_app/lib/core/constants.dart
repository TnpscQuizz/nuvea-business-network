import 'package:flutter/foundation.dart';

class NBNConstants {
  static const String appName = 'Nuvea Business Network';
  static const String appTagline = 'CONNECT • REFER • GROW';

  // Smart API URL resolution for Web vs Android vs Windows
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000';
    } else if (defaultTargetPlatform == TargetPlatform.android) {
      // 10.0.2.2 is the special alias to host localhost in Android emulator
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }

  static const List<Map<String, String>> taluks = [
    {'id': 'all', 'nameTa': 'அனைத்து தாலுகாக்கள்', 'nameEn': 'All Taluks'},
    {'id': 'harur', 'nameTa': 'ஹரூர் (Harur)', 'nameEn': 'Harur'},
    {'id': 'palacode', 'nameTa': 'பாலக்கோடு (Palacode)', 'nameEn': 'Palacode'},
    {'id': 'karimangalam', 'nameTa': 'காரிமங்கலம் (Karimangalam)', 'nameEn': 'Karimangalam'},
    {'id': 'dharmapuri_town', 'nameTa': 'தருமபுரி டவுன்', 'nameEn': 'Dharmapuri Town'},
    {'id': 'pennagaram', 'nameTa': 'பென்னாகரம் (Pennagaram)', 'nameEn': 'Pennagaram'},
  ];
}
