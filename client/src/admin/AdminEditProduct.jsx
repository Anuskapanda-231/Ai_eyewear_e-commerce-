import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AdminEditProduct() {
  const { id } = useParams();
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
  const [currentImage, setCurrentImage] = useState("");
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Load existing product
  // ==========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load product"
          );
        }

        const product = data.product;

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          category: product.category || "",
          description: product.description || "",
          price: product.price || "",
          discountPrice:
            product.discountPrice ?? "",
          stock: product.stock ?? "",
          frameShape: product.frameShape || "",
          frameType: product.frameType || "",
          lensType: product.lensType || "",
          color: product.color || "",
          gender: product.gender || "Unisex",
        });

        setCurrentImage(
          product.images?.[0] || ""
        );

      } catch (error) {
        console.error("Fetch product error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // ==========================================
  // Handle inputs
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Handle new image
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================================
  // Update product
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      let imageUrl = "";

      // ======================================
      // Upload new image only if selected
      // ======================================

      if (image) {
        const imageData = new FormData();

        imageData.append("images", image);

        const uploadResponse = await fetch(
          "http://localhost:5000/api/upload",
          {
            method: "POST",
            body: imageData,
          }
        );

        const uploadData =
          await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadData.success
        ) {
          throw new Error(
            uploadData.message ||
              "Image upload failed"
          );
        }

        imageUrl = uploadData.imageUrl;

        console.log(
          "New Cloudinary URL:",
          imageUrl
        );
      }

      // ======================================
      // Update product
      // ======================================

      const response = await fetch(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,

            price: Number(formData.price),

            discountPrice:
              formData.discountPrice === ""
                ? ""
                : Number(formData.discountPrice),

            stock: Number(formData.stock),

            imageUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update product"
        );
      }

      console.log(
        "Product updated:",
        data.product
      );

      setSuccess(
        "Product updated successfully!"
      );

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);

    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">

      {/* Header */}

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-semibold">
          Edit Product
        </h1>

        <p className="mt-2 text-gray-500">
          Update your eyewear product
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div className="mb-6 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

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
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

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
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

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
                className="mt-2 w-full border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

          </div>

        </section>

        {/* Product Image */}

        <section className="bg-white p-8">

          <h2 className="text-xl font-semibold">
            Product Image
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Select a new image only if you want to
            replace the current image.
          </p>

          {/* Current Image */}

          {currentImage && !preview && (
            <div className="mt-6">

              <p className="mb-3 text-sm font-medium">
                Current Image
              </p>

              <img
                src={currentImage}
                alt={formData.name}
                className="h-48 w-48 object-cover"
              />

            </div>
          )}

          {/* File Input */}

          <div className="mt-6">

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm"
            />

          </div>

          {/* New Preview */}

          {preview && (
            <div className="mt-6">

              <p className="mb-3 text-sm font-medium">
                New Image Preview
              </p>

              <img
                src={preview}
                alt="New product preview"
                className="h-48 w-48 object-cover"
              />

            </div>
          )}

        </section>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="border border-black px-6 py-3 text-sm uppercase tracking-wider hover:bg-black hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-black px-8 py-3 text-sm uppercase tracking-wider text-white disabled:bg-gray-400"
          >
            {saving
              ? "Updating Product..."
              : "Update Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminEditProduct;