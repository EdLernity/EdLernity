import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Sparkles, Briefcase, ArrowLeft } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { BACKEND_URL } from "../../URL_Config";
import { showSnackbar } from "../Utils/enQueSnackBar";
import {
  clearInternshipCart,
  fetchMyInternshipsFromBackend,
  isUserLoggedIn,
  loadInternshipCart,
  saveInternshipCart,
} from "./internshipCartUtils";

function InternshipCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login", {
        replace: true,
        state: { redirectUrl: "/cart" },
      });
      return;
    }

    const fromState = location.state?.cart;
    if (fromState) {
      saveInternshipCart(fromState);
      setCart(fromState);
      return;
    }

    const stored = loadInternshipCart();
    if (!stored) {
      showSnackbar("No internship selected. Choose a track to continue.", "info", "top");
      navigate("/internship-programs", { replace: true });
      return;
    }
    setCart(stored);
  }, [location.state, navigate]);

  const savings = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.listPrice || 0), 0) - cart.total;
  }, [cart]);

  const initPayment = (order, user) => {
    const options = {
      key: "rzp_live_VAGF8Cc0ors5Zj",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      description: `EdLernity Internship - ${cart.title}`,
      image: "https://dd4maq26g014m.cloudfront.net/Logo.svg",
      prefill: {
        name: user.firstName,
        email: user.email,
        contact: user.phone,
      },
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            BACKEND_URL + "/api/v1/enroll/verify",
            {
              courseId: cart.courseId,
              response,
              internshipSlug: cart.slug,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("_userAuth"),
              },
            }
          );
          if (data.message === "Payment verified successfully") {
            await fetchMyInternshipsFromBackend();
            clearInternshipCart();
            showSnackbar("Enrollment successful!", "success", "top");
            navigate(`/my-internships/${cart.slug}`, { replace: true });
          }
        } catch (error) {
          showSnackbar("Payment verification failed. Contact support.", "error", "top");
        } finally {
          setPaying(false);
        }
      },
      modal: {
        ondismiss: () => setPaying(false),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayNow = async () => {
    if (!cart || paying) return;
    if (!isUserLoggedIn()) {
      navigate("/auth/login", { state: { redirectUrl: "/cart", cart } });
      return;
    }

    setPaying(true);
    try {
      const token = localStorage.getItem("_userAuth");
      const response = await axios.post(
        BACKEND_URL + "/api/v1/enroll/add",
        {
          courseId: cart.courseId,
          internshipSlug: cart.slug,
          enrollingInternship: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data === "enrolled") {
        showSnackbar("You are already enrolled in this internship.", "info", "top");
        setPaying(false);
        return;
      }

      initPayment(response.data.data, response.data.userData);
    } catch (error) {
      setPaying(false);
      const errorMessage =
        error.response?.data?.message || "Unable to start payment. Try again.";
      showSnackbar(errorMessage, "error", "top");
      if (errorMessage === "Session Expired") {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/auth/login", { state: { redirectUrl: "/cart", cart } });
      }
    }
  };

  if (!cart) {
    return (
      <BaseLayout>
        <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-medium">
          Loading cart...
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <SeoHead
        title="Internship Cart - EdLernity"
        description="Review your internship plan, included GenAI workshop, and Reznio access before payment."
        path="/cart"
      />

      <section className="py-10 lg:py-16 bg-slate-50 min-h-[70vh] font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(`/internship-programs/${cart.slug}`)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#181FC5] text-sm font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {cart.title}
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Your Cart</h1>
          <p className="text-slate-600 font-medium mb-8">
            Review your selected internship plan and included bonuses before you pay.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 items-start"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === "internship"
                        ? "bg-[#181FC5]/10 text-[#181FC5]"
                        : item.id === "genai-workshop"
                          ? "bg-pink-50 text-pink-600"
                          : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {item.type === "internship" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : item.id === "genai-workshop" ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <Briefcase className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-slate-900 text-base">{item.title}</h3>
                      {item.type === "bonus" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          Included free
                        </span>
                      )}
                    </div>
                    {item.note && (
                      <p className="text-xs text-slate-500 font-medium mb-2">{item.note}</p>
                    )}
                    <div className="flex items-baseline gap-2">
                      {item.listPrice > item.price && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{item.listPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      <span
                        className={`text-lg font-extrabold ${
                          item.price === 0 ? "text-emerald-600" : "text-slate-900"
                        }`}
                      >
                        {item.price === 0 ? "FREE" : `₹${item.price.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-[#181FC5]/10 bg-[#f0f1ff] p-4 text-sm text-slate-700 font-medium">
                Bundle includes your internship track, GenAI workshop access, and Reznio job-search platform access after enrollment.
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sticky top-8">
                <h2 className="text-lg font-extrabold text-slate-900 mb-4">Order Summary</h2>

                {cart.coverImage && (
                  <img
                    src={cart.coverImage}
                    alt={cart.title}
                    className="w-full h-36 object-cover rounded-2xl mb-4 border border-slate-100"
                  />
                )}

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-slate-600">
                    <span>Internship plan</span>
                    <span className="font-bold text-slate-900">
                      ₹{cart.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GenAI workshop</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Reznio access</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-xs pt-2 border-t border-slate-100">
                    <span>You save</span>
                    <span className="font-bold text-emerald-600">
                      ₹{savings.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6 pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Total due</span>
                  <span className="text-2xl font-extrabold text-[#181FC5]">
                    ₹{cart.total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={paying}
                  className="w-full py-4 rounded-xl bg-[#181FC5] hover:bg-[#1418a0] disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md"
                >
                  {paying ? "Processing..." : "Pay Now"}
                </button>

                <p className="mt-3 text-[11px] text-slate-500 text-center font-medium">
                  Secure payment via Razorpay · ISO-backed internship certificate
                </p>

                <Link
                  to="/internship-programs"
                  className="mt-4 block text-center text-xs font-semibold text-[#181FC5] hover:underline"
                >
                  Choose a different track
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default InternshipCart;
