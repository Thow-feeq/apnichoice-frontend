import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const FALLBACK_IMAGE = "/category/fallback.jpg";

export default function ShopByCategory() {

  const { axios, navigate } = useAppContext();
  const [categories, setCategories] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    axios.get("/api/seller/category/tree").then((res) => {
      setCategories(res.data?.categories || []);
    });
  }, [axios]);

  const getImageUrl = (img) => {
    if (!img) return FALLBACK_IMAGE;
    if (img.startsWith("http")) return img;
    return `${API_URL}/uploads/${img}`;
  };

  const goToCategory = (cat) => {
    navigate(`/products/${cat.slug || cat.path}`);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (

    <section className="w-full py-10 bg-[#f6f6f6]">

      <div className="max-w-[1400px] mx-auto px-6">

        <h2 className="text-2xl font-semibold mb-6">
          Shop by category
        </h2>

        <div className="relative">

          {/* LEFT ARROW */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center"
          >
            ‹
          </button>

          {/* CATEGORY ROW */}

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-10"
          >

            {categories.map((cat) => (

              <div
                key={cat._id}
                onClick={() => goToCategory(cat)}
                className="min-w-[130px] cursor-pointer text-center group"
              >

                <div className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-center h-[110px] group-hover:shadow-md transition">

                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="h-16 object-contain"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                  />

                </div>

                <p className="mt-3 text-sm font-medium text-gray-700 leading-tight">
                  {cat.name}
                </p>

              </div>

            ))}

          </div>

          {/* RIGHT ARROW */}

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center"
          >
            ›
          </button>

        </div>

      </div>

    </section>
  );
}