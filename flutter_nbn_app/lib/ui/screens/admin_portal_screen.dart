import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../data/api_service.dart';

class AdminPortalScreen extends StatefulWidget {
  const AdminPortalScreen({super.key});

  @override
  State<AdminPortalScreen> createState() => _AdminPortalScreenState();
}

class _AdminPortalScreenState extends State<AdminPortalScreen> {
  final ApiService _api = ApiService();
  Map<String, dynamic>? _db;
  bool _isLoading = true;

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
        child: CircularProgressIndicator(color: NBNTheme.goldAmber),
      );
    }

    final isDesktop = MediaQuery.of(context).size.width > 800;
    final members = (_db?['members'] as List?) ?? [];
    final chapters = (_db?['chapters'] as List?) ?? [];
    final users = (_db?['users'] as List?) ?? [];
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
              // ADMIN BANNER
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF020617)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF334155)),
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
                            color: NBNTheme.goldAmber.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            '🛡️ SUPER ADMIN CONSOLE',
                            style: TextStyle(
                              color: NBNTheme.goldAmber,
                              fontWeight: FontWeight.w900,
                              fontSize: 10,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'NBN மண்டல தலைமை நிர்வாகக் கட்டுப்பாட்டகம்',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'தருமபுரி & சேலம் மண்டலத்தின் 11 சாப்டர்கள், 100 தொழில் பிரிவுகள்',
                          style: TextStyle(
                            color: Color(0xFF94A3B8),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const CircleAvatar(
                      backgroundColor: NBNTheme.goldAmber,
                      child: Text('C', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                    )
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
                  _buildMetricCard('மொத்த உறுப்பினர்கள்', '${members.length}', '🏛️', NBNTheme.goldAmber),
                  _buildMetricCard('சாப்டர்கள்', '${chapters.length}', '🗺️', const Color(0xFF0284C7)),
                  _buildMetricCard('தேவைகள்', '${requirements.length}', '🛒', const Color(0xFF9333EA)),
                  _buildMetricCard('மொத்த வணிகம்', '₹3.85L+', '💰', NBNTheme.emeraldGreen),
                ],
              ),

              const SizedBox(height: 28),

              // CHAPTERS OCCUPANCY SECTION
              Text(
                '🏛️ சாப்டர்கள் & சீட் நிலவரம் (Chapter Occupancy)',
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
                  childAspectRatio: isDesktop ? 2.2 : 2.5,
                ),
                itemCount: chapters.length,
                itemBuilder: (context, index) {
                  final ch = chapters[index] as Map<String, dynamic>;
                  final filled = ch['filledSeats'] ?? 0;
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
                                ch['nameTa'] ?? ch['nameEn'] ?? 'Chapter',
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  '$filled / 100',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                                ),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${100 - filled} காலியிடங்கள்',
                                    style: const TextStyle(fontSize: 11, color: NBNTheme.emeraldGreen, fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    (ch['talukId'] ?? 'Regional').toString().toUpperCase(),
                                    style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              LinearProgressIndicator(
                                value: filled / 100.0,
                                backgroundColor: const Color(0xFFE2E8F0),
                                color: NBNTheme.goldAmber,
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 28),

              // USER MANAGEMENT TABLE / LIST
              Text(
                '👥 பயனர் மேலாண்மை (User Directory)',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 12),
              Card(
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: users.length,
                  separatorBuilder: (context, i) => const Divider(height: 1),
                  itemBuilder: (context, i) {
                    final u = users[i] as Map<String, dynamic>;
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor: NBNTheme.primaryNavy,
                        child: Text(
                          (u['fullName'] ?? 'U')[0],
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                      title: Text(
                        u['fullName'] ?? 'User',
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                      ),
                      subtitle: Text(
                        '${u['email'] ?? '-'} • 📞 ${u['phone'] ?? '-'}',
                        style: const TextStyle(fontSize: 12),
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: NBNTheme.lightEmerald,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          (u['status'] ?? 'ACTIVE').toString().toUpperCase(),
                          style: const TextStyle(
                            color: Color(0xFF065F46),
                            fontWeight: FontWeight.w900,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
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
                fontSize: 22,
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
