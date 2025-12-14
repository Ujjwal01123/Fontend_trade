import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FilePlus } from "lucide-react";

const AddBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = {
      title,
      thumbnail,
      category,
      content,
      createdAt: new Date(),
    };

    console.log("Blog Submitted:", blogData);

    // TODO: Connect with backend API
    // await axios.post("/api/blog", blogData)

    alert("Blog Added Successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary text-transparent bg-clip-text mb-3">
            Add New Blog
          </h1>
          <p className="text-muted-foreground text-lg">
            Publish new content to your MKfrx ecosystem
          </p>
        </div>

        {/* Blog Form */}
        <Card className="max-w-3xl mx-auto shadow-lg border-accent/40">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <FilePlus className="h-6 w-6 text-accent" />
            <CardTitle className="text-2xl font-semibold">
              Blog Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Blog Title */}
              <div>
                <label className="text-sm font-medium">Blog Title</label>
                <Input
                  placeholder="Enter blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="text-sm font-medium">Thumbnail URL</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  placeholder="e.g. Trading, Crypto, Market News"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              {/* Blog Content */}
              <div>
                <label className="text-sm font-medium">Blog Content</label>
                <Textarea
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-2 min-h-[200px]"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-accent to-primary text-white"
              >
                Publish Blog
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddBlog;
