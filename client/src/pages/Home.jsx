import { Link } from "react-router-dom";
import useProducts from "../context/useProducts";

function Home() {
  const { products, loading, error } = useProducts();

  const featuredProducts = products
    ?.filter((product) => product.featured)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#171717]">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f6f2]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            to="/"
            className="text-2xl font-bold tracking-[0.2em]"
          >
            AI EYEWEAR
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            <Link
              to="/products"
              className="text-sm hover:opacity-60"
            >
              Eyeglasses
            </Link>

            <Link
              to="/products?category=Sunglasses"
              className="text-sm hover:opacity-60"
            >
              Sunglasses
            </Link>

            <Link
              to="/products"
              className="text-sm hover:opacity-60"
            >
              New Arrivals
            </Link>

            <Link
              to="/products"
              className="text-sm hover:opacity-60"
            >
              Collections
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-lg hover:opacity-60">
              ♡
            </button>

            <Link
              to="/cart"
              className="text-lg hover:opacity-60"
            >
              🛒
            </Link>

            <Link
              to="/login"
              className="hidden text-sm md:block"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="relative min-h-[700px] overflow-hidden bg-[#dedbd3]">

        <div className="mx-auto grid min-h-[700px] max-w-7xl items-center px-6 py-16 md:grid-cols-2">

          {/* Hero text */}
          <div className="z-10 max-w-xl">

            <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em]">
              AI Powered Eyewear
            </p>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              SEE
              <br />
              YOURSELF
              <br />
              DIFFERENTLY.
            </h1>

            <p className="mt-8 max-w-md text-base leading-7 text-black/60">
              Discover eyewear designed around your face,
              your personality and your style.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                to="/products"
                className="bg-black px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-black/80"
              >
                Shop Collection
              </Link>

              <Link
                to="/products"
                className="border border-black px-8 py-4 text-sm font-medium uppercase tracking-wider transition hover:bg-black hover:text-white"
              >
                Explore Frames
              </Link>

            </div>
          </div>


          {/* Hero image */}
          <div className="relative mt-12 h-[500px] md:mt-0 md:h-[650px]">

            <div className="absolute inset-0 overflow-hidden rounded-[2rem]">

              <img
                src={
                  featuredProducts?.[0]?.images?.[0] ||
                  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80"
                }
                alt="AI Eyewear"
                className="h-full w-full object-cover"
              />

            </div>

          </div>

        </div>
      </section>


      {/* ================= CATEGORY ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Explore
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Find your frame.
          </h2>
        </div>


        <div className="grid gap-5 md:grid-cols-3">

          {/* Eyeglasses */}
          <Link
            to="/products?category=Eyeglasses"
            className="group relative h-[420px] overflow-hidden bg-[#ddd]"
          >
            <img
              src={
                featuredProducts?.[1]?.images?.[0] ||
                "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80"
              }
              alt="Eyeglasses"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs uppercase tracking-[0.3em]">
                Collection
              </p>

              <h3 className="mt-2 text-3xl font-medium">
                Eyeglasses
              </h3>

              <p className="mt-3 text-sm underline underline-offset-4">
                Shop now
              </p>
            </div>
          </Link>


          {/* Sunglasses */}
          <Link
            to="/products?category=Sunglasses"
            className="group relative h-[420px] overflow-hidden bg-[#ddd]"
          >
            <img
              src={
                featuredProducts?.[2]?.images?.[0] ||
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
              }
              alt="Sunglasses"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs uppercase tracking-[0.3em]">
                Collection
              </p>

              <h3 className="mt-2 text-3xl font-medium">
                Sunglasses
              </h3>

              <p className="mt-3 text-sm underline underline-offset-4">
                Shop now
              </p>
            </div>
          </Link>


          {/* AI */}
          <Link
            to="/products"
            className="group relative h-[420px] overflow-hidden bg-[#222]"
          >
            <div className="absolute inset-0 flex items-center justify-center p-10 text-center">

              <div className="text-white">

                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  AI Technology
                </p>

                <h3 className="mt-5 text-4xl font-medium">
                  Find the
                  <br />
                  perfect frame.
                </h3>

                <p className="mx-auto mt-6 max-w-xs text-sm leading-6 text-white/60">
                  Discover frames that complement your
                  face shape and personal style.
                </p>

                <span className="mt-8 inline-block border border-white/40 px-6 py-3 text-xs uppercase tracking-wider">
                  Discover
                </span>

              </div>

            </div>
          </Link>

        </div>
      </section>


      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-white py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 flex items-end justify-between">

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                Curated for you
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                Featured Frames
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden text-sm underline underline-offset-4 md:block"
            >
              View all
            </Link>

          </div>


          {loading && (
            <p className="py-20 text-center text-black/50">
              Loading frames...
            </p>
          )}

          {error && (
            <p className="py-20 text-center text-red-500">
              {error}
            </p>
          )}


          {!loading && !error && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">

              {featuredProducts?.map((product) => (

                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="group"
                >

                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f3f1]">

                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                    />

                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute right-4 top-4 text-xl"
                    >
                      ♡
                    </button>

                  </div>


                  <div className="mt-5">

                    <p className="text-xs uppercase tracking-wider text-black/40">
                      {product.brand}
                    </p>

                    <h3 className="mt-2 text-sm font-medium">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-3">

                      <span className="text-sm">
                        ₹{product.price}
                      </span>

                      {product.discountPrice > 0 && (
                        <span className="text-sm text-black/40 line-through">
                          ₹{product.discountPrice}
                        </span>
                      )}

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}

        </div>
      </section>


      {/* ================= AI SECTION ================= */}
      <section className="bg-[#171717] py-28 text-white">

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              Powered by AI
            </p>

            <h2 className="mt-6 text-5xl font-semibold leading-tight md:text-6xl">
              Your face.
              <br />
              Your frame.
              <br />
              Your style.
            </h2>

            <p className="mt-8 max-w-lg leading-7 text-white/50">
              Not sure which frame suits you?
              Our AI-powered experience helps you discover
              eyewear based on your face shape and personal style.
            </p>

            <Link
              to="/products"
              className="mt-10 inline-block border border-white/40 px-8 py-4 text-sm uppercase tracking-wider transition hover:bg-white hover:text-black"
            >
              Try AI Experience
            </Link>

          </div>


          <div className="flex justify-center">

            <div className="flex h-[450px] w-full max-w-md items-center justify-center bg-[#242424]">

              <div className="text-center">

                <div className="text-7xl">
                  👓
                </div>

                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-white/40">
                  Virtual Try-On
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= WHY US ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-12 md:grid-cols-4">

          <div>
            <div className="mb-5 text-2xl">✦</div>
            <h3 className="font-medium">AI Recommendations</h3>
            <p className="mt-3 text-sm leading-6 text-black/50">
              Find frames based on your face shape and style.
            </p>
          </div>

          <div>
            <div className="mb-5 text-2xl">◇</div>
            <h3 className="font-medium">Premium Frames</h3>
            <p className="mt-3 text-sm leading-6 text-black/50">
              Carefully selected designs for everyday wear.
            </p>
          </div>

          <div>
            <div className="mb-5 text-2xl">♡</div>
            <h3 className="font-medium">Easy Shopping</h3>
            <p className="mt-3 text-sm leading-6 text-black/50">
              Discover, compare and order your perfect pair.
            </p>
          </div>

          <div>
            <div className="mb-5 text-2xl">↻</div>
            <h3 className="font-medium">Easy Returns</h3>
            <p className="mt-3 text-sm leading-6 text-black/50">
              Shop confidently with a simple return experience.
            </p>
          </div>

        </div>

      </section>


      {/* ================= NEWSLETTER ================= */}
      <section className="border-t border-black/10 bg-[#e7e4dc] py-24">

        <div className="mx-auto max-w-2xl px-6 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-black/40">
            Stay in the frame
          </p>

          <h2 className="mt-5 text-4xl font-semibold">
            Join the AI Eyewear Club.
          </h2>

          <p className="mt-5 text-sm leading-6 text-black/50">
            Get new collection launches, exclusive offers
            and eyewear inspiration.
          </p>

          <div className="mx-auto mt-10 flex max-w-md border-b border-black">

            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-2 py-4 text-sm outline-none placeholder:text-black/40"
            />

            <button className="px-4 text-sm font-medium uppercase tracking-wider">
              Join
            </button>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-[#171717] px-6 py-16 text-white">

        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">

          <div className="md:col-span-2">

            <h2 className="text-2xl font-bold tracking-[0.2em]">
              AI EYEWEAR
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/40">
              Eyewear designed around you.
              Discover your next favourite frame.
            </p>

          </div>

          <div>
            <h3 className="text-sm font-medium">
              Shop
            </h3>

            <div className="mt-5 space-y-3 text-sm text-white/50">
              <Link to="/products" className="block hover:text-white">
                Eyeglasses
              </Link>

              <Link to="/products" className="block hover:text-white">
                Sunglasses
              </Link>

              <Link to="/products" className="block hover:text-white">
                New Arrivals
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">
              Company
            </h3>

            <div className="mt-5 space-y-3 text-sm text-white/50">
              <p>About</p>
              <p>Contact</p>
              <p>Privacy</p>
              <p>Terms</p>
            </div>
          </div>

        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/30">
          © 2026 AI Eyewear. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;