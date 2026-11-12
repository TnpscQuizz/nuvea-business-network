import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_nbn_app/main.dart';

void main() {
  testWidgets('NBN App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NBNFlutterApp());
    expect(find.textContaining('Nuvea Business Network'), findsWidgets);
  });
}
