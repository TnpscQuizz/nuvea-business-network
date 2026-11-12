import 'package:flutter/material.dart';
import '../../core/constants.dart';
import '../../core/theme.dart';
import '../../data/api_service.dart';

class CustomerPortalScreen extends StatefulWidget {
  final VoidCallback onCartUpdated;

  const CustomerPortalScreen({super.key, required this.onCartUpdated});

  @override
  State<CustomerPortalScreen> createState() => _CustomerPortalScreenState();
}

class _CustomerPortalScreenState extends State<CustomerPortalScreen> {
  final ApiService _api = ApiService();
  Map<String, dynamic>? _db;
  bool _isLoading = true;
  String _selectedTaluk = 'all';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final data = await _api.fetchState();
    if (mounted) {
      setState(() {
        _db = data;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: NBNTheme.emeraldGreen),
      );
    }

    final isDesktop = MediaQuery.of(context).size.width > 800;
    final allMembers = (_db?['members'] as List?) ?? [];

    final filteredMembers = allMembers.where((m) {
      final matchTaluk = _selectedTaluk == 'all' ? true : m['talukId'] == _selectedTaluk;
      final matchSearch = _searchQuery.isEmpty ||
          (m['businessName'] ?? '').toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (m['ownerName'] ?? '').toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (m['specialOffer'] ?? '').toString().toLowerCase().contains(_searchQuery.toLowerCase());
      return matchTaluk && matchSearch;
    }).toList();

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
              // BANNER
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF064E3B)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: NBNTheme.emeraldGreen.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            '🛒 NBN DIRECT CONSUMER MARKETPLACE',
                            style: TextStyle(color: NBNTheme.emeraldGreen, fontWeight: FontWeight.w900, fontSize: 10),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'தருமபுரி & சேலத்தின் சரிபார்க்கப்பட்ட வணிகர்கள்',
                          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          '100% பிரத்யேக வணிக மோனோபோலி • 18% GST வரி பில்லிங்',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: () => _showPostRequirementDialog(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: NBNTheme.goldAmber,
                        foregroundColor: Colors.black,
                      ),
                      icon: const Icon(Icons.add_shopping_cart, size: 16),
                      label: const Text('தேவை சமர்ப்பி'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // SEARCH & TALUK FILTER CHIPS
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextField(
                        decoration: InputDecoration(
                          hintText: 'கடை, உரிமையாளர், பொருட்கள் தேடவும் (எ.கா: தங்கம், பட்டு, 4K வீடியோ)...',
                          prefixIcon: const Icon(Icons.search),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        ),
                        onChanged: (val) {
                          setState(() => _searchQuery = val);
                        },
                      ),
                      const SizedBox(height: 12),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: NBNConstants.taluks.map((t) {
                            final isSel = _selectedTaluk == t['id'];
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                label: Text(t['nameTa'] ?? t['id']!),
                                selected: isSel,
                                selectedColor: NBNTheme.emeraldGreen,
                                labelStyle: TextStyle(
                                  color: isSel ? Colors.white : const Color(0xFF334155),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                                onSelected: (sel) {
                                  if (sel) setState(() => _selectedTaluk = t['id']!);
                                },
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // RESULTS GRID
              Text(
                'சரிபார்க்கப்பட்ட நிறுவனங்கள் (${filteredMembers.length})',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 12),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: isDesktop ? 3 : 1,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: isDesktop ? 1.05 : 1.25,
                ),
                itemCount: filteredMembers.length,
                itemBuilder: (context, i) {
                  final m = filteredMembers[i] as Map<String, dynamic>;
                  return Card(
                    clipBehavior: Clip.antiAlias,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Image & Badges
                        Stack(
                          children: [
                            Container(
                              height: 140,
                              decoration: BoxDecoration(
                                image: DecorationImage(
                                  image: NetworkImage(
                                    m['logo'] ?? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
                                  ),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            Positioned(
                              top: 8,
                              left: 8,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.8),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  (m['talukId'] ?? 'Regional').toString().toUpperCase(),
                                  style: const TextStyle(color: NBNTheme.goldAmber, fontSize: 9, fontWeight: FontWeight.w900),
                                ),
                              ),
                            ),
                          ],
                        ),

                        // Info
                        Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                m['businessName'] ?? 'Business',
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${m['ownerName']} • ${m['categoryName'] ?? ''}',
                                style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 6),
                              Text(
                                m['specialOffer'] ?? 'சிறந்த விலை சலுகை மற்றும் தரம்.',
                                style: const TextStyle(color: NBNTheme.emeraldGreen, fontSize: 11, fontWeight: FontWeight.bold),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),

                        const Spacer(),

                        // CTA Button
                        Padding(
                          padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                          child: ElevatedButton(
                            onPressed: () {
                              _api.addToCart({
                                'id': '${m['id']}_deal',
                                'name': '${m['businessName']} - சிறப்பு சலுகை',
                                'price': 999,
                                'sellerName': m['businessName'],
                              });
                              widget.onCartUpdated();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('${m['businessName']} முன்பதிவு கார்ட்டில் சேர்க்கப்பட்டது!')),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: NBNTheme.emeraldGreen,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 10),
                            ),
                            child: const Text('🛒 முன்பதிவு செய் (Add to Cart)'),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showPostRequirementDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('உங்கள் தேவையை சமர்ப்பிக்க'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(labelText: 'தேவையின் தலைப்பு', hintText: 'எ.கா: 100 திருமண பட்டு புடவைகள்'),
            ),
            SizedBox(height: 8),
            TextField(
              decoration: InputDecoration(labelText: 'எதிர்பார்க்கும் பட்ஜெட் (₹)'),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 8),
            TextField(
              decoration: InputDecoration(labelText: 'விளக்கம்'),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('ரத்து')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('உங்கள் தேவை சமர்ப்பிக்கப்பட்டது! சப்ளையர்களின் கொட்டேஷன்கள் விரைவில் பெறப்படும்.')),
              );
            },
            child: const Text('சமர்ப்பிக்க ➔'),
          ),
        ],
      ),
    );
  }
}
