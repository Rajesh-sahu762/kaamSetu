import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ShieldCheck,
  CreditCard,
  Wallet,
  Banknote,
  MapPin,
  Calendar,
  Clock3,
  User,
  CheckCircle2,
} from "lucide-react";

import { getServiceById } from "@/services/publicService";
import { createBooking } from "@/services/customerService";
import { getImageUrl } from "@/utils/imageUrl";
import {
  createOrder,
  verifyPayment,
  loadRazorpayScript,
} from "@/services/paymentService";
import { AuthContext } from "@/context/authContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const draft = location.state || {};
  const { serviceId, bookingDate, bookingTime, address, notes } = draft;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await getServiceById(serviceId);

        if (response.success) {
          setService(response.data.service);
        } else {
          setError(response.message || "Service not found.");
        }
      } catch (err) {
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleConfirm = async () => {
    if (!agree) return;

    setSubmitting(true);

    try {
      // Step 1 — always create the booking first (cash or online — the
      // payment gateway needs an existing booking to create an order for).
      const bookingResponse = await createBooking({
        serviceId,
        bookingDate,
        bookingTime,
        address,
        notes,
        paymentMethod: paymentMethod === "cash" ? "cash" : "online",
      });

      if (!bookingResponse.success) {
        toast.error(bookingResponse.message || "Failed to create booking.");
        setSubmitting(false);
        return;
      }

      const booking = bookingResponse.data;

      // Cash — booking is already created, nothing further to pay now.
      if (paymentMethod === "cash") {
        navigate("/booking-success", {
          state: {
            bookingNumber: booking.bookingNumber,
            bookingId: booking._id,
          },
        });
        return;
      }

      // Online (UPI/Card) — go through Razorpay.
      const orderResponse = await createOrder(booking._id);

      if (!orderResponse.success) {
        toast.error(
          orderResponse.message ||
            "Could not start payment for this booking.",
        );
        setSubmitting(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setSubmitting(false);
        return;
      }

      const { orderId, amount, currency, key } = orderResponse.data;

      const razorpayOptions = {
        key,
        amount,
        currency,
        name: "KaamSetu",
        description: service?.serviceName || "Service Booking",
        order_id: orderId,
        method: paymentMethod === "upi" ? { upi: true } : undefined,
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#745A38",
        },
        handler: async (paymentResult) => {
          const verifyResponse = await verifyPayment({
            bookingId: booking._id,
            razorpay_order_id: paymentResult.razorpay_order_id,
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_signature: paymentResult.razorpay_signature,
          });

          if (verifyResponse.success) {
            navigate("/booking-success", {
              state: {
                bookingNumber: booking.bookingNumber,
                bookingId: booking._id,
              },
            });
          } else {
            toast.error(
              verifyResponse.message ||
                "Payment verification failed. Please contact support.",
            );
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!serviceId || !bookingDate) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-muted">
            No booking in progress. Please start from a service or expert
            profile.
          </p>

          <button
            onClick={() => navigate("/experts")}
            className="
              mt-6
              px-6
              py-3
              rounded-2xl
              bg-[#745A38]
              text-white
              font-medium
            "
          >
            Browse Experts
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center text-muted">
          Loading checkout...
        </div>
      </section>
    );
  }

  if (error || !service) {
    return (
      <section className="min-h-screen bg-theme pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center text-red-500">
          {error || "Service not found."}
        </div>
      </section>
    );
  }

  const formattedDate = new Date(bookingDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="
        min-h-screen
        bg-theme

        pt-32
        pb-20
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto

          px-6
          lg:px-8
        "
      >
        {/* Header */}

        <div className="mb-10">

          <div
            className="
              inline-flex
              items-center
              gap-2

              px-4
              py-2

              rounded-full

              bg-[#745A38]/10

              text-[#745A38]
            "
          >
            <ShieldCheck size={16} />
            Secure Checkout
          </div>

          <h1
            className="
              mt-5

              text-4xl
              md:text-5xl

              font-semibold

              text-primary
            "
          >
            Complete Your Booking
          </h1>

          <p
            className="
              mt-3

              text-lg

              text-muted
            "
          >
            Review your booking details
            and confirm your service.
          </p>

        </div>

        {/* Layout */}

        <div
          className="
            grid

            lg:grid-cols-[1fr_420px]

            gap-8
          "
        >
          {/* LEFT */}

          <div className="space-y-8">

            {/* Booking Summary */}

            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <h2
                className="
                  text-2xl
                  font-semibold

                  text-primary
                "
              >
                Booking Details
              </h2>

              <div
                className="
                  mt-6

                  space-y-5
                "
              >
                <InfoRow
                  icon={<User size={18} />}
                  label="Expert"
                  value={service.vendorId?.businessName}
                />

                <InfoRow
                  icon={<Calendar size={18} />}
                  label="Date"
                  value={formattedDate}
                />

                <InfoRow
                  icon={<Clock3 size={18} />}
                  label="Time"
                  value={bookingTime}
                />
              </div>
            </div>

            {/* Address */}

            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <h2
                className="
                  text-2xl
                  font-semibold

                  text-primary
                "
              >
                Service Address
              </h2>

              <div
                className="
                  mt-6

                  flex
                  gap-4
                "
              >
                <MapPin
                  className="
                    text-accent
                    shrink-0
                  "
                />

                <p className="text-primary">{address}</p>
              </div>
            </div>

            {/* Payment */}

            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <h2
                className="
                  text-2xl
                  font-semibold

                  text-primary
                "
              >
                Payment Method
              </h2>

              <div
                className="
                  mt-6

                  space-y-4
                "
              >
                <PaymentCard
                  active={
                    paymentMethod ===
                    "cash"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "cash"
                    )
                  }
                  icon={
                    <Banknote />
                  }
                  title="Cash After Service"
                  desc="Pay directly after work completion"
                />

                <PaymentCard
                  active={
                    paymentMethod ===
                    "upi"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "upi"
                    )
                  }
                  icon={
                    <Wallet />
                  }
                  title="UPI"
                  desc="Google Pay, PhonePe, Paytm"
                />

                <PaymentCard
                  active={
                    paymentMethod ===
                    "card"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "card"
                    )
                  }
                  icon={
                    <CreditCard />
                  }
                  title="Credit / Debit Card"
                  desc="Visa, Mastercard, RuPay"
                />
              </div>
            </div>

            {/* Terms */}

            <div
              className="
                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              <label
                className="
                  flex
                  items-start

                  gap-3

                  cursor-pointer
                "
              >
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) =>
                    setAgree(
                      e.target.checked
                    )
                  }
                  className="
                    mt-1
                  "
                />

                <span
                  className="
                    text-muted
                  "
                >
                  I agree to
                  KaamSetu's Terms,
                  Privacy Policy
                  and Booking Policy.
                </span>
              </label>
            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div
              className="
                sticky
                top-28

                bg-card

                border
                border-theme

                rounded-3xl

                p-6
              "
            >
              {/* Expert */}

              <img
                src={
                  getImageUrl(service.vendorId?.userId?.profileImage, "profile") ||
                  FALLBACK_IMAGE
                }
                alt=""
                className="
                  w-full
                  h-56

                  object-cover

                  rounded-2xl
                "
              />

              <h3
                className="
                  mt-5

                  text-2xl
                  font-semibold

                  text-primary
                "
              >
                {service.vendorId?.businessName}
              </h3>

              <p className="mt-1 text-muted">{service.serviceName}</p>

              <div
                className="
                  mt-2

                  flex
                  items-center

                  gap-2

                  text-green-600
                "
              >
                <CheckCircle2
                  size={18}
                />
                Verified Professional
              </div>

              {/* Pricing */}

              <div
                className="
                  mt-8

                  border-t
                  border-theme

                  pt-6

                  space-y-4
                "
              >
                <PriceRow
                  label="Service Charge"
                  value={`₹${service.startingPrice}`}
                />
              </div>

              <div
                className="
                  mt-6

                  pt-6

                  border-t
                  border-theme
                "
              >
                <div
                  className="
                    flex
                    justify-between
                    items-center
                  "
                >
                  <span
                    className="
                      text-lg
                      font-medium
                    "
                  >
                    Total
                  </span>

                  <span
                    className="
                      text-3xl
                      font-bold

                      text-primary
                    "
                  >
                    ₹{service.startingPrice}
                  </span>
                </div>
              </div>

              <button
                disabled={!agree || submitting}
                onClick={handleConfirm}
                className="
                  w-full

                  mt-8

                  py-4

                  rounded-2xl

                  bg-[#745A38]

                  text-white

                  font-medium

                  disabled:opacity-50

                  hover:opacity-90

                  transition
                "
              >
                {submitting ? "Please wait..." : "Confirm Booking"}
              </button>

              <p
                className="
                  mt-4

                  text-center

                  text-xs

                  text-muted
                "
              >
                Secure booking powered
                by KaamSetu
              </p>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

/* Helpers */

const InfoRow = ({
  icon,
  label,
  value,
}) => (
  <div
    className="
      flex
      justify-between
      items-center
    "
  >
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
      {icon}
      <span>{label}</span>
    </div>

    <span className="font-medium">
      {value}
    </span>
  </div>
);

const PriceRow = ({
  label,
  value,
}) => (
  <div
    className="
      flex
      justify-between
    "
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const PaymentCard = ({
  icon,
  title,
  desc,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      w-full

      text-left

      p-5

      rounded-2xl

      border

      transition

      ${
        active
          ? "border-[#745A38] bg-[#745A38]/10"
          : "border-theme"
      }
    `}
  >
    <div
      className="
        flex
        gap-4
      "
    >
      {icon}

      <div>
        <h4 className="font-medium">
          {title}
        </h4>

        <p
          className="
            text-sm
            text-muted
            mt-1
          "
        >
          {desc}
        </p>
      </div>
    </div>
  </button>
);

export default CheckoutPage;
