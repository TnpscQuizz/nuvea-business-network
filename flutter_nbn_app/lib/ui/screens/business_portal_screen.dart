import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../data/api_service.dart';

class BusinessPortalScreen extends StatefulWidget {
  const BusinessPortalScreen({super.key});

  @override
  State<BusinessPortalScreen> createState() => _BusinessPortalScreenState();
}

class _BusinessPortalScreenState extends State<BusinessPortalScreen> {
  final ApiService _api = ApiService();
  Map<String, dynamic>? _db;
  bool _isLoading = true;
  String _selectedMemberId = 'mem_001';

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

  Map<String, dynamic> _getActiveMember() {
    final members = (_db?['members'] as List?) ?? [];
    return members.firstWhere(
      (m) => m['id'] == _selectedMemberId,
      orElse: () => members.isNotEmpty ? members.first : {},
    ) as Map<String, dynamic>;
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: NBNTheme.goldAmber),
      );
    }

    final isDesktop = MediaQuery.of(context).size.width > 800;
    final members = (_db?['members'] as List?) ?? [];
    final activeMember = _getActiveMember();
    final requirements = (_db?['marketplaceRequirements'] as List?) ?? [];

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
              // MEMBER SWITCHER & PROFILE BANNER
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: NBNTheme.goldAmber.withOpacity(0.4)),
                ),
                child: Column(
                  children: [
                    // Member Selector Bar
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'வணிகர் கணக்கு தேர்வு:',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF020617),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFF334155)),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedMemberId,
                              dropdownColor: const Color(0xFF020617),
                              style: const TextStyle(color: NBNTheme.goldAmber, fontWeight: FontWeight.bold, fontSize: 12),
                              items: members.map<DropdownMenuItem<String>>((m) {
                                return DropdownMenuItem<String>(
                                  value: m['id'].toString(),
                                  child: Text(m['businessName'] ?? 'Member'),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) {
                                  setState(() => _selectedMemberId = val);
                                }
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Divider(color: Color(0xFF334155)),
                    const SizedBox(height: 16),

                    // Active Business Details
                    Row(
                      children: [
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: NBNTheme.goldAmber, width: 2),
                            image: DecorationImage(
                              image: NetworkImage(
                                activeMember['logo'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                              ),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    activeMember['businessName'] ?? 'Business',
                                    style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: NBNTheme.emeraldGreen.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text('✓ VERIFIED', style: TextStyle(color: NBNTheme.emeraldGreen, fontSize: 9, fontWeight: FontWeight.w900)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${activeMember['ownerName']} • ${activeMember['categoryName'] ?? 'Category Monopoly'}',
                                style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '📍 ${(activeMember['talukId'] ?? 'harur').toString().toUpperCase()} சாப்டர் • 📞 ${activeMember['phone']}',
                                style: const TextStyle(color: NBNTheme.goldAmber, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // KPI CARDS
              GridView.count(
                crossAxisCount: isDesktop ? 4 : 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: isDesktop ? 1.6 : 1.3,
                children: [
                  _buildMetricCard('பெற்ற பரிந்துரைகள்', '${activeMember['referralsReceived'] ?? 18}', '📥', NBNTheme.goldAmber),
                  _buildMetricCard('வழங்கியவை', '${activeMember['referralsGiven'] ?? 12}', '📤', const Color(0xFF0284C7)),
                  _buildMetricCard('ஈட்டிய வர்த்தகம்', '₹${(activeMember['businessWon'] ?? 385000).toString()}', '💰', NBNTheme.emeraldGreen),
                  _buildMetricCard('ஒழுங்கு நிலை', '0 / 3 Strikes', '🛡️', const Color(0xFF9333EA)),
                ],
              ),

              const SizedBox(height: 28),

              // LEAD OPPORTUNITIES & BIDDING
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '🎯 வாடிக்கையாளர் தேவைகள் & நேரடி கொட்டேஷன் (Live Leads)',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('புதிய தேவைகள் சரிபார்க்கப்பட்டன!')),
                      );
                    },
                    icon: const Icon(Icons.refresh, size: 16),
                    label: const Text('புதுப்பி'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: requirements.length,
                itemBuilder: (context, i) {
                  final req = requirements[i] as Map<String, dynamic>;
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                req['title'] ?? 'Requirement',
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE0F2FE),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  (req['status'] ?? 'OPEN').toString().toUpperCase(),
                                  style: const TextStyle(color: Color(0xFF0369A1), fontWeight: FontWeight.w900, fontSize: 10),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            req['description'] ?? '',
                            style: const TextStyle(color: Color(0xFF475569), fontSize: 13, height: 1.4),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'பட்ஜெட்: ₹${(req['budget'] ?? 0).toString()}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: NBNTheme.emeraldGreen),
                              ),
                              ElevatedButton(
                                onPressed: () {
                                  _showBidDialog(context, req['title'] ?? 'Requirement');
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: NBNTheme.primaryNavy,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                ),
                                child: const Text('கொட்டேஷன் சமர்ப்பிக்க ➔'),
                              ),
                            ],
                          ),
                        ],
                      ),
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

  void _showBidDialog(BuildContext context, String title) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('கொட்டேஷன் சமர்ப்பிக்க'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('தேவை: $title', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            const SizedBox(height: 12),
            const TextField(
              decoration: InputDecoration(
                labelText: 'அடிப்படை விலை (₹)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),
            const Text(
              '18% GST வரி தானாகவே கணக்கிடப்பட்டு வாடிக்கையாளருக்கு சமர்ப்பிக்கப்படும்.',
              style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('ரத்து')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('உங்கள் கொட்டேஷன் வெற்றிகரமாக அனுப்பப்பட்டது!')),
              );
            },
            child: const Text('சமர்ப்பிக்க ➔'),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, String icon, Color accentColor) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                ),
                Text(icon, style: const TextStyle(fontSize: 20)),
              ],
            ),
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: accentColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
