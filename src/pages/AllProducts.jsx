import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import ShopByCategory from "../components/ShopByCategory";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AllProducts = () => {

  const { category } = useParams();
  const { products, searchQuery, setSearchQuery } = useAppContext();

  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH CATEGORY TREE ================= */

  useEffect(() => {

    const loadCategories = async () => {

      try {

        const { data } = await axios.get("/api/seller/category/tree");

        if (data.success) {

          setCategories(data.categories);

        }

      } catch {

        console.log("Category load failed");

      }

    }

    loadCategories()

  }, [])

  /* ================= FIND CATEGORY ================= */

  const findCategory = (nodes, slug) => {

    for (const node of nodes) {

      const nodeSlug = (node.slug || node.path || node.name).toLowerCase()

      if (nodeSlug === slug) return node

      if (node.children?.length) {

        const found = findCategory(node.children, slug)

        if (found) return found

      }

    }

    return null

  }

  /* ================= GET ALL CHILD SLUGS ================= */

  const getChildSlugs = (node) => {

    let list = [(node.slug || node.path || node.name).toLowerCase()]

    if (node.children?.length) {

      node.children.forEach(child => {

        list = list.concat(getChildSlugs(child))

      })

    }

    return list

  }

  /* ================= PRODUCT FILTER ================= */

  useEffect(() => {

    let filtered = [...products]

    if (category) {

      const slug = category.toLowerCase()

      const selected = findCategory(categories, slug)

      let allowed = [slug]

      if (selected) {

        allowed = getChildSlugs(selected)

      }

      filtered = filtered.filter(p => {

        const cat = p.category?.toLowerCase()

        return allowed.includes(cat)

      })

    }

    if (searchQuery.trim()) {

      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

    }

    if (sortOption === "price-low") {

      filtered.sort((a, b) => a.offerPrice - b.offerPrice)

    }

    if (sortOption === "price-high") {

      filtered.sort((a, b) => b.offerPrice - a.offerPrice)

    }

    setFilteredProducts(filtered)

  }, [products, category, searchQuery, sortOption, categories])

  /* ================= CLICK CATEGORY ================= */

  const goCategory = (cat) => {

    const slug = (cat.slug || cat.path || cat.name).toLowerCase()

    navigate(`/products/${slug}`)

  }

  /* ================= SIDEBAR TREE ================= */

  const CategoryNode = ({ node, depth = 0 }) => {

    const [open, setOpen] = useState(false)

    const slug = (node.slug || node.path || node.name).toLowerCase()

    const hasChildren = node.children?.length > 0

    const handleClick = () => {

      if (hasChildren) {

        setOpen(!open)

      } else {

        navigate(`/products/${slug}`)

      }

    }

    return (

      <div>

        <button
          onClick={handleClick}
          className="w-full text-left px-3 py-2 rounded-md flex justify-between items-center hover:bg-gray-100"
          style={{ paddingLeft: depth * 16 }}
        >

          {node.name}

          {hasChildren && (
            <span>{open ? "▾" : "›"}</span>
          )}

        </button>

        {open && hasChildren &&

          node.children.map(child => (
            <CategoryNode
              key={child._id}
              node={child}
              depth={depth + 1}
            />
          ))

        }

      </div>

    )

  }

  /* ================= UI ================= */

  return (

    <section className="w-full mt-20 max-w-[1600px] mx-auto px-4">

      <ShopByCategory />

      <div className="flex gap-8 mt-8">

        {/* SIDEBAR */}

        <aside className="w-64 hidden md:block bg-white border rounded-lg p-6 h-fit sticky top-24">

          <h2 className="text-lg font-semibold mb-6">
            Categories
          </h2>

          <button
            onClick={() => navigate("/products")}
            className={`w-full text-left px-3 py-2 rounded-md mb-3
  ${!category ? "bg-green-600 text-white" : "hover:bg-gray-100"}`}
          >
            All Items
          </button>

          {categories.map(cat => (
            <CategoryNode key={cat._id} node={cat} />
          ))}

        </aside>

        {/* PRODUCTS */}

        <main className="flex-1">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">

            <div>

              <p className="text-sm text-gray-500">

                <span
                  onClick={() => navigate("/products")}
                  className="cursor-pointer hover:text-green-600"
                >
                  All Categories
                </span>

                {category && <> / {category}</>}

              </p>

              <h1 className="text-2xl font-bold mt-1">
                {category ? category : "All Products"}
              </h1>

            </div>

            <div className="flex gap-3">

              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-3 py-2 rounded-md w-56"
              />

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border px-3 py-2 rounded-md"
              >

                <option value="">Sort</option>
                <option value="price-low">Price Low → High</option>
                <option value="price-high">Price High → Low</option>

              </select>

            </div>

          </div>

          {/* PRODUCTS */}

          {filteredProducts.length === 0 ? (

            <p className="text-gray-500">No products found</p>

          ) : (

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}

            </div>

          )}

        </main>

      </div>

    </section>

  )

}

export default AllProducts