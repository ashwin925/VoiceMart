import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,

  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
import type { Product, Category, User, ProductFormData, CategoryFormData } from '../types';

// Auth service
export const authService = {
  // Sign in with Google
  signInWithGoogle: async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user is admin (you can customize this logic)
    const adminEmails = ['admin@voicecart.com', 'your-admin-email@gmail.com'];
    const isAdmin = adminEmails.includes(user.email || '');
    
    const userData: User = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      isAdmin,
      createdAt: Timestamp.now()
    };
    
    // Save user data to Firestore
    await updateDoc(doc(db, 'users', user.uid), userData as any);
    
    return userData;
  },

  // Sign out
  signOut: () => signOut(auth),

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as User);
        } else {
          // Create new user document
          const adminEmails = ['admin@voicecart.com', 'your-admin-email@gmail.com'];
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            isAdmin: adminEmails.includes(firebaseUser.email || ''),
            createdAt: Timestamp.now()
          };
          await updateDoc(doc(db, 'users', firebaseUser.uid), userData as any);
          callback(userData);
        }
      } else {
        callback(null);
      }
    });
  }
};

// Product service
export const productService = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(
      query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  // Get single product
  getProduct: async (id: string): Promise<Product | null> => {
    const docSnap = await getDoc(doc(db, 'products', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : null;
  },

  // Add new product
  addProduct: async (productData: ProductFormData, imageFile?: File): Promise<string> => {
    let imageUrl = '';
    
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, 'products');
    }
    
    const product = {
      ...productData,
      imageUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'products'), product);
    return docRef.id;
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<ProductFormData>, imageFile?: File): Promise<void> => {
    const updateData: any = {
      ...productData,
      updatedAt: Timestamp.now()
    };
    
    if (imageFile) {
      updateData.imageUrl = await uploadImage(imageFile, 'products');
    }
    
    await updateDoc(doc(db, 'products', id), updateData);
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    const product = await productService.getProduct(id);
    if (product?.imageUrl) {
      await deleteImage(product.imageUrl);
    }
    await deleteDoc(doc(db, 'products', id));
  },

  // Listen to products changes
  onProductsSnapshot: (callback: (products: Product[]) => void) => {
    return onSnapshot(
      query(collection(db, 'products'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        callback(products);
      }
    );
  }
};

// Category service
export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  },

  // Add new category
  addCategory: async (categoryData: CategoryFormData, imageFile?: File): Promise<string> => {
    let imageUrl = '';
    
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, 'categories');
    }
    
    const category = {
      name: categoryData.name,
      subcategories: categoryData.subcategories.split(',').map(s => s.trim()),
      imageUrl
    };
    
    const docRef = await addDoc(collection(db, 'categories'), category);
    return docRef.id;
  },

  // Update category
  updateCategory: async (id: string, categoryData: Partial<CategoryFormData>, imageFile?: File): Promise<void> => {
    const updateData: any = {};
    
    if (categoryData.name) updateData.name = categoryData.name;
    if (categoryData.subcategories) {
      updateData.subcategories = categoryData.subcategories.split(',').map(s => s.trim());
    }
    
    if (imageFile) {
      updateData.imageUrl = await uploadImage(imageFile, 'categories');
    }
    
    await updateDoc(doc(db, 'categories', id), updateData);
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    const category = await categoryService.getCategory(id);
    if (category?.imageUrl) {
      await deleteImage(category.imageUrl);
    }
    await deleteDoc(doc(db, 'categories', id));
  },

  // Get single category
  getCategory: async (id: string): Promise<Category | null> => {
    const docSnap = await getDoc(doc(db, 'categories', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Category : null;
  }
};

// Storage helper functions
const uploadImage = async (file: File, folder: string): Promise<string> => {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Initialize default categories if they don't exist
export const initializeDefaultCategories = async (): Promise<void> => {
  const categories = await categoryService.getCategories();
  
  if (categories.length === 0) {
    const defaultCategories = [
      {
        name: 'Electronics',
        subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Gaming'],
        imageUrl: ''
      },
      {
        name: 'Fashion',
        subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry'],
        imageUrl: ''
      },
      {
        name: 'Home & Garden',
        subcategories: ['Furniture', 'Kitchen', 'Decor', 'Tools', 'Outdoor'],
        imageUrl: ''
      },
      {
        name: 'Sports & Fitness',
        subcategories: ['Exercise Equipment', 'Outdoor Sports', 'Team Sports', 'Fitness Apparel'],
        imageUrl: ''
      }
    ];

    const batch = writeBatch(db);
    defaultCategories.forEach(category => {
      const docRef = doc(collection(db, 'categories'));
      batch.set(docRef, category);
    });
    
    await batch.commit();
  }
};
