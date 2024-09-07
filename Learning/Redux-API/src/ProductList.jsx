import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './features/productSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {products.map((product) => (
        <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg p-4">
          <img className="w-full h-40 object-cover" src={product.image} alt={product.title} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{product.title}</div>
            <p className="text-gray-700 text-base">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
