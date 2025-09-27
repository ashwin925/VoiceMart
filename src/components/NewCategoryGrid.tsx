import React, { useState } from 'react';
import { allCategories, type Category, type Product } from '../data/categories';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Image placeholder */}
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-500">Image placeholder</span>
        </div>

        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          <span className="text-sm text-gray-500">Delivered in {product.deliveryDays} days</span>
        </div>

        <div className="flex space-x-3">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onClick }) => {
  return (
    <div
      className={`flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 mx-2 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
      onClick={onClick}
    >
      {/* Image placeholder */}
      <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Image</span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h4>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-blue-600">${product.price}</span>
        <span className="text-xs text-gray-500">{product.deliveryDays}d delivery</span>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: Category;
  isSelected: boolean;
  selectedProduct: string | null;
  onCategorySelect: () => void;
  onProductSelect: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  isSelected,
  selectedProduct,
  onCategorySelect,
  onProductSelect,
  onProductClick
}) => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  // Scroll to this section when selected
  React.useEffect(() => {
    if (isSelected && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [isSelected]);

  // Pause animation when a product is selected
  React.useEffect(() => {
    setIsPaused(!!selectedProduct);
  }, [selectedProduct]);

  return (
    <div ref={sectionRef} className="mb-12" id={`category-${category.id}`}>
      <div
        className={`flex items-center justify-between mb-6 cursor-pointer p-4 rounded-lg transition-all duration-200 ${isSelected ? 'bg-blue-50 border-2 border-blue-500 shadow-lg' : 'hover:bg-gray-50'
          }`}
        onClick={onCategorySelect}
      >
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
        {isSelected && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-600 font-medium">FOCUSED</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div className={`flex ${isPaused ? '' : 'animate-scroll-left'} hover:pause-animation`}>
          {/* Duplicate products for seamless loop */}
          {[...category.products, ...category.products].map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              isSelected={selectedProduct === product.id && isSelected}
              onClick={() => {
                onProductSelect(product.id);
                // Don't auto-open modal on click, wait for "enter" command
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const NewCategoryGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleProductClick = (product: Product) => {
    setModalProduct(product);
  };

  const handleEnter = () => {
    if (selectedProduct && selectedCategory) {
      const category = allCategories.find(c => c.id === selectedCategory);
      const product = category?.products.find(p => p.id === selectedProduct);
      if (product) {
        setModalProduct(product);
      }
    }
  };

  const handleExit = () => {
    setModalProduct(null);
    setSelectedProduct(null);
  };

  // Expose functions to voice commands
  React.useEffect(() => {
    (window as any).handleCategoryEnter = handleEnter;
    (window as any).handleCategoryExit = handleExit;

    (window as any).selectCategory = (categoryName: string) => {
      console.log('Trying to select category:', categoryName);
      const category = allCategories.find(c =>
        c.name.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(c.name.toLowerCase())
      );
      if (category) {
        console.log('Found category:', category.name);
        handleCategorySelect(category.id);
        return true;
      }
      console.log('Category not found');
      return false;
    };

    (window as any).selectProduct = (productName: string) => {
      console.log('Trying to select product:', productName, 'in category:', selectedCategory);
      if (selectedCategory) {
        const category = allCategories.find(c => c.id === selectedCategory);
        const product = category?.products.find(p =>
          p.name.toLowerCase().includes(productName.toLowerCase()) ||
          productName.toLowerCase().includes(p.name.toLowerCase())
        );
        if (product) {
          console.log('Found product:', product.name);
          handleProductSelect(product.id);
          return true;
        }
      }

      // If no category selected, search all categories
      for (const category of allCategories) {
        const product = category.products.find(p =>
          p.name.toLowerCase().includes(productName.toLowerCase()) ||
          productName.toLowerCase().includes(p.name.toLowerCase())
        );
        if (product) {
          console.log('Found product in category:', category.name, 'product:', product.name);
          handleCategorySelect(category.id);
          handleProductSelect(product.id);
          return true;
        }
      }

      console.log('Product not found');
      return false;
    };
  }, [selectedCategory]);

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-xl text-gray-600">
          Say "select [category name]" to focus on a category, then "select [product name]" and "enter" to view details
        </p>
      </div>

      {allCategories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          selectedProduct={selectedProduct}
          onCategorySelect={() => handleCategorySelect(category.id)}
          onProductSelect={handleProductSelect}
          onProductClick={handleProductClick}
        />
      ))}

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
    </div>
  );
};

export default NewCategoryGrid;
