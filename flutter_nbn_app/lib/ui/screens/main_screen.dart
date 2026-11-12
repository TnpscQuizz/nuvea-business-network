import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../data/api_service.dart';
import 'gateway_screen.dart';
import 'business_portal_screen.dart';
import 'customer_portal_screen.dart';
import 'admin_portal_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentTabIndex = 0;
  final ApiService _api = ApiService();

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 800;
    final cartCount = _api.cart.fold<int>(0, (sum, item) => sum + (item['qty'] as int? ?? 1));

    return Scaffold(
      appBar: AppBar(
        backgroundColor: NBNTheme.primaryNavy,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: NBNTheme.goldAmber,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Center(
                child: Text(
                  'N',
                  style: TextStyle(
                    color: NBNTheme.darkNavy,
                    fontWeight: FontWeight.w900,
                    fontSize: 20,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      'Nuvea Business Network',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 15,
                        letterSpacing: -0.2,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: NBNTheme.goldAmber.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'NBN',
                        style: TextStyle(
                          color: NBNTheme.goldAmber,
                          fontWeight: FontWeight.w900,
                          fontSize: 9,
                        ),
                      ),
                    ),
                  ],
                ),
                const Text(
                  'CONNECT • REFER • GROW',
                  style: TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // On Web Desktop: Show navigation tabs in Header
          if (isDesktop) ...[
            _buildNavTabButton(0, '✨ Onboarding'),
            _buildNavTabButton(1, '🏢 Business'),
            _buildNavTabButton(2, '👤 Customer'),
            _buildNavTabButton(3, '🛡️ Admin'),
            const SizedBox(width: 12),
          ],

          // Cart Button with badge
          IconButton(
            onPressed: () => _showCartSheet(context),
            icon: Badge(
              label: Text('$cartCount'),
              isLabelVisible: cartCount > 0,
              backgroundColor: NBNTheme.emeraldGreen,
              child: const Icon(Icons.shopping_cart_outlined, color: Colors.white),
            ),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: IndexedStack(
        index: _currentTabIndex,
        children: [
          GatewayScreen(onNavigateToTab: (idx) => setState(() => _currentTabIndex = idx)),
          const BusinessPortalScreen(),
          CustomerPortalScreen(onCartUpdated: () => setState(() {})),
          const AdminPortalScreen(),
        ],
      ),
      // On Android / Mobile: Show clean BottomNavigationBar
      bottomNavigationBar: isDesktop
          ? null
          : BottomNavigationBar(
              currentIndex: _currentTabIndex,
              onTap: (idx) => setState(() => _currentTabIndex = idx),
              type: BottomNavigationBarType.fixed,
              backgroundColor: NBNTheme.primaryNavy,
              selectedItemColor: NBNTheme.goldAmber,
              unselectedItemColor: const Color(0xFF64748B),
              selectedFontSize: 11,
              unselectedFontSize: 10,
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.home_outlined),
                  activeIcon: Icon(Icons.home),
                  label: 'முகப்பு',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.business_center_outlined),
                  activeIcon: Icon(Icons.business_center),
                  label: 'வணிகர்',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.shopping_bag_outlined),
                  activeIcon: Icon(Icons.shopping_bag),
                  label: 'வாடிக்கையாளர்',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.admin_panel_settings_outlined),
                  activeIcon: Icon(Icons.admin_panel_settings),
                  label: 'அட்மின்',
                ),
              ],
            ),
    );
  }

  Widget _buildNavTabButton(int index, String label) {
    final isSelected = _currentTabIndex == index;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
      child: InkWell(
        onTap: () => setState(() => _currentTabIndex = index),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? NBNTheme.goldAmber : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? NBNTheme.darkNavy : Colors.white,
              fontWeight: FontWeight.w800,
              fontSize: 12,
            ),
          ),
        ),
      ),
    );
  }

  void _showCartSheet(BuildContext context) {
    final subtotal = _api.cart.fold<int>(0, (sum, i) => sum + ((i['price'] as int? ?? 0) * (i['qty'] as int? ?? 1)));
    final tax = (subtotal * 0.18).round();
    final total = subtotal + tax;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
            return Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '🛒 உங்கள் ஷாப்பிங் கார்ட் (${_api.cart.length})',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(ctx),
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                  const Divider(),
                  if (_api.cart.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 36),
                      child: Center(
                        child: Text(
                          'உங்கள் கார்ட் காலியாக உள்ளது',
                          style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold),
                        ),
                      ),
                    )
                  else ...[
                    ...List.generate(_api.cart.length, (i) {
                      final item = _api.cart[i];
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(item['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        subtitle: Text('சப்ளையர்: ${item['sellerName'] ?? 'Verified'}', style: const TextStyle(fontSize: 11)),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('₹${item['price']}', style: const TextStyle(fontWeight: FontWeight.w900)),
                            IconButton(
                              icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                              onPressed: () {
                                _api.removeFromCart(i);
                                setState(() {});
                                setSheetState(() {});
                              },
                            ),
                          ],
                        ),
                      );
                    }),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('பொருட்கள் மதிப்பு:', style: TextStyle(fontSize: 12)),
                              Text('₹$subtotal', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('18% GST வரி (9% CGST + 9% SGST):', style: TextStyle(fontSize: 12)),
                              Text('₹$tax', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: NBNTheme.emeraldGreen)),
                            ],
                          ),
                          const Divider(),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('மொத்தத் தொகை:', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
                              Text('₹$total', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: NBNTheme.emeraldGreen)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        _api.clearCart();
                        setState(() {});
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது! சப்ளையர் விரைவில் தொடர்பு கொள்வார்.')),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: NBNTheme.emeraldGreen,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text('💳 ஆர்டரை உறுதி செய் (Checkout) ➔'),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }
}
