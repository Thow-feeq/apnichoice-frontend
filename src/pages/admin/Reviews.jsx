import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Reviews = () => {

    const { axios } = useAppContext();

    const [reviews, setReviews] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        review: "",
        rating: 5,
    });
    const [image, setImage] = useState(null);
    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {

            const { data } = await axios.get("/api/reviews");

            if (data.success) {
                setReviews(data.reviews);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    const addReview = async (e) => {
        e.preventDefault();

        try {

            const data = new FormData();

            data.append("name", formData.name);
            data.append("review", formData.review);
            data.append("rating", formData.rating);

            if (image) {
                data.append("image", image);
            }

            const res = await axios.post("/api/reviews", data);

            if (res.data.success) {

                toast.success("Review Added");

                setFormData({
                    name: "",
                    review: "",
                    rating: 5
                });

                setImage(null);

                fetchReviews();
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteReview = async (id) => {

        try {

            const { data } = await axios.delete(`/api/reviews/${id}`);

            if (data.success) {
                toast.success("Review Deleted");
                fetchReviews();
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (

        <div className="p-6">

            <h1 className="text-2xl font-semibold mb-6">
                Customer Reviews
            </h1>

            {/* ADD REVIEW FORM */}

            <form
                onSubmit={addReview}
                className="bg-white p-6 rounded-lg shadow grid md:grid-cols-2 gap-4 mb-8"
            >

                <input
                    type="text"
                    placeholder="Customer Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border p-2 rounded"
                />

                <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="border p-2 rounded"
                />

                <textarea
                    placeholder="Customer Review"
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    className="border p-2 rounded md:col-span-2"
                    required
                />

                <button
                    className="bg-blue-600 text-white py-2 rounded md:col-span-2"
                >
                    Add Review
                </button>

            </form>


            {/* REVIEW LIST */}

            <div className="grid md:grid-cols-3 gap-6">

                {reviews.map((review) => (

                    <div
                        key={review._id}
                        className="bg-white p-4 rounded-lg shadow"
                    >

                        <div className="flex items-center gap-3 mb-3">

                            <img
                                src={review.image}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />

                            <div>

                                <h3 className="font-semibold">
                                    {review.name}
                                </h3>

                                <div className="text-yellow-400">
                                    {"★".repeat(review.rating)}
                                </div>

                            </div>

                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            {review.review}
                        </p>

                        <button
                            onClick={() => deleteReview(review._id)}
                            className="text-red-500 text-sm"
                        >
                            Delete
                        </button>

                    </div>

                ))}

            </div>

        </div>

    );
};

export default Reviews;