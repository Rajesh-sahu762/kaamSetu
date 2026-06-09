import { useState } from "react";

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

const CheckoutPage = () => {

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  const [agree, setAgree] =
    useState(false);

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
                  value="Rajesh Electric Works"
                />

                <InfoRow
                  icon={<Calendar size={18} />}
                  label="Date"
                  value="12 June 2026"
                />

                <InfoRow
                  icon={<Clock3 size={18} />}
                  label="Time"
                  value="10:00 AM"
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

                <div>
                  <p className="text-primary">
                    A-262 Azad Nagar,
                    Kumbha Circle
                  </p>

                  <p className="text-muted">
                    Bhilwara,
                    Rajasthan,
                    311001
                  </p>
                </div>
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
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"
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
                Rajesh Electric Works
              </h3>

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
                  label="Visit Charge"
                  value="₹499"
                />

                <PriceRow
                  label="Platform Fee"
                  value="₹49"
                />

                <PriceRow
                  label="GST"
                  value="₹18"
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
                    ₹566
                  </span>
                </div>
              </div>

              <button
                disabled={!agree}
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
                Confirm Booking
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