import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import type { Category } from '../types';
import { categoryService } from '../services/firebase';
import Container from './Container';
import { Package, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <motion.div
      className="category-card p-6 min-w-[280px] mx-3 cursor-pointer"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      data-category={category.name.toLowerCase()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Category Image */}
      <div className="w-full h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <Package className="w-12 h-12 text-primary-500" />
        )}
      </div>

      {/* Subcategories */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Popular items:</p>
        <div className="flex flex-wrap gap-1">
          {category.subcategories.slice(0, 3).map((subcategory, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {subcategory}
            </span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{category.subcategories.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Voice Command Hint */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          🎤 Say: "Go to {category.name.toLowerCase()}"
        </p>
      </div>
    </motion.div>
  );
};

interface MovingCategoryRowProps {
  categories: Category[];
  direction?: 'left' | 'right';
  speed?: number;
}

const MovingCategoryRow: React.FC<MovingCategoryRowProps> = ({
  categories,
  direction = 'left',
  speed = 30
}) => {
  const handleCategoryClick = (category: Category) => {
    // Scroll to category section or navigate
    const element = document.getElementById(category.name.toLowerCase()) ||
      document.querySelector(`[data-category="${category.name.toLowerCase()}"]`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="overflow-hidden py-4">
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? [0, -100 * categories.length] : [-100 * categories.length, 0]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear'
          }
        }}
        style={{ width: `${categories.length * 200}%` }}
      >
        {/* Duplicate categories for seamless loop */}
        {[...categories, ...categories].map((category, index) => (
          <CategoryCard
            key={`${category.id}-${index}`}
            category={category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </motion.div>
    </div>
  );
};

const CategoryGrid: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { categories, loading } = state;
  const [error, setError] = useState<string | null>(null);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const categoriesData = await categoryService.getCategories();
        dispatch({ type: 'SET_CATEGORIES', payload: categoriesData });
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, dispatch]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Categories</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </Container>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Available</h3>
            <p className="text-gray-600">Categories will appear here once they are added.</p>
          </div>
        </Container>
      </section>
    );
  }

  // Split categories into rows for different animations
  const midpoint = Math.ceil(categories.length / 2);
  const firstRowCategories = categories.slice(0, midpoint);
  const secondRowCategories = categories.slice(midpoint);

  return (
    <section className="py-16 bg-gray-50" id="categories">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Browse our wide selection of products
          </p>
          <p className="text-sm text-gray-500">
            🎤 Use voice commands: "Go to [category name]" to navigate quickly
          </p>
        </div>
      </Container>

      {/* Moving Category Rows */}
      <div className="space-y-8">
        {firstRowCategories.length > 0 && (
          <MovingCategoryRow
            categories={firstRowCategories}
            direction="left"
            speed={40}
          />
        )}

        {secondRowCategories.length > 0 && (
          <MovingCategoryRow
            categories={secondRowCategories}
            direction="right"
            speed={35}
          />
        )}
      </div>

      {/* Static Grid for Mobile */}
      <div className="md:hidden mt-8">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => {
                  const element = document.getElementById(category.name.toLowerCase());
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            ))}
          </div>
        </Container>
      </div>

      {/* Voice Command Instructions */}
      <Container className="mt-12">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
            Voice Navigation Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium mb-1">Category Navigation:</p>
              <ul className="space-y-1">
                <li>• "Go to electronics"</li>
                <li>• "Show me fashion items"</li>
                <li>• "Navigate to home and garden"</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">General Commands:</p>
              <ul className="space-y-1">
                <li>• "Listen now" - Activate commands</li>
                <li>• "Stop listening" - Deactivate</li>
                <li>• "Help" - Show all commands</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CategoryGrid;
