import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = `${apiUrl}/api/blogs`;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // setBlogs(data.blogs || []);
        setBlogs((data.blogs || []).filter((b) => b.status === "active"));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getExcerpt = (htmlContent) => {
    const text = htmlContent.replace(/<[^>]+>/g, "");
    return text.length > 80 ? text.substring(0, 80) + "..." : text; // Reduced char count
  };

  const getReadTime = (content) => {
    const text = content.replace(/<[^>]+>/g, "");
    const words = text.split(" ").length;
    return Math.ceil(words / 200) + " min";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MKfrx Insights
          </h1>
          <p className="text-base text-muted-foreground">
            Latest updates, tutorials, and tech deep dives.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-[300px] bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* No Blogs State */}
        {!loading && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              No blogs found
            </h3>
          </div>
        )}

        {/* Blog Grid - Updated for smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogs.map((post) => (
            <Card
              key={post._id}
              className="group flex flex-col h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer rounded-xl"
              onClick={() => navigate(`/blog/view/${post.slug}`)}
            >
              {/* Image Container - Reduced Height */}
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={
                    post.image?.startsWith("http")
                      ? post.image
                      : `${apiUrl}${post.image}`
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Smaller Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-primary shadow-sm">
                  {post.category || "Blogs"}
                </div>
              </div>

              {/* Content - Reduced Padding & Font Size */}
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{getReadTime(post.content || "")}</span>
                </div>
                <h2 className="text-base font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </CardHeader>

              <CardContent className="px-4 pb-4 flex-grow">
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                  {getExcerpt(post.content || "")}
                </p>
              </CardContent>

              {/* Footer - Compact */}
              <CardFooter className="px-4 pb-4 pt-0 mt-auto border-t border-gray-50">
                <div className="flex items-center justify-between w-full pt-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-[10px] font-bold border border-gray-200">
                      {post.authorType === "admin" ? "A" : "U"}
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {post.authorType === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blogs;
