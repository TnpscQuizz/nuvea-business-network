import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../core/constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  Map<String, dynamic>? _cachedState;
  final List<Map<String, dynamic>> cart = [];

  Future<Map<String, dynamic>> fetchState() async {
    try {
      final uri = Uri.parse('${NBNConstants.baseUrl}/api/state');
      final res = await http.get(uri).timeout(const Duration(seconds: 4));
      if (res.statusCode == 200) {
        final data = jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>;
        _cachedState = data;
        return data;
      }
    } catch (e) {
      debugPrint('API Error or Offline mode: $e. Using fallback mock state.');
    }

    if (_cachedState != null) return _cachedState!;
    return _buildMockState();
  }

  void addToCart(Map<String, dynamic> item) {
    final existingIndex = cart.indexWhere((x) => x['id'] == item['id']);
    if (existingIndex >= 0) {
      cart[existingIndex]['qty'] = (cart[existingIndex]['qty'] ?? 1) + 1;
    } else {
      cart.add({...item, 'qty': 1});
    }
  }

  void removeFromCart(int index) {
    if (index >= 0 && index < cart.length) {
      cart.removeAt(index);
    }
  }

  void clearCart() {
    cart.clear();
  }

  Map<String, dynamic> _buildMockState() {
    return {
      'members': [
        {
          'id': 'mem_001',
          'businessName': 'ஸ்ரீ முருகன் ஜூவல்லரி (Sri Murugan Jewellery)',
          'ownerName': 'கே. எஸ். சந்திரசேகர்',
          'categoryId': 'jewellery',
          'categoryName': 'தங்கம் & வைர நகைகள் (Jewellery)',
          'talukId': 'harur',
          'chapterId': 'harur_titans',
          'phone': '9842712345',
          'specialOffer': 'செய்கூலி, சேதாரம் கிடையாது! 100% BIS 916 ஹால்மார்க் தங்கம்.',
          'rating': 4.9,
          'accountType': 'networking_marketplace',
          'businessWon': 385000,
          'referralsReceived': 18,
          'referralsGiven': 12,
          'logo': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        {
          'id': 'mem_002',
          'businessName': 'நுவேவா ஸ்டுடியோ (Nuvea Studio)',
          'ownerName': 'சந்துரு & கார்த்திக்',
          'categoryId': 'digital_marketing',
          'categoryName': '4K வணிக விளம்பரம் & டிஜிட்டல் வளர்ச்சி',
          'talukId': 'harur',
          'chapterId': 'harur_titans',
          'phone': '9443298765',
          'specialOffer': '4K பிசினஸ் விளம்பர வீடியோ + சோசியல் மீடியா லீட்ஸ் தொகுப்பு.',
          'rating': 5.0,
          'accountType': 'networking_marketplace',
          'businessWon': 420000,
          'referralsReceived': 24,
          'referralsGiven': 19,
          'logo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
        {
          'id': 'mem_003',
          'businessName': 'பாலக்கோடு இயற்கை ஆர்கானிக்ஸ்',
          'ownerName': 'எம். ராஜேந்திரன்',
          'categoryId': 'agriculture',
          'categoryName': 'இயற்கை விவசாயம் & உழவர் சந்தை',
          'talukId': 'palacode',
          'chapterId': 'palacode_pride',
          'phone': '9788112233',
          'specialOffer': 'பாரம்பரிய நாட்டு விதைகள் மற்றும் சுத்தமான மரச்செக்கு எண்ணெய்.',
          'rating': 4.8,
          'accountType': 'marketplace_only',
          'businessWon': 150000,
          'referralsReceived': 8,
          'referralsGiven': 4,
          'logo': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        }
      ],
      'chapters': [
        {
          'id': 'harur_titans',
          'nameTa': 'ஹரூர் டைட்டன்ஸ் சாப்டர்',
          'nameEn': 'Harur Titans Chapter',
          'talukId': 'harur',
          'filledSeats': 12,
          'availableSeats': 88,
        },
        {
          'id': 'palacode_pride',
          'nameTa': 'பாலக்கோடு பிரைட் சாப்டர்',
          'nameEn': 'Palacode Pride Chapter',
          'talukId': 'palacode',
          'filledSeats': 8,
          'availableSeats': 92,
        },
        {
          'id': 'dharmapuri_royals',
          'nameTa': 'தருமபுரி ராயல்ஸ் சாப்டர்',
          'nameEn': 'Dharmapuri Royals Chapter',
          'talukId': 'dharmapuri_town',
          'filledSeats': 15,
          'availableSeats': 85,
        }
      ],
      'marketplaceRequirements': [
        {
          'id': 'req_001',
          'title': '100 திருமண பட்டுப் புடவைகள் & வேஷ்டிகள் மொத்த ஆர்டர்',
          'category': 'textiles',
          'budget': 150000,
          'talukId': 'harur',
          'description': 'நவம்பர் திருமணத்திற்கான பிரத்யேக காஞ்சிபுரம் பட்டு ஆடைகள் தேவை.',
          'quotes': [
            {
              'supplierName': 'பாலக்கோடு சில்க்ஸ்',
              'basePrice': 130000,
              'totalPrice': 153400,
            }
          ]
        }
      ],
      'marketplaceOrders': [
        {
          'id': 'ORD-8942',
          'totalAmount': 25000,
          'taxAmount': 4500,
          'status': 'delivered',
          'sellerName': 'ஸ்ரீ முருகன் ஜூவல்லரி'
        }
      ],
      'users': [
        {
          'id': 'usr_001',
          'fullName': 'சந்துரு (Super Admin)',
          'email': 'admin@nuvea.in',
          'phone': '9876543210',
          'role': 'super_admin',
          'status': 'active'
        },
        {
          'id': 'usr_002',
          'fullName': 'கே. எஸ். சந்திரசேகர்',
          'email': 'murugan@jewels.com',
          'phone': '9842712345',
          'accountType': 'networking_marketplace',
          'status': 'active'
        }
      ]
    };
  }
}
