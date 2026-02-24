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
            {/* ✅ LEVEL 1 WITH IMAGE */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto">

              {tree.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    setLevel1(c);
                    setLevel2(null);
                    setLevel3(null);
                  }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300
        ${level1?._id === c._id ? "ring-4 ring-indigo-500 scale-[1.02]" : ""}
      `}
                >

                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-44 object-cover group-hover:scale-105 transition"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                    <span className="text-xl font-bold">{c.name}</span>
                    <span className="text-2xl">›</span>
                  </div>

                </div>
              ))}

            </div>

            {/* ✅ LEVEL 2 */}
            {/* ✅ LEVEL 2 WITH IMAGE */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto">

              {level1?.children?.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    setLevel2(c);
                    setLevel3(null);
                  }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300
        ${level2?._id === c._id ? "ring-4 ring-indigo-500 scale-[1.02]" : ""}
      `}
                >

                  {/* IMAGE */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* TEXT */}
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white">
                    <span className="text-lg font-bold">{c.name}</span>
                    <span className="text-2xl">›</span>
                  </div>

                </div>
              ))}

            </div>

            {/* ✅ LEVEL 3 */}
            {/* ✅ LEVEL 3 WITH IMAGE */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto">

              {level2?.children?.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setLevel3(c)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300
        ${level3?._id === c._id ? "ring-4 ring-indigo-500 scale-[1.02]" : ""}
      `}
                >

                  {/* IMAGE */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-36 object-cover group-hover:scale-105 transition"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* TEXT */}
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white">
                    <span className="text-lg font-semibold">{c.name}</span>
                    <span className="text-2xl">›</span>
                  </div>

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
