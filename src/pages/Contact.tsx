import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, User } from "lucide-react"; // Import necessary icons for context
// import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const { user, token } = useAuth();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [comments, setComments] = useState<{ name: string; message: string }[]>(
    []
  );

  useEffect(() => {
    // Fetch comments from backend on component mount
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/api/contact/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          // Filter comments for logged-in user only
          const userComments = data.contacts.filter(
            (c: Comment) => c.email === user?.email
          );
          setComments(userComments);
        }
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
    if (user) fetchComments();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!user) {
      setStatus({ type: "error", message: "Please log in to send a message." });
      return;
    }

    const form = e.currentTarget;
    const data = {
      name: user.name,
      email: user.email,
      subject: (form as any).subject.value,
      message: (form as any).message.value,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/api/contact/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: result.message });
        form.reset();

        // Wait 1 second and refetch comments
        setTimeout(async () => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BASE_API_URL}/api/contact/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = await res.json();
            if (res.ok) {
              const userComments = data.contacts.filter(
                (c: Comment) => c.email === user?.email
              );
              setComments(userComments);
            }
          } catch (err) {
            console.error("Failed to fetch comments", err);
          }
        }, 1000);
      } else {
        setStatus({
          type: "error",
          message: result.error || "Something went wrong",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error" });
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setStatus({ type: "", message: "" });

  //   if (!user) {
  //     setStatus({ type: "error", message: "Please log in to send a message." });
  //     return;
  //   }

  //   const form = e.currentTarget;
  //   const data = {
  //     name: user.name,
  //     email: user.email,
  //     subject: (form as any).subject.value,
  //     message: (form as any).message.value,
  //   };

  //   try {
  //     const res = await fetch(
  //       `${import.meta.env.VITE_BASE_API_URL}/api/contact/submit`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     const result = await res.json();

  //     if (res.ok) {
  //       setStatus({ type: "success", message: result.message });
  //       form.reset();
  //       // Add new comment locally for instant UI update
  //       setComments((prev) => [
  //         ...prev,
  //         { name: user.name, message: data.message },
  //       ]);
  //     } else {
  //       setStatus({
  //         type: "error",
  //         message: result.error || "Something went wrong",
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setStatus({ type: "error", message: "Server error" });
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Contact MKfrx
            </h1>
            <p className="text-lg text-muted-foreground">
              We’re here to assist you — anytime, anywhere.
            </p>
          </div>

          {/* Contact Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">
                    support@mkfrx.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">
                    +91 98765 43210
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-muted-foreground text-sm">
                    Available 24/7 inside the MKfrx dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office Location</h3>
                  <p className="text-muted-foreground text-sm">
                    Mumbai, Maharashtra – India
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Fill out the form and our team will get back to you shortly.
              </p>

              {status.message && (
                <p
                  className={`text-center mb-4 ${
                    status.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    disabled={!user}
                    value={user?.name || ""}
                    className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    disabled={!user}
                    value={user?.email || ""}
                    className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                  disabled={!user}
                  className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                  disabled={!user}
                  className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                ></textarea>

                <button
                  type="submit"
                  disabled={!user}
                  className="w-full md:w-auto px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </form>

              {!user && (
                <p className="text-center text-red-600 mt-4">
                  Please log in to send a message.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Message History Section */}
          <div className="space-y-3 pt-6">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              <Mail className="inline-block h-5 w-5 mr-2 text-primary" /> Your
              Messages
            </h2>

            {/* No Messages State */}
            {comments.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-muted-foreground">
                  No history found.
                </p>
              </div>
            )}

            {/* Messages List - COMPACT DESIGN */}
            <div className="space-y-3">
              {comments.map((comment, idx) => (
                <Card
                  key={idx}
                  className="bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer shadow-sm border border-gray-100"
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    {/* Compact Avatar/Initial (Smaller) */}
                    <div className="flex-shrink-0 w-8 h-8 bg-[hsl(45deg_81.89%_47.82%)] text-white font-semibold flex items-center justify-center rounded-full text-sm shadow-md">
                      {/* Fallback to 'U' if name is empty, otherwise use initial */}
                      {comment.name ? (
                        comment.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    {/* Message Content & Metadata */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        {/* Name - High Contrast */}
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {comment.name || "System User"}
                        </h3>
                        {/* Timestamp - Subtle & Small */}
                        <p className="flex items-center text-xs text-muted-foreground ml-4 flex-shrink-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Message Preview - Truncated and compact */}
                      <p className="text-sm text-gray-600 mt-0.5 truncate max-w-full">
                        {comment.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
