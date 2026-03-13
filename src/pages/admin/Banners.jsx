import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Banners = () => {

    const { axios } = useAppContext();

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(500);

    const [banners, setBanners] = useState([]);
    const [position, setPosition] = useState("top");
    const loadBanners = async () => {

        const res = await axios.get("/api/banner");

        setBanners(res.data.banners);

    };

    useEffect(() => {
        loadBanners();
    }, []);

    const handleImage = (e) => {

        const file = e.target.files[0];

        setImage(file);

        setPreview(URL.createObjectURL(file));

    };

    const addBanner = async () => {

        if (!image) return alert("Please select banner image");

        const formData = new FormData();

        formData.append("image", image);
        formData.append("width", width);
        formData.append("height", height);
        formData.append("position", position);
        await axios.post("/api/admin/banner", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        setImage(null);
        setPreview(null);

        loadBanners();

    };

    return (

        <div className="p-8">

            <h1 className="text-2xl font-bold mb-6">
                Homepage Banners
            </h1>

            {/* Upload Section */}

            <div className="bg-white shadow rounded p-6 mb-10">

                <div className="grid grid-cols-4 gap-6 items-center">

                    {/* Image Upload */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Upload Banner
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="border p-2 rounded w-full"
                        />
                        <div>

                            <label className="block text-sm font-medium mb-2">
                                Banner Position
                            </label>

                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="border p-2 rounded w-full"
                            >

                                <option value="top">Top Banner</option>
                                <option value="middle">Middle Banner</option>
                                <option value="bottom">Bottom Banner</option>
                            </select>

                        </div>
                    </div>

                    {/* Width */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Width (px)
                        </label>

                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                    </div>

                    {/* Height */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Height (px)
                        </label>

                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                    </div>

                    {/* Upload Button */}

                    <div className="flex items-end">

                        <button
                            onClick={addBanner}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
                        >
                            Upload Banner
                        </button>

                    </div>

                </div>

                {/* Preview */}

                {preview && (

                    <div className="mt-6">

                        <p className="text-sm text-gray-500 mb-2">
                            Preview
                        </p>

                        <img
                            src={preview}
                            style={{
                                width: `${width}px`,
                                height: `${height}px`,
                                objectFit: "cover"
                            }}
                            className="border rounded"
                        />

                    </div>

                )}

            </div>

            {/* Banner List */}

            <div className="grid grid-cols-3 gap-6">

                {banners.map((b) => (

                    <div
                        key={b._id}
                        className="bg-white shadow rounded overflow-hidden"
                    >

                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${b.image}`}
                            style={{
                                width: "100%",
                                height: b.height || 200,
                                objectFit: "cover"
                            }}
                        />

                        <div className="p-3 flex justify-between items-center">

                            <span className="text-xs text-gray-500">
                                {b.width}px × {b.height}px
                            </span>

                            <button
                                onClick={() =>
                                    axios
                                        .delete(`/api/admin/banner/${b._id}`)
                                        .then(loadBanners)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default Banners;