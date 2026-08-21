import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminAddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    frameShape: "",
    frameType: "",
    lensType: "",
    color: "",
    gender: "Unisex",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // --------------------------------
      // STEP 1: Upload image to Cloudinary
      // --------------------------------

      if (!image) {
        throw new Error("Please select a product image");
      }

      const imageData = new FormData();

      imageData.append("images", image);

      const uploadResponse = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(
          uploadData.message || "Image upload failed"
        );
      }

      const imageUrl = uploadData.imageUrl;

      console.log("Cloudinary URL:", imageUrl);

      // --------------------------------
      // STEP 2: Create product
      // --------------------------------

      const productResponse = await fetch(
        "http://localhost:5000/api/admin/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,
            price: Number(formData.price),
            discountPrice:
              formData.discountPrice === ""
                ? undefined
                : Number(formData.discountPrice),
            stock: Number(formData.stock),
            imageUrl,
          }),
        }
      );

      const productData = await productResponse.json();

      if (!productResponse.ok || !productData.success) {
        throw new Error(
          productData.message || "Product creation failed"
        );
      }

      console.log(
        "Product created:",
        productData.product
      );

      setSuccess("Product added successfully!");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);

    } catch (error) {
      console.error("Add product error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">

      {/* Header */}

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-semibold">
          Add Product
        </h1>

        <p className="mt-2 text-gray-500">
          Add a new eyewear product to your store
        </p>
      </div>

      {/* Messages */}

      {error && (
        <div className="mb-6 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Basic Information */}

        <section className="bg-white p-8">

          <h2 className="text-xl font-semibold">
            Basic Information
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* Name */}

            <div>
              <label className="text-sm font-medium">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Minimal Black"
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Brand */}

            <div>
              <label className="text-sm font-medium">
                Brand *
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="e.g. Fastrack"
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Category */}

            <div>
              <label className="text-sm font-medium">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-2 w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">
                  Select Category
                </option>

                <option value="Eyeglasses">
                  Eyeglasses
                </option>

                <option value="Sunglasses">
                  Sunglasses
                </option>

                <option value="Computer Glasses">
                  Computer Glasses
                </option>
              </select>
            </div>

            {/* Gender */}

            <div>
              <label className="text-sm font-medium">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="Unisex">
                  Unisex
                </option>

                <option value="Men">
                  Men
                </option>

                <option value="Women">
                  Women
                </option>
              </select>
            </div>

          </div>

          {/* Description */}

          <div className="mt-6">

            <label className="text-sm font-medium">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe the product..."
              className="mt-2 w-full resize-none border border-gray-200 px-4 py-3 outline-none focus:border-black"
            />

          </div>

        </section>

        {/* Pricing */}

        <section className="bg-white p-8">

          <h2 className="text-xl font-semibold">
            Pricing & Stock
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <div>
              <label className="text-sm font-medium">
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="1999"
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
                placeholder="1499"
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="50"
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

          </div>

        </section>

        {/* Eyewear Details */}

        <section className="bg-white p-8">

          <h2 className="text-xl font-semibold">
            Eyewear Details
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <label className="text-sm font-medium">
                Frame Shape
              </label>

              <select
                name="frameShape"
                value={formData.frameShape}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">
                  Select Frame Shape
                </option>

                <option value="Round">
                  Round
                </option>

                <option value="Square">
                  Square
                </option>

                <option value="Rectangle">
                  Rectangle
                </option>

                <option value="Oval">
                  Oval
                </option>

                <option value="Cat Eye">
                  Cat Eye
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Frame Type
              </label>

              <select
                name="frameType"
                value={formData.frameType}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">
                  Select Frame Type
                </option>

                <option value="Full Rim">
                  Full Rim
                </option>

                <option value="Half Rim">
                  Half Rim
                </option>

                <option value="Rimless">
                  Rimless
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Lens Type
              </label>

              <select
                name="lensType"
                value={formData.lensType}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">
                  Select Lens Type
                </option>

                <option value="Clear">
                  Clear
                </option>

                <option value="Blue Light">
                  Blue Light
                </option>

                <option value="UV Protection">
                  UV Protection
                </option>

                <option value="Polarized">
                  Polarized
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Color
              </label>

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Black"
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

          </div>

        </section>

        {/* Image */}

        <section className="bg-white p-8">

          <h2 className="text-xl font-semibold">
            Product Image
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Upload an image. It will automatically be stored on Cloudinary.
          </p>

          <div className="mt-6">

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="block w-full text-sm"
            />

          </div>

          {/* Preview */}

          {preview && (
            <div className="mt-6">

              <p className="mb-3 text-sm font-medium">
                Preview
              </p>

              <img
                src={preview}
                alt="Product preview"
                className="h-48 w-48 object-cover"
              />

            </div>
          )}

        </section>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border border-black px-6 py-3 text-sm uppercase tracking-wider hover:bg-black hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-black px-8 py-3 text-sm uppercase tracking-wider text-white disabled:bg-gray-400"
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminAddProduct;