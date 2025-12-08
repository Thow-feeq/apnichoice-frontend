import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function ShopByCategoryPicker() {
  const { axios, navigate } = useAppContext();

  const [tree, setTree] = useState([]);
  const [level1, setLevel1] = useState(null);
  const [level2, setLevel2] = useState(null);
  const [level3, setLevel3] = useState(null);

  useEffect(() => {
    axios.get("/api/seller/category/tree").then((res) => {
      setTree(res.data.categories || []);
    });
  }, [axios]);

  useEffect(() => {
    if (level3) {
      navigate(`/products/${level3.slug || level3.path}`);
    }
  }, [level3, navigate]);

  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-20 py-20 bg-gradient-to-br from-[#fff7f7] via-[#f5f7ff] to-[#fff]">

      {/* Title Centered like Banner */}
      <div className="max-w-[1600px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#800000] mb-14 text-center">
          Shop by Category
        </h2>

        {/* CARD CONTAINER */}
        <div className="bg-white/70 backdrop-blur rounded-[32px] p-10 shadow-2xl">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* ✅ LEVEL 1 */}
            <div className="bg-white rounded-2xl shadow-lg max-h-[420px] overflow-y-auto">
              {tree.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    setLevel1(c);
                    setLevel2(null);
                    setLevel3(null);
                  }}
                  className={`px-6 py-4 cursor-pointer text-lg font-semibold flex justify-between items-center transition-all duration-200
              ${level1?._id === c._id
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white scale-[1.02]"
                      : "hover:bg-gray-100 text-gray-800"
                    }`}
                >
                  {c.name || c.text}
                  <span className="text-2xl">›</span>
                </div>
              ))}
            </div>

            {/* ✅ LEVEL 2 */}
            <div className="bg-white rounded-2xl shadow-lg max-h-[420px] overflow-y-auto">
              {level1?.children?.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    setLevel2(c);
                    setLevel3(null);
                  }}
                  className={`px-6 py-4 cursor-pointer text-lg font-semibold flex justify-between items-center transition-all duration-200
              ${level2?._id === c._id
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white scale-[1.02]"
                      : "hover:bg-gray-100 text-gray-800"
                    }`}
                >
                  {c.name || c.text}
                  <span className="text-2xl">›</span>
                </div>
              ))}
            </div>

            {/* ✅ LEVEL 3 */}
            <div className="bg-white rounded-2xl shadow-lg max-h-[420px] overflow-y-auto">
              {level2?.children?.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setLevel3(c)}
                  className={`px-6 py-4 cursor-pointer text-lg font-semibold flex justify-between items-center transition-all duration-200
              ${level3?._id === c._id
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white scale-[1.02]"
                      : "hover:bg-gray-100 text-gray-800"
                    }`}
                >
                  {c.name || c.text}
                  <span className="text-2xl">›</span>
                </div>
              ))}
            </div>

            {/* ✅ FINAL PREVIEW BOX */}
            <div className="bg-white rounded-2xl shadow-lg flex items-center justify-center text-center p-10 border-2 border-dashed border-gray-300">

              {level3 ? (
                <div>
                  <p className="text-sm text-gray-500 mb-3 uppercase tracking-widest">
                    Final Category
                  </p>

                  <p className="text-3xl font-bold text-gray-900 mb-8">
                    {level3.name || level3.text}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/products/${level3.slug || level3.path}`)
                    }
                    className="px-10 py-4 rounded-2xl bg-[#800000] text-white font-semibold text-lg hover:bg-[#660000] transition shadow-lg"
                  >
                    View Products →
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-xl font-medium">
                  Select final category
                </p>
              )}

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
