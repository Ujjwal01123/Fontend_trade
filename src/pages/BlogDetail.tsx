import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams(); // <-- GET SLUG INSTEAD OF ID
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_API_URL;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/blogs/slug/${slug}`); // <-- FETCH BY SLUG
        const data = await res.json();
        setPost(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]); // <-- DEPEND ON SLUG

  const getReadTime = (content) => {
    const text = content.replace(/<[^>]+>/g, "");
    const words = text.split(" ").length;
    return Math.ceil(words / 200) + " min read";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
          <div className="w-24 h-6 bg-gray-200 rounded mb-8 animate-pulse" />
          <div className="w-3/4 h-12 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl mb-8 animate-pulse" />
          <div className="space-y-4">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Blog Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </button>

        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-gray-100 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {post.authorType === "admin" ? "A" : "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {post.authorType === "admin"
                    ? "Admin Team"
                    : "Community Member"}
                </span>
                <span className="text-xs text-muted-foreground">Author</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {getReadTime(post.content)}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg mb-12">
          <img
            src={
              post.image?.startsWith("http")
                ? post.image
                : `${apiUrl}${post.image}`
            }
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <article
          className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
          prose-p:leading-relaxed prose-p:text-gray-700
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </article>

        <hr className="my-12 border-gray-100" />

        <div className="text-center">
          <p className="text-muted-foreground italic">Thanks for reading!</p>
        </div>
      </main>
    </div>
  );
};

export default BlogDetail;
