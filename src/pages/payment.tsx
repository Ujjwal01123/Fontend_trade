import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2,
  CreditCard,
  Upload,
  QrCode,
  Save,
  Loader2,
} from "lucide-react";

export default function PaymentDetailsPage() {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // <-- ADDED
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { token } = useAuth();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BASE_API_URL;

  // Fetch Saved Payment Details
  const fetchPaymentDetails = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/payments/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success && data.payment) {
        setBankName(data.payment.bankName || "");
        setAccountNumber(data.payment.accountNumber || "");
        setIfsc(data.payment.ifsc || "");
        setUpiId(data.payment.upiId || "");
        setPhoneNumber(data.payment.phoneNumber || ""); // <-- ADDED

        setQrImage(
          data.payment.upiQrCode ? `${API}${data.payment.upiQrCode}` : null
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast({
        title: "Error",
        description: "Failed to load payment details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [token]);

  // Handle QR Upload
  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setQrImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Save to Backend
  const handleSubmit = async () => {
    if (!token) return;

    if (!bankName || !accountNumber || !ifsc || !upiId || !phoneNumber) {
      // <-- UPDATED
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bankName", bankName);
      formData.append("accountNumber", accountNumber);
      formData.append("ifsc", ifsc);
      formData.append("upiId", upiId);
      formData.append("phoneNumber", phoneNumber); // <-- ADDED

      const fileInput = document.getElementById(
        "qr-upload"
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("upiQrCode", fileInput.files[0]);
      }

      const res = await fetch(`${API}/api/payments/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Payment details saved successfully!",
        });
        fetchPaymentDetails();
        navigate("/markets");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save details",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-[#0d1b2a]">
      <Navbar />

      <main className="container max-w-5xl mx-auto pt-24 pb-12 px-4 md:px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your bank details and UPI information for receiving
              payments.
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#0d1b2a] text-white hover:bg-[#1b2d45] min-w-[140px]"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Bank Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>
                    Enter your primary bank account information.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Phone Number Field (ADDED) */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+12025550123"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="pl-9 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="HDFC0001234"
                  className="uppercase bg-white"
                  maxLength={11}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Column: UPI Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>UPI & QR Code</CardTitle>
                  <CardDescription>
                    Setup your UPI ID and scan code.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID (VPA)</Label>
                <Input
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="bg-white"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>QR Code Image</Label>

                <div className="flex flex-col items-center gap-4">
                  <label
                    htmlFor="qr-upload"
                    className={`
                      w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
                      ${
                        qrImage
                          ? "border-[#0d1b2a] bg-gray-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }
                    `}
                  >
                    {qrImage ? (
                      <img
                        src={qrImage}
                        alt="QR Code Preview"
                        className="h-full w-full object-contain p-2 rounded-xl"
                      />
                    ) : (
                      <div className="text-center text-gray-500 p-4">
                        <Upload className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm font-medium">
                          Click to upload QR Code
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    )}
                    <input
                      id="qr-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleQRUpload}
                      className="hidden"
                    />
                  </label>

                  {qrImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQrImage(null)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator"; // Assuming you have this, if not, standard <hr> works
// import Navbar from "@/components/Navbar";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   Building2,
//   CreditCard,
//   Upload,
//   QrCode,
//   Save,
//   Loader2,
// } from "lucide-react";

// export default function PaymentDetailsPage() {
//   const [bankName, setBankName] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [ifsc, setIfsc] = useState("");
//   const [upiId, setUpiId] = useState("");
//   const [qrImage, setQrImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false); // Added loading state

//   const { toast } = useToast();
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const API = import.meta.env.VITE_BASE_API_URL;

//   // Fetch Saved Payment Details
//   const fetchPaymentDetails = async () => {
//     if (!token) return;
//     try {
//       const res = await fetch(`${API}/api/payments/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 401) {
//         toast({
//           title: "Unauthorized",
//           description: "Please login again.",
//           variant: "destructive",
//         });
//         return;
//       }

//       const data = await res.json();
//       if (data.success && data.payment) {
//         setBankName(data.payment.bankName || "");
//         setAccountNumber(data.payment.accountNumber || "");
//         setIfsc(data.payment.ifsc || "");
//         setUpiId(data.payment.upiId || "");

//         // Prepend API URL to qrImage if it exists
//         setQrImage(
//           data.payment.upiQrCode ? `${API}${data.payment.upiQrCode}` : null
//         );
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       toast({
//         title: "Error",
//         description: "Failed to load payment details",
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchPaymentDetails();
//   }, [token]);

//   // Handle QR Upload
//   const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setQrImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Save to Backend
//   const handleSubmit = async () => {
//     if (!token) return;

//     if (!bankName || !accountNumber || !ifsc || !upiId) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       // Use FormData for file upload
//       const formData = new FormData();
//       formData.append("bankName", bankName);
//       formData.append("accountNumber", accountNumber);
//       formData.append("ifsc", ifsc);
//       formData.append("upiId", upiId);

//       // Append file if exists
//       const fileInput = document.getElementById(
//         "qr-upload"
//       ) as HTMLInputElement;
//       if (fileInput?.files?.[0]) {
//         formData.append("upiQrCode", fileInput.files[0]);
//       }

//       const res = await fetch(`${API}/api/payments/save`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // No Content-Type needed for FormData
//         },
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         toast({
//           title: "Success",
//           description: "Payment details saved successfully!",
//         });
//         fetchPaymentDetails();
//         // ✅ Redirect to /markets after successful save
//         navigate("/markets");
//       } else {
//         toast({
//           title: "Error",
//           description: data.error || "Failed to save details",
//           variant: "destructive",
//         });
//       }
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Something went wrong!",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 text-[#0d1b2a]">
//       <Navbar />

//       <main className="container max-w-5xl mx-auto pt-24 pb-12 px-4 md:px-6">
//         {/* Page Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Payment Settings
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               Manage your bank details and UPI information for receiving
//               payments.
//             </p>
//           </div>
//           <Button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bg-[#0d1b2a] text-white hover:bg-[#1b2d45] min-w-[140px]"
//           >
//             {loading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Save className="mr-2 h-4 w-4" />
//             )}
//             Save Changes
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Left Column: Bank Information */}
//           <Card className="shadow-sm border-gray-200">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
//                   <Building2 className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <CardTitle>Bank Details</CardTitle>
//                   <CardDescription>
//                     Enter your primary bank account information.
//                   </CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="bankName">Bank Name</Label>
//                 <Input
//                   id="bankName"
//                   value={bankName}
//                   onChange={(e) => setBankName(e.target.value)}
//                   placeholder="e.g. HDFC Bank"
//                   className="bg-white"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="accountNumber">Account Number</Label>
//                 <div className="relative">
//                   <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="accountNumber"
//                     value={accountNumber}
//                     onChange={(e) => setAccountNumber(e.target.value)}
//                     placeholder="0000 0000 0000 0000"
//                     className="pl-9 bg-white"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="ifsc">IFSC Code</Label>
//                 <Input
//                   id="ifsc"
//                   value={ifsc}
//                   onChange={(e) => setIfsc(e.target.value.toUpperCase())}
//                   placeholder="HDFC0001234"
//                   className="uppercase bg-white"
//                   maxLength={11}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Right Column: UPI Information */}
//           <Card className="shadow-sm border-gray-200">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-green-50 rounded-lg text-green-600">
//                   <QrCode className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <CardTitle>UPI & QR Code</CardTitle>
//                   <CardDescription>
//                     Setup your UPI ID and scan code.
//                   </CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="upiId">UPI ID (VPA)</Label>
//                 <Input
//                   id="upiId"
//                   value={upiId}
//                   onChange={(e) => setUpiId(e.target.value)}
//                   placeholder="username@bank"
//                   className="bg-white"
//                 />
//               </div>

//               <Separator />

//               <div className="space-y-3">
//                 <Label>QR Code Image</Label>

//                 <div className="flex flex-col items-center gap-4">
//                   {/* Custom Upload Area */}
//                   <label
//                     htmlFor="qr-upload"
//                     className={`
//                       w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
//                       ${
//                         qrImage
//                           ? "border-[#0d1b2a] bg-gray-50"
//                           : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//                       }
//                     `}
//                   >
//                     {qrImage ? (
//                       <img
//                         src={qrImage}
//                         alt="QR Code Preview"
//                         className="h-full w-full object-contain p-2 rounded-xl"
//                       />
//                     ) : (
//                       <div className="text-center text-gray-500 p-4">
//                         <Upload className="mx-auto h-8 w-8 mb-2 opacity-50" />
//                         <p className="text-sm font-medium">
//                           Click to upload QR Code
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           PNG, JPG up to 2MB
//                         </p>
//                       </div>
//                     )}
//                     <input
//                       id="qr-upload"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleQRUpload}
//                       className="hidden"
//                     />
//                   </label>

//                   {qrImage && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setQrImage(null)}
//                       className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                     >
//                       Remove Image
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }
