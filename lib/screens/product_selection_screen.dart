import 'package:flutter/material.dart';

class Product {
  final String id;
  final String name;
  final String price;
  final String image;
  final bool isDangle;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    this.isDangle = true,
  });
}

class ProductSelectionScreen extends StatelessWidget {
  const ProductSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final products = [
      Product(id: '1', name: 'Imperial Gold Jhumka', price: '\$1,299', image: 'assets/images/earring1.png', isDangle: true),
      Product(id: '2', name: 'Diamond Teardrop', price: '\$2,500', image: 'assets/images/earring2.png', isDangle: true),
      Product(id: '3', name: 'Pearl Studs', price: '\$850', image: 'assets/images/earring3.png', isDangle: false),
      Product(id: '4', name: 'Ruby Oval Dangle', price: '\$3,200', image: 'assets/images/earring4.png', isDangle: true),
      Product(id: '5', name: 'Silver Hoops', price: '\$450', image: 'assets/images/earring5.png', isDangle: false),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Icon(Icons.diamond_outlined, color: Color(0xFFD4AF37)),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
          IconButton(icon: const Icon(Icons.shopping_bag_outlined), onPressed: () {}),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            Text(
              'Exclusive Selection',
              style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 28),
            ),
            const Text(
              'Choose your piece for AR try-on',
              style: TextStyle(color: Colors.white54),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.7,
                  crossAxisSpacing: 15,
                  mainAxisSpacing: 15,
                ),
                itemCount: products.length,
                itemBuilder: (context, index) {
                  final p = products[index];
                  return Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF19191B),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(15),
                              image: DecorationImage(
                                image: AssetImage(p.image),
                                fit: BoxFit.cover,
                                // Color filters for mock variants
                                colorFilter: index > 1? ColorFilter.mode(
                                  index == 2 ? Colors.blue.withOpacity(0.2) : Colors.green.withOpacity(0.2), 
                                  BlendMode.colorBurn
                                ) : null,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                        const SizedBox(height: 4),
                        Text(p.price, style: const TextStyle(color: Color(0xFFD4AF37), fontSize: 13)),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xFFD4AF37)),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                            onPressed: () {
                              Navigator.pushNamed(context, '/ar_camera', arguments: p.id);
                            },
                            child: const Text('Try On', style: TextStyle(color: Color(0xFFD4AF37), fontSize: 12)),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
