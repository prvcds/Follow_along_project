import  { useState, useEffect } from "react";
import Product from "../component/auth/Product.jsx";
// import { productData } from "../static/data.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/v2/product/get-products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json()
      })
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      })
  }, []);

  if(loading){
    return (
      <div className="test-center text-white mt-10">Loading Products...</div>
    )
  }
  if(error){
    return <div className="test-center text-red-500 mt-10">Error: {error}</div>
  }

  return (
    <>
     
      <div className="w-full min-h-screen bg-neutral-800">
        <h1 className="text-3xl text-center text-white py-6">Product Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {products.map((product, index) => (
            <Product key={product.id || index} {...product} />
          ))}
        </div>
      </div>
    </>
  );
}
 