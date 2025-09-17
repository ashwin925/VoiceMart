import React, { useState } from 'react';
import Container from '../components/Container';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import ProductList from '../components/admin/ProductList';
import { Settings, Package, Users, BarChart3, Plus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { state } = useAppContext();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'analytics'>('overview');

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white border-b">
        <Container padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage products, categories, and monitor your VoiceCart store
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Welcome back,</span>
              <span className="font-medium text-gray-900">{user?.displayName || user?.email}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'products', name: 'Products', icon: Package },
                { id: 'categories', name: 'Categories', icon: Settings },
                { id: 'analytics', name: 'Analytics', icon: Users },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </Container>
      </section>

      {/* Stats Overview */}
      <section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{state.products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{state.categories.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Voice Commands</p>
                  <p className="text-2xl font-bold text-gray-900">5,678</p>
                </div>
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Actions */}
      <section>
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Add Product</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Add a new product to your catalog with images and details
              </p>
            </button>

            <button className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Manage Categories</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Create and organize product categories and subcategories
              </p>
            </button>

            <button className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">View Analytics</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Monitor voice command usage and user engagement
              </p>
            </button>
          </div>
        </Container>
      </section>

      {/* Tab Content */}
      <section>
        <Container>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Manage Products</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Add, edit, and organize your product catalog
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Manage Categories</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Create and organize product categories and subcategories
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">View Analytics</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Monitor voice command usage and user engagement
                    </p>
                  </button>
                </div>
              </div>

              {/* Recent Products Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Products</h2>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="btn-primary"
                  >
                    View All Products
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  {state.products.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                      <p className="text-gray-600 mb-4">
                        Get started by adding your first product to the catalog
                      </p>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="btn-primary"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {state.products.slice(0, 6).map((product) => (
                          <div key={product.id} className="border rounded-lg p-4">
                            <img
                              src={product.imageUrl || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                            <p className="text-lg font-semibold text-gray-900 mt-2">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && <ProductList />}

          {activeTab === 'categories' && (
            <div className="text-center py-16">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Category Management</h3>
              <p className="text-gray-600">Category management interface coming soon...</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-16">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Analytics and reporting features coming soon...</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default AdminDashboard;
