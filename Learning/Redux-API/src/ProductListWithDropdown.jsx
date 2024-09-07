import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './features/productSlice';
import { FaShoppingCart } from 'react-icons/fa';  // Import cart icon from react-icons

const ProductListWithDropdown = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    phone: '',
  });

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceChange = (e) => {
    setSelectedPriceRange(e.target.value);
  };

  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleBuy = () => {
    setShowModal(true); // Open the modal for delivery details
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true); // Open the modal for order confirmation
  };

  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    alert('Purchase completed! Thank you for your order.');
    setCart([]); // Clear the cart after purchase
    setShowModal(false); // Close the modal
    setDeliveryDetails({ name: '', address: '', phone: '' }); // Reset delivery details
  };

  const handleConfirmCheckout = () => {
    alert('Proceeding to checkout!');
    setShowCheckoutModal(false); // Close the checkout modal
  };

  // Filter products by category and price range
  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory === 'all') return true;
      return product.category === selectedCategory;
    })
    .filter((product) => {
      if (selectedPriceRange === 'all') return true;
      if (selectedPriceRange === 'low') return product.price < 50;
      if (selectedPriceRange === 'medium') return product.price >= 50 && product.price < 100;
      if (selectedPriceRange === 'high') return product.price >= 100;
    });

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="p-6 relative">
      {/* Cart Icon in the Top Right */}
      <div className="absolute top-4 right-4">
        <button
          className="relative"
          onClick={handleCheckout}
        >
          <FaShoppingCart size={30} />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Category Dropdown */}
      <div className="mb-6">
        <label htmlFor="category" className="block mb-2 text-lg font-medium">
          Choose a category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="all">All Products</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
        </select>
      </div>

      {/* Price Dropdown */}
      <div className="mb-6">
        <label htmlFor="price" className="block mb-2 text-lg font-medium">
          Filter by price:
        </label>
        <select
          id="price"
          value={selectedPriceRange}
          onChange={handlePriceChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="all">All Prices</option>
          <option value="low">Below $50</option>
          <option value="medium">$50 - $100</option>
          <option value="high">Above $100</option>
        </select>
      </div>

      {/* Display Filtered Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg p-4">
            <img className="w-full h-40 object-cover" src={product.image} alt={product.title} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{product.title}</div>
              <p className="text-gray-700 text-base">${product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 text-white px-3 py-2 rounded mt-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="mb-4">
              {cart.map((item) => (
                <li key={item.id} className="mb-2">
                  {item.title} (x{item.quantity}) - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="font-bold">Total: ${totalCartPrice.toFixed(2)}</p>

            <div className="flex gap-4">
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
              >
                Checkout
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuy}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
              >
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal for Delivery Details */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Enter Delivery Details</h2>
            <form onSubmit={handleSubmitDelivery}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium">
                  Name:
                </label>
                <input
                  id="name"
                  type="text"
                  value={deliveryDetails.name}
                  onChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, name: e.target.value })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-lg font-medium">
                  Address:
                </label>
                <input
                  id="address"
                  type="text"
                  value={deliveryDetails.address}
                  onChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, address: e.target.value })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-lg font-medium">
                  Phone:
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={deliveryDetails.phone}
                  onChange={(e) =>
                    setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Checkout Confirmation */}
      {showCheckoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Checkout Confirmation</h2>
            <p>Your total is ${totalCartPrice.toFixed(2)}.</p>
            <button
              onClick={handleConfirmCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Confirm Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListWithDropdown;
