import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";

const CreateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [email, setEmail] = useState("");

    const categoriesData = ["Electronics", "Fashion", "Books", "Home Appliances"];

    useEffect(() => {
        if (!isEdit || !id) return;

        console.log("Fetching product ID:", id);

        axios.get(`http://localhost:8000/api/v2/product/${id}`)
            .then(({ data }) => {
                const p = data.product;
                if (!p) {
                    console.error("Product not found.");
                    return;
                }
                setName(p.name);
                setDescription(p.description);
                setCategory(p.category);
                setTags(Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "");
                setPrice(p.price);
                setStock(p.stock);
                setEmail(p.email);
                if (p.images?.length) {
                    setPreviewImages(p.images.map(imgPath => `http://localhost:8000${imgPath}`));
                }
            })
            .catch(err => console.error("Error fetching product:", err));
    }, [id]);

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...imagePreviews]);

        return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", JSON.stringify(tags.split(",").map(tag => tag.trim())));
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("email", email);

        images.forEach(image => formData.append("images", image));

        try {
            const endpoint = isEdit
                ? `http://localhost:8000/api/v2/product/update-product/${id}`
                : "http://localhost:8000/api/v2/product/create-product";

            const response = await axios({
                method: isEdit ? "PUT" : "POST",
                url: endpoint,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            if ([200, 201].includes(response.status)) {
                alert(`Product ${isEdit ? "updated" : "created"} successfully!`);
                navigate("/my-products");
            }
        } catch (err) {
            console.error("Error creating/updating product:", err.response?.data || err.message);
            alert("Failed to save product. Please check the data and try again.");
        }
    };

    return (
        <div className="w-[90%] max-w-[500px] bg-white shadow h-auto rounded-[4px] p-4 mx-auto">
            <h5 className="text-[24px] font-semibold text-center">
                {isEdit ? "Edit Product" : "Create Product"}
            </h5>
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label className="pb-1 block">Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        value={email}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label className="pb-1 block">Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={name}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter product name"
                        required
                    />
                </div>
                <div className="mt-4">
                    <label className="pb-1 block">Description <span className="text-red-500">*</span></label>
                    <textarea
                        value={description}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter product description"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mt-4">
                    <label className="pb-1 block">Category <span className="text-red-500">*</span></label>
                    <select
                        className="w-full p-2 border rounded"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Choose a category</option>
                        {categoriesData.map(title => (
                            <option value={title} key={title}>{title}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    <label className="pb-1 block">Upload Images <span className="text-red-500">*</span></label>
                    <input
                        type="file"
                        id="upload"
                        className="hidden"
                        multiple
                        onChange={handleImagesChange}
                        required={!isEdit}
                    />
                    <label htmlFor="upload" className="cursor-pointer">
                        <AiOutlinePlusCircle size={30} color="#555" />
                    </label>
                    <div className="flex flex-wrap mt-2">
                        {previewImages.map((img, index) => (
                            <img
                                src={img}
                                key={index}
                                alt="Preview"
                                className="w-[100px] h-[100px] object-cover m-2"
                            />
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-blue-500 text-white p-2 rounded">
                    {isEdit ? "Save Changes" : "Create"}
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
