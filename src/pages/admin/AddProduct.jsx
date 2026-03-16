import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

/* TEXTILE SIZE GROUPS */

const SIZE_GROUPS = {
  mens_shirt: ["S","M","L","XL","XXL","XXXL"],
  mens_pant: ["28","30","32","34","36","38","40","42"],
  womens_kurti: ["XS","S","M","L","XL","XXL","3XL","4XL"],
  womens_blouse: ["32","34","36","38","40","42","44"],
  saree: ["Free Size"],
  kids: ["1Y","2Y","3Y","4Y","5Y","6Y","7Y","8Y","9Y","10Y"]
};

export default function AddProduct(){

const { axios } = useAppContext();

/* BASIC */

const [name,setName] = useState("");
const [description,setDescription] = useState("");
const [price,setPrice] = useState("");
const [offerPrice,setOfferPrice] = useState("");

/* CATEGORY */

const [categories,setCategories] = useState([]);

const [mainCat,setMainCat] = useState("");
const [subCat,setSubCat] = useState("");
const [childCat,setChildCat] = useState("");

const [mainSlug,setMainSlug] = useState("");
const [subSlug,setSubSlug] = useState("");
const [childSlug,setChildSlug] = useState("");

/* PRODUCT */

const [images,setImages] = useState([]);
const [stock,setStock] = useState("");
const [hasVariants,setHasVariants] = useState(false);

/* VARIANTS */

const [variants,setVariants] = useState([]);

/* LOAD CATEGORIES */

useEffect(()=>{
loadCategories();
},[]);

const loadCategories = async()=>{

try{

const res = await axios.get("/api/category/list");

if(res.data.success){
setCategories(res.data.categories);
}

}catch(err){
toast.error("Category load failed");
}

};

/* CATEGORY FILTER */

const mainCategories = categories.filter(c=>!c.parent);
const subCategories = categories.filter(c=>c.parent===mainCat);
const childCategories = categories.filter(c=>c.parent===subCat);

/* SIZE DETECTOR */

const getSizeGroup = ()=>{

const categoryName = (childSlug || subSlug || mainSlug || "").toLowerCase();

if(categoryName.includes("shirt"))
return SIZE_GROUPS.mens_shirt;

if(categoryName.includes("pant") || categoryName.includes("trouser"))
return SIZE_GROUPS.mens_pant;

if(categoryName.includes("kurti"))
return SIZE_GROUPS.womens_kurti;

if(categoryName.includes("blouse"))
return SIZE_GROUPS.womens_blouse;

if(categoryName.includes("saree"))
return SIZE_GROUPS.saree;

if(categoryName.includes("kid"))
return SIZE_GROUPS.kids;

return SIZE_GROUPS.mens_shirt;

};

/* AUTO LOAD SIZES */

useEffect(()=>{

const category = childSlug || subSlug || mainSlug;

if(!category) return;

const sizes = getSizeGroup();

setVariants([
{
colorName:"",
colorCode:"#000000",
pattern:"",
sizes: sizes.map(size=>({
size,
quantity:0
})),
images:[]
}
]);

},[childSlug,subSlug,mainSlug]);

/* ADD VARIANT */

const addVariant = ()=>{

const sizes = getSizeGroup();

setVariants([
...variants,
{
colorName:"",
colorCode:"#000000",
pattern:"",
sizes: sizes.map(size=>({
size,
quantity:0
})),
images:[]
}
]);

};

/* IMAGE HANDLER */

const handleImageSelect = (index,file)=>{

const copy=[...images];
copy[index]=file;
setImages(copy);

};

/* SUBMIT */

const handleSubmit = async()=>{

try{

if(!name || !price)
return toast.error("Name & Price required");

const category = childSlug || subSlug || mainSlug;

if(!category)
return toast.error("Select category");

const productData = {

name,

description: description.split("\n").filter(Boolean),

category,

price:Number(price),

offerPrice:offerPrice ? Number(offerPrice) : 0,

variants: hasVariants ? variants : [],

stock: hasVariants ? 0 : Number(stock)

};

const formData = new FormData();

formData.append("productData",JSON.stringify(productData));

images.forEach(img=>{
if(img) formData.append("images",img);
});

const res = await axios.post("/api/product/add",formData);

if(res.data.success){
toast.success("Product Added");
}else{
toast.error(res.data.message);
}

}catch(err){
toast.error(err.message);
}

};

/* UI */

/* UI */

return (

<div className="p-10 bg-gray-50 min-h-screen">

<h1 className="text-2xl font-semibold mb-6">Add Product</h1>

<div className="bg-white p-6 rounded shadow space-y-6">

{/* PRODUCT NAME */}

<div className="space-y-1">
<label className="text-sm font-medium text-gray-700">
Product Name
</label>

<input
className="border p-2 w-full rounded"
value={name}
onChange={e=>setName(e.target.value)}
/>
</div>


{/* CATEGORY */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-700">
Category
</label>

<div className="grid grid-cols-3 gap-4">

<select
className="border p-2 rounded"
value={mainCat}
onChange={(e)=>{

const selected = categories.find(c=>c._id===e.target.value);

setMainCat(selected._id);
setMainSlug(selected.slug);

setSubCat("");
setChildCat("");
setSubSlug("");
setChildSlug("");

}}
>

<option value="">Select Main Category</option>

{mainCategories.map(cat=>(
<option key={cat._id} value={cat._id}>
{cat.name}
</option>
))}

</select>


{subCategories.length>0 && (

<select
className="border p-2 rounded"
value={subCat}
onChange={(e)=>{

const selected = categories.find(c=>c._id===e.target.value);

setSubCat(selected._id);
setSubSlug(selected.slug);

setChildCat("");
setChildSlug("");

}}
>

<option value="">Select Sub Category</option>

{subCategories.map(cat=>(
<option key={cat._id} value={cat._id}>
{cat.name}
</option>
))}

</select>

)}


{childCategories.length>0 && (

<select
className="border p-2 rounded"
value={childCat}
onChange={(e)=>{

const selected = categories.find(c=>c._id===e.target.value);

setChildCat(selected._id);
setChildSlug(selected.slug);

}}
>

<option value="">Select Child Category</option>

{childCategories.map(cat=>(
<option key={cat._id} value={cat._id}>
{cat.name}
</option>
))}

</select>

)}

</div>

</div>


{/* DESCRIPTION */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-700">
Product Description
</label>

<textarea
className="border p-2 w-full rounded"
rows="4"
value={description}
onChange={e=>setDescription(e.target.value)}
/>

</div>


{/* PRICE */}

<div className="grid grid-cols-2 gap-4">

<div className="space-y-1">

<label className="text-sm font-medium text-gray-700">
Price
</label>

<input
className="border p-2 rounded w-full"
value={price}
onChange={e=>setPrice(e.target.value)}
/>

</div>

<div className="space-y-1">

<label className="text-sm font-medium text-gray-700">
Offer Price
</label>

<input
className="border p-2 rounded w-full"
value={offerPrice}
onChange={e=>setOfferPrice(e.target.value)}
/>

</div>

</div>


{/* PRODUCT TYPE */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-700">
Product Type
</label>

<div className="flex gap-6">

<label className="flex items-center gap-2">
<input
type="radio"
checked={!hasVariants}
onChange={()=>setHasVariants(false)}
/>
Simple Product
</label>

<label className="flex items-center gap-2">
<input
type="radio"
checked={hasVariants}
onChange={()=>setHasVariants(true)}
/>
Variant Product
</label>

</div>

</div>


{/* IMAGE UPLOAD */}

<div className="space-y-2">

<label className="text-sm font-medium text-gray-700">
Product Images
</label>

<div className="grid grid-cols-4 gap-4">

{[0,1,2,3].map((_,i)=>(

<label
key={i}
className="border rounded h-28 flex items-center justify-center cursor-pointer bg-gray-50"
>

<input
type="file"
hidden
accept="image/*"
onChange={(e)=>handleImageSelect(i,e.target.files[0])}
/>

{images[i] ?

<img
src={URL.createObjectURL(images[i])}
className="h-full w-full object-cover rounded"
/>

:

<span className="text-gray-400 text-sm">
+ Upload
</span>

}

</label>

))}

</div>

</div>


{/* SIMPLE STOCK */}

{!hasVariants && (

<div className="space-y-1">

<label className="text-sm font-medium text-gray-700">
Stock Quantity
</label>

<input
className="border p-2 rounded w-full"
value={stock}
onChange={e=>setStock(e.target.value)}
/>

</div>

)}


{/* VARIANTS */}

{hasVariants && (

<div className="space-y-6">

<h2 className="font-semibold text-lg">Variants</h2>

{variants.map((v,index)=>(

<div key={index} className="border p-4 rounded space-y-3">

<div className="space-y-1">

<label className="text-sm font-medium">
Color Name
</label>

<input
className="border p-2 w-full"
value={v.colorName}
onChange={(e)=>{

const copy=[...variants];
copy[index].colorName=e.target.value;
setVariants(copy);

}}
/>

</div>


<div className="space-y-1">

<label className="text-sm font-medium">
Color Picker
</label>

<input
type="color"
value={v.colorCode}
onChange={(e)=>{

const copy=[...variants];
copy[index].colorCode=e.target.value;
setVariants(copy);

}}
/>

</div>


<div className="space-y-1">

<label className="text-sm font-medium">
Pattern
</label>

<input
className="border p-2 w-full"
value={v.pattern}
onChange={(e)=>{

const copy=[...variants];
copy[index].pattern=e.target.value;
setVariants(copy);

}}
/>

</div>


<div className="grid grid-cols-3 gap-3">

{v.sizes.map((s,si)=>(

<div key={si} className="flex gap-2 items-center">

<span>{s.size}</span>

<input
type="number"
className="border p-1 w-20"
value={s.quantity}
onChange={(e)=>{

const copy=[...variants];
copy[index].sizes[si].quantity=e.target.value;
setVariants(copy);

}}
/>

</div>

))}

</div>

</div>

))}

<button
onClick={addVariant}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Add Variant
</button>

</div>

)}


<button
onClick={handleSubmit}
className="bg-green-600 text-white px-6 py-2 rounded"
>
Add Product
</button>

</div>

</div>

);
}