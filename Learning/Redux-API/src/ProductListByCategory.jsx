import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './features/productSlice';

const ProductListByCategory = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <CategorySection title="Men's Clothing" products={categories["men's clothing"]} />
      <CategorySection title="Women's Clothing" products={categories["women's clothing"]} />
      <CategorySection title="Electronics" products={categories.electronics} />
      <CategorySection title="Jewelery" products={categories.jewelery} />
    </div>
  );
};

const CategorySection = ({ title, products }) => (
  <div className="my-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
  </div>
);

export default ProductListByCategory;
