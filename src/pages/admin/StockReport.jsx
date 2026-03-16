import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function StockReport() {

const { axios } = useAppContext();

const [rows,setRows] = useState([]);
const [search,setSearch] = useState("");

useEffect(()=>{
load();
},[]);

const load = async ()=>{

try{

const res = await axios.get("/api/admin/stock-report");

if(res.data.success){
setRows(res.data.data);
}

}catch(err){
console.log(err);
}

};

const filtered = rows.filter(item =>
item.product.toLowerCase().includes(search.toLowerCase())
);

const exportExcel = ()=>{

const exportData = filtered.map(item=>({
Product: item.product,
Category: item.category,
Color: item.color,
Size: item.size,
Available: item.available,
Sold: item.sold,
Status: item.status
}));

const worksheet = XLSX.utils.json_to_sheet(exportData);
const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook,worksheet,"Stock Report");

const excelBuffer = XLSX.write(workbook,{
bookType:"xlsx",
type:"array"
});

const data = new Blob([excelBuffer],{
type:"application/octet-stream"
});

const fileName = `stock-report-${new Date().toISOString().slice(0,10)}.xlsx`;

saveAs(data,fileName);

};

return(

<div className="p-6 space-y-6">

{/* HEADER */}

<div className="flex items-center justify-between">

<h1 className="text-2xl font-semibold">
Stock Report
</h1>

<div className="flex gap-3">

<input
type="text"
placeholder="Search product..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-2 rounded w-64"
/>

<button
onClick={exportExcel}
className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
Export Excel
</button>

</div>

</div>

{/* SUMMARY CARDS */}

<div className="grid grid-cols-3 gap-4">

<div className="bg-white p-4 rounded shadow">
<p className="text-gray-500 text-sm">Total Items</p>
<p className="text-xl font-semibold">{rows.length}</p>
</div>

<div className="bg-white p-4 rounded shadow">
<p className="text-gray-500 text-sm">Low Stock</p>
<p className="text-xl font-semibold text-yellow-600">
{rows.filter(r=>r.status==="Low").length}
</p>
</div>

<div className="bg-white p-4 rounded shadow">
<p className="text-gray-500 text-sm">Out Of Stock</p>
<p className="text-xl font-semibold text-red-600">
{rows.filter(r=>r.status==="Out of Stock").length}
</p>
</div>

</div>

{/* TABLE */}

<div className="bg-white rounded shadow overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-50 border-b">

<tr>

<th className="p-3 text-left">Product</th>
<th className="p-3 text-left">Category</th>
<th className="p-3 text-left">Color</th>
<th className="p-3 text-center">Size</th>
<th className="p-3 text-center">Available</th>
<th className="p-3 text-center">Sold</th>
<th className="p-3 text-center">Status</th>

</tr>

</thead>

<tbody>

{filtered.map((item,i)=>(

<tr key={i} className="border-t hover:bg-gray-50">

<td className="p-3 font-medium">{item.product}</td>

<td className="p-3 capitalize">{item.category}</td>

<td className="p-3 capitalize">{item.color}</td>

<td className="p-3 text-center">{item.size}</td>

<td className="p-3 text-center font-semibold">
{item.available}
</td>

<td className="p-3 text-center">{item.sold}</td>

<td className="p-3 text-center">

{item.status==="Normal" && (
<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
Normal
</span>
)}

{item.status==="Low" && (
<span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
Low Stock
</span>
)}

{item.status==="Out of Stock" && (
<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
Out of Stock
</span>
)}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}