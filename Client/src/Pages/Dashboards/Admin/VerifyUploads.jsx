// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Menu } from "lucide-react";
// import axios from "axios";
// import Sidebar from "../../../components/Sidebar";

// const VerifyUploads = () => {
//   const [uploads, setUploads] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const token = localStorage.getItem("token");

//   const fetchUploads = async () => {
//     if (!token) {
//       toast.error("Missing token. Please log in again.");
//       return;
//     }

//     try {
//       const res = await axios.get(import.meta.env.VITE_API_URL_ADMIN_GET_UPLOADS, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUploads(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch error", err);
//       toast.error("Failed to load uploads");
//     }
//   };

//   const verifyUpload = async (uploadId) => {
//     try {
//       const res = await axios.put(
//         `${import.meta.env.VITE_API_URL_ADMIN_VERIFY_UPLOAD}/${uploadId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success(res.data.message);
//       fetchUploads();
//     } catch (err) {
//       console.error("Verification error", err);
//       toast.error(err?.response?.data?.message || "Verification failed");
//     }
//   };

//   const verifyAllUploads = async () => {
//     try {
//       const res = await axios.put(
//         import.meta.env.VITE_API_URL_ADMIN_VERIFY_ALL,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success(res.data.message || "All uploads verified");
//       fetchUploads();
//     } catch (err) {
//       console.error("Verify All error:", err);
//       toast.error(err?.response?.data?.message || "Bulk verification failed");
//     }
//   };

//   useEffect(() => {
//     fetchUploads();
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <div className="flex flex-col flex-1">
//         {/* Top Navbar for Mobile */}
//         <div className="p-4 bg-white shadow md:hidden flex items-center justify-between">
//           <h1 className="text-lg font-semibold text-indigo-600">Verify Campaigns</h1>
//           <button onClick={() => setSidebarOpen(true)}>
//             <Menu size={28} />
//           </button>
//         </div>

//         <main className="p-4 md:p-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//             <h1 className="text-2xl font-bold text-indigo-700">
//               📦 All Campaign Uploads (Admin)
//             </h1>
//             {uploads.length > 0 && (
//               <button
//                 onClick={verifyAllUploads}
//                 className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
//               >
//                 ✅ Verify All Uploads
//               </button>
//             )}
//           </div>

//           {uploads.length === 0 ? (
//             <p className="text-gray-500">No uploads available.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {uploads.map((upload) => {
//                 const distance = upload.distanceInMeters;
//                 const isWithin50m = distance !== undefined && distance <= 50;

//                 return (
//                   <div
//                     key={upload._id}
//                     className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between overflow-hidden break-words min-h-[520px]"
//                   >
//                     <div className="flex flex-col space-y-1">
//                       <h2 className="text-lg font-semibold text-indigo-600 truncate">
//                         📍 {upload.campaignName}
//                       </h2>
//                       <p className="truncate">
//                         <strong>Email:</strong> {upload.serviceManEmail}
//                       </p>
//                       <p className="truncate">
//                         <strong>Location:</strong> {upload.liveLocation} ({upload.city})
//                       </p>
//                       <p>
//                         <strong>Lat/Lon:</strong> {upload.latitude}, {upload.longitude}
//                       </p>

//                       {distance !== undefined && (
//                         <>
//                           <p><strong>Distance:</strong> {distance.toFixed(2)} meters</p>
//                           <p>
//                             <strong>Distance Status:</strong>{" "}
//                             <span className={isWithin50m ? "text-green-600" : "text-red-500"}>
//                               {isWithin50m ? "✅ Within 50 meters" : "❌ More than 50 meters"}
//                             </span>
//                           </p>
//                         </>
//                       )}

//                       <p>
//                         <strong>Status:</strong>{" "}
//                         <span className={upload.isVerified ? "text-green-600" : "text-red-500"}>
//                           {upload.isVerified ? "Verified ✅" : "Unverified ❌"}
//                         </span>
//                       </p>

//                       <img
//                         src={upload.imageUrl}
//                         alt="upload"
//                         className="mt-3 w-full h-48 object-cover rounded border max-w-full"
//                       />
//                     </div>

//                     {!upload.isVerified && (
//                       <button
//                         onClick={() => verifyUpload(upload._id)}
//                         className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded transition"
//                       >
//                         ✅ Verify Upload
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default VerifyUploads;
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Menu } from "lucide-react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const VerifyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const fetchUploads = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL_ADMIN_GET_UPLOADS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUploads(res.data.data || []);
    } catch (err) {
      console.error("Fetch error", err);
      toast.error("Failed to load uploads");
    }
  };

  const verifyUpload = async (uploadId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL_ADMIN_VERIFY_UPLOAD}/${uploadId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      fetchUploads();
    } catch (err) {
      console.error("Verification error", err);
      toast.error(err?.response?.data?.message || "Verification failed");
    }
  };

  const verifyAllUploads = async () => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL_ADMIN_VERIFY_ALL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "All uploads verified");
      fetchUploads();
    } catch (err) {
      console.error("Verify All error:", err);
      toast.error(err?.response?.data?.message || "Bulk verification failed");
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        {/* Top Navbar for Mobile */}
        <div className="p-4 bg-white shadow md:hidden flex items-center justify-between">
          <h1 className="text-lg font-semibold text-indigo-600">Verify Campaigns</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </div>

        <main className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-indigo-700">
              📦 All Campaign Uploads (Admin)
            </h1>
            {uploads.length > 0 && (
              <button
                onClick={verifyAllUploads}
                className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                ✅ Verify All Uploads
              </button>
            )}
          </div>

          {uploads.length === 0 ? (
            <p className="text-gray-500">No uploads available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <div
                  key={upload._id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between overflow-hidden break-words min-h-[540px]"
                >
                  <div className="flex flex-col space-y-1">
                    <h2 className="text-lg font-semibold text-indigo-600 truncate">
                      📍 {upload.campaignName}
                    </h2>
                    <p className="truncate">
                      <strong>ServiceMan Email:</strong> {upload.serviceManEmail}
                    </p>
                    <p className="truncate">
                      <strong>Location:</strong> {upload.liveLocation} ({upload.city})
                    </p>
                    <p>
                      <strong>Lat/Lon:</strong> {upload.latitude}, {upload.longitude}
                    </p>
                    <p>
                      <strong>Distance:</strong> {upload.distanceInMeters?.toFixed(2)} meters
                    </p>
                    <p>
                      <strong>Distance Status:</strong>{" "}
                      <span className={upload.distanceStatus.includes("✅") ? "text-green-600" : "text-red-500"}>
                        {upload.distanceStatus}
                      </span>
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={upload.isVerified ? "text-green-600" : "text-red-500"}>
                        {upload.isVerified ? "Verified ✅" : "Unverified ❌"}
                      </span>
                    </p>

                    {upload.imageUrl && (
                      <img
                        src={upload.imageUrl}
                        alt="upload"
                        className="mt-3 w-full h-48 object-cover rounded border max-w-full"
                      />
                    )}
                  </div>

                  {!upload.isVerified && (
                    <button
                      onClick={() => verifyUpload(upload._id)}
                      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded transition"
                    >
                      ✅ Verify Upload
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VerifyUploads;
