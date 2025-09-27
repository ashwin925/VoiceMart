export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export const categories: Category[] = [
  {
    id: 'fashion-apparel',
    name: 'Fashion and apparel',
    products: [
      { id: 'mens-clothing', name: "Men's clothing", description: 'Stylish clothing for men', price: 49.99, deliveryDays: 3 },
      { id: 'womens-clothing', name: "Women's clothing", description: 'Trendy clothing for women', price: 59.99, deliveryDays: 3 },
      { id: 'kids-clothing', name: "Kids' clothing", description: 'Comfortable clothing for children', price: 29.99, deliveryDays: 2 },
      { id: 'shoes', name: 'Shoes', description: 'Quality footwear for all occasions', price: 79.99, deliveryDays: 4 },
      { id: 'accessories', name: 'Accessories', description: 'Bags, watches, scarves, jewelry', price: 39.99, deliveryDays: 2 },
      { id: 'swimwear', name: 'Swimwear and activewear', description: 'Athletic and swim clothing', price: 44.99, deliveryDays: 3 },
      { id: 'formal-wear', name: 'Formal and special occasion wear', description: 'Elegant clothing for special events', price: 129.99, deliveryDays: 5 }
    ]
  },
  {
    id: 'electronics-technology',
    name: 'Electronics and technology',
    products: [
      { id: 'computers-laptops', name: 'Computers and laptops', description: 'High-performance computing devices', price: 899.99, deliveryDays: 5 },
      { id: 'mobile-phones', name: 'Mobile phones and accessories', description: 'Latest smartphones and accessories', price: 699.99, deliveryDays: 3 },
      { id: 'televisions', name: 'Televisions and home audio', description: 'Entertainment systems for your home', price: 549.99, deliveryDays: 7 },
      { id: 'cameras-drones', name: 'Cameras and drones', description: 'Photography and videography equipment', price: 399.99, deliveryDays: 4 },
      { id: 'headphones-speakers', name: 'Headphones and speakers', description: 'Premium audio equipment', price: 149.99, deliveryDays: 2 },
      { id: 'video-games', name: 'Video games and consoles', description: 'Gaming systems and software', price: 299.99, deliveryDays: 3 },
      { id: 'smart-home', name: 'Smart home devices', description: 'Connected home automation', price: 199.99, deliveryDays: 4 },
      { id: 'office-electronics', name: 'Office electronics', description: 'Printers, monitors, and office tech', price: 249.99, deliveryDays: 5 }
    ]
  },
  {
    id: 'home-kitchen',
    name: 'Home and kitchen',
    products: [
      { id: 'furniture', name: 'Furniture', description: 'Quality furniture for every room', price: 299.99, deliveryDays: 10 },
      { id: 'home-decor', name: 'Home décor', description: 'Decorative items for your home', price: 49.99, deliveryDays: 5 },
      { id: 'bedding-bath', name: 'Bedding and bath', description: 'Comfortable bedding and bath essentials', price: 79.99, deliveryDays: 3 },
      { id: 'kitchen-appliances', name: 'Kitchen and dining appliances', description: 'Modern kitchen appliances', price: 199.99, deliveryDays: 7 },
      { id: 'cookware', name: 'Cookware', description: 'Professional-grade cooking equipment', price: 89.99, deliveryDays: 4 },
      { id: 'storage-organization', name: 'Storage and organization', description: 'Home organization solutions', price: 39.99, deliveryDays: 3 },
      { id: 'cleaning-supplies', name: 'Household cleaning supplies', description: 'Cleaning products for your home', price: 24.99, deliveryDays: 2 }
    ]
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty and personal care',
    products: [
      { id: 'skincare', name: 'Skincare', description: 'Premium skincare products', price: 59.99, deliveryDays: 3 },
      { id: 'makeup', name: 'Makeup', description: 'Cosmetics and beauty products', price: 39.99, deliveryDays: 2 },
      { id: 'hair-care', name: 'Hair care', description: 'Professional hair care products', price: 29.99, deliveryDays: 3 },
      { id: 'fragrances', name: 'Fragrances', description: 'Luxury perfumes and colognes', price: 79.99, deliveryDays: 4 },
      { id: 'personal-hygiene', name: 'Personal hygiene', description: 'Daily hygiene essentials', price: 19.99, deliveryDays: 2 },
      { id: 'grooming-tools', name: 'Grooming tools', description: 'Professional grooming equipment', price: 49.99, deliveryDays: 3 }
    ]
  },
  {
    id: 'health-wellness',
    name: 'Health and wellness',
    products: [
      { id: 'fitness-equipment', name: 'Fitness equipment', description: 'At-home gym gear', price: 199.99, deliveryDays: 7 },
      { id: 'supplements-vitamins', name: 'Supplements and vitamins', description: 'Health supplements and vitamins', price: 34.99, deliveryDays: 3 },
      { id: 'healthcare-products', name: 'Healthcare products', description: 'First aid and medical supplies', price: 24.99, deliveryDays: 2 },
      { id: 'wellness-relaxation', name: 'Wellness and relaxation items', description: 'Products for relaxation and wellness', price: 69.99, deliveryDays: 4 }
    ]
  },
  {
    id: 'books-media-entertainment',
    name: 'Books, media, and entertainment',
    products: [
      { id: 'books', name: 'Books', description: 'Physical and e-books', price: 19.99, deliveryDays: 3 },
      { id: 'movies-music', name: 'Movies and music', description: 'CDs, DVDs, Blu-rays', price: 24.99, deliveryDays: 2 },
      { id: 'video-games-media', name: 'Video games', description: 'Gaming software and media', price: 59.99, deliveryDays: 3 },
      { id: 'toys-hobbies', name: 'Toys and hobbies', description: 'Toys and hobby supplies', price: 39.99, deliveryDays: 4 },
      { id: 'art-craft-supplies', name: 'Art and craft supplies', description: 'Creative art and craft materials', price: 29.99, deliveryDays: 3 }
    ]
  }
];

