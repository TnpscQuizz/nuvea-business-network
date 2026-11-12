import 'package:flutter/material.dart';
import '../../core/theme.dart';

class GatewayScreen extends StatelessWidget {
  final Function(int) onNavigateToTab;

  const GatewayScreen({super.key, required this.onNavigateToTab});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 800;

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: isDesktop ? 32 : 16,
        vertical: 24,
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // HERO TOP BANNER
              Container(
                padding: EdgeInsets.all(isDesktop ? 36 : 24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF020617)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    )
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: NBNTheme.goldAmber.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: NBNTheme.goldAmber.withOpacity(0.3)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.stars, color: NBNTheme.goldAmber, size: 16),
                          SizedBox(width: 8),
                          Text(
                            'NBN OFFICIAL ONBOARDING PORTAL',
                            style: TextStyle(
                              color: NBNTheme.goldAmber,
                              fontWeight: FontWeight.w900,
                              fontSize: 11,
                              letterSpacing: 1.1,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'WELCOME TO NBN\nNUVEA BUSINESS NETWORK',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: isDesktop ? 36 : 26,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      '"Choose how you want to grow your business with NBN."',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Color(0xFFCBD5E1),
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'CONNECT • REFER • GROW • தருமபுரி & சேலம் மண்டல தொழில் நெட்வொர்க்',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: NBNTheme.goldAmber,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // SECTION TITLE
              Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: NBNTheme.primaryNavy,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      '⚡ PRIMARY CHOICE • முதன்மை தேர்வு',
                      style: TextStyle(
                        color: NBNTheme.goldAmber,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'எந்த வழியில் உங்கள் வணிகத்தை உயர்த்த விரும்புகிறீர்கள்?',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: isDesktop ? 26 : 20,
                      fontWeight: FontWeight.w900,
                      color: NBNTheme.primaryNavy,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'தாலுகா சாப்டர் நெட்வொர்க்கிங் அல்லது பிசினஸ் மார்க்கெட்பிளேஸ் தேர்வு செய்க',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // 2 GRAND PORTAL CARDS (SIDE BY SIDE ON WEB, STACKED ON MOBILE)
              if (isDesktop)
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(child: _buildNetworkingCard(context)),
                    const SizedBox(width: 24),
                    Expanded(child: _buildMarketplaceCard(context)),
                  ],
                )
              else
                Column(
                  children: [
                    _buildNetworkingCard(context),
                    const SizedBox(height: 20),
                    _buildMarketplaceCard(context),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNetworkingCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF2E1065)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: NBNTheme.goldAmber, width: 2),
        boxShadow: [
          BoxShadow(
            color: NBNTheme.goldAmber.withOpacity(0.15),
            blurRadius: 15,
            offset: const Offset(0, 8),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: NBNTheme.goldAmber,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: NBNTheme.goldAmber.withOpacity(0.3),
                      blurRadius: 10,
                    )
                  ],
                ),
                child: const Center(
                  child: Text('🏛️', style: TextStyle(fontSize: 26)),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: NBNTheme.goldAmber.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: NBNTheme.goldAmber.withOpacity(0.4)),
                ),
                child: const Text(
                  '★ BNI MODEL',
                  style: TextStyle(
                    color: NBNTheme.goldAmber,
                    fontWeight: FontWeight.w900,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          const Text(
            'விருப்பம் 1 • PRIMARY GATEWAY',
            style: TextStyle(
              color: NBNTheme.goldAmber,
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'NBN நெட்வொர்க்கிங்\n(NBN Networking)',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.w900,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'தாலுகா அளவிலான பிரத்யேக வணிக சாப்டர். உங்கள் தொழில் பிரிவில் உங்களுக்கு மட்டுமே 100% பிரத்யேக ஏகபோக சீட் (Category Exclusivity) மற்றும் வாராந்திர நேரடி வணிகப் பரிந்துரைகள்.',
            style: TextStyle(
              color: Color(0xFFCBD5E1),
              fontSize: 12,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          const Divider(color: Color(0xFF334155)),
          const SizedBox(height: 12),
          _buildPillar(Icons.lock, '100% Category Exclusivity', 'உங்கள் தாலுகாவில் ஒரே ஒரு பிசினஸ் மோனோபோலி'),
          _buildPillar(Icons.handshake, 'வாராந்திர நேரடி சந்திப்பு', 'உறுப்பினர்களுடன் நேரடி வர்த்தக பரிந்துரைகள்'),
          _buildPillar(Icons.videocam, 'Nuvea Studio 4K Branding', 'பிரத்யேக வணிக வீடியோ & மார்க்கெட்பிளேஸ் முழு அனுமதி'),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => onNavigateToTab(1), // Go to Business Portal
              style: ElevatedButton.styleFrom(
                backgroundColor: NBNTheme.goldAmber,
                foregroundColor: NBNTheme.darkNavy,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('🚀 NBN நெட்வொர்க்கிங் போர்டல் ➔'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMarketplaceCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF0C4A6E), Color(0xFF082F49)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF38BDF8), width: 2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF38BDF8).withOpacity(0.15),
            blurRadius: 15,
            offset: const Offset(0, 8),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFF0284C7),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0284C7).withOpacity(0.3),
                      blurRadius: 10,
                    )
                  ],
                ),
                child: const Center(
                  child: Text('🛒', style: TextStyle(fontSize: 26)),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF38BDF8).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.4)),
                ),
                child: const Text(
                  '⚡ COMMERCE HUB',
                  style: TextStyle(
                    color: Color(0xFF38BDF8),
                    fontWeight: FontWeight.w900,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          const Text(
            'விருப்பம் 2 • PRIMARY GATEWAY',
            style: TextStyle(
              color: Color(0xFF38BDF8),
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'NBN பிசினஸ் மார்க்கெட்பிளேஸ்\n(Business Marketplace)',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.w900,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'தயாரிப்புகள் மற்றும் சேவைகளுக்கான நேரடி வர்த்தக சந்தை. வாடிக்கையாளர்கள் தேவைகளை சமர்ப்பிக்கலாம்; விற்பனையாளர்கள் கொட்டேஷன் அனுப்பி நேரடி ஆர்டர்களைப் பெறலாம்.',
            style: TextStyle(
              color: Color(0xFFCBD5E1),
              fontSize: 12,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          const Divider(color: Color(0xFF334155)),
          const SizedBox(height: 12),
          _buildPillar(Icons.store, 'விற்பனையாளர் ஸ்டோர்', 'பொருட்கள் மற்றும் சேவைகளை பட்டியலிட்டு ஆர்டர் பெறலாம்'),
          _buildPillar(Icons.flash_on, 'வாடிக்கையாளர் தேவைகள் & பிடிங்', 'லைவ் தேவைகளுக்கு நேரடியாக கொட்டேஷன் அனுப்பலாம்'),
          _buildPillar(Icons.shopping_bag, 'வாடிக்கையாளர் தளம் & 18% GST', 'சரிபார்க்கப்பட்ட சப்ளையர்களிடம் சிறந்த விலையில் வாங்கலாம்'),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => onNavigateToTab(2), // Go to Customer Portal
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0284C7),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('🛒 மார்க்கெட்பிளேஸ் போர்டல் ➔'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPillar(IconData icon, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: NBNTheme.goldAmber, size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(fontSize: 12, color: Color(0xFFCBD5E1)),
                children: [
                  TextSpan(
                    text: '$title: ',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  TextSpan(text: desc),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