// Additional categories (continuing from the 6 above to reach 12 total)
export const additionalCategories: Category[] = [
  {
    id: 'food-beverage',
    name: 'Food and beverage',
    products: [
      { id: 'groceries', name: 'Groceries', description: 'Fresh groceries and essentials', price: 49.99, deliveryDays: 1 },
      { id: 'gourmet-food', name: 'Gourmet and specialty food', description: 'Premium specialty foods', price: 79.99, deliveryDays: 3 },
      { id: 'beverages', name: 'Beverages', description: 'Coffee, tea, juices', price: 19.99, deliveryDays: 2 },
      { id: 'snacks-confectionery', name: 'Snacks and confectionery', description: 'Snacks and sweet treats', price: 14.99, deliveryDays: 2 }
    ]
  },
  {
    id: 'sports-outdoors',
    name: 'Sports and outdoors',
    products: [
      { id: 'camping-hiking', name: 'Camping and hiking gear', description: 'Outdoor adventure equipment', price: 129.99, deliveryDays: 5 },
      { id: 'athletic-apparel', name: 'Athletic apparel and footwear', description: 'Sports clothing and shoes', price: 89.99, deliveryDays: 3 },
      { id: 'outdoor-sports-equipment', name: 'Outdoor sports equipment', description: 'Equipment for outdoor sports', price: 199.99, deliveryDays: 7 },
      { id: 'water-sports', name: 'Water sports and activities gear', description: 'Equipment for water activities', price: 149.99, deliveryDays: 5 }
    ]
  },
  {
    id: 'baby-kids-pets',
    name: 'Baby, kids, and pet products',
    products: [
      { id: 'baby-food-diapers', name: 'Baby food and diapers', description: 'Essential baby care products', price: 39.99, deliveryDays: 2 },
      { id: 'baby-gear', name: 'Baby gear', description: 'Strollers, car seats, and baby equipment', price: 199.99, deliveryDays: 5 },
      { id: 'pet-food-treats', name: 'Pet food and treats', description: 'Nutritious food for pets', price: 29.99, deliveryDays: 3 },
      { id: 'pet-toys-accessories', name: 'Pet toys and accessories', description: 'Fun toys and accessories for pets', price: 24.99, deliveryDays: 2 }
    ]
  },
  {
    id: 'diy-tools-industrial',
    name: 'DIY, tools, and industrial',
    products: [
      { id: 'home-improvement', name: 'Home improvement and hardware', description: 'Tools and materials for home projects', price: 89.99, deliveryDays: 5 },
      { id: 'power-tools', name: 'Power tools and hand tools', description: 'Professional and DIY tools', price: 149.99, deliveryDays: 4 },
      { id: 'gardening-supplies', name: 'Gardening supplies', description: 'Everything for your garden', price: 49.99, deliveryDays: 3 },
      { id: 'scientific-industrial', name: 'Scientific and industrial supplies', description: 'Specialized industrial equipment', price: 299.99, deliveryDays: 10 }
    ]
  },
  {
    id: 'automotive-parts',
    name: 'Automotive and parts',
    products: [
      { id: 'car-parts-accessories', name: 'Car parts and accessories', description: 'Automotive parts and accessories', price: 79.99, deliveryDays: 5 },
      { id: 'motorcycles-gear', name: 'Motorcycles and related gear', description: 'Motorcycle equipment and gear', price: 199.99, deliveryDays: 7 }
    ]
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    products: [
      { id: 'office-supplies', name: 'Office supplies', description: 'Essential office supplies', price: 29.99, deliveryDays: 3 },
      { id: 'custom-merchandise', name: 'Custom-designed merchandise', description: 'Personalized products', price: 39.99, deliveryDays: 7 },
      { id: 'handmade-products', name: 'Handmade products', description: 'Unique handcrafted items', price: 59.99, deliveryDays: 5 },
      { id: 'gift-cards', name: 'Gift cards', description: 'Digital and physical gift cards', price: 25.00, deliveryDays: 1 }
    ]
  }
];

// Combine all categories
export const allCategories = [...categories, ...additionalCategories];
