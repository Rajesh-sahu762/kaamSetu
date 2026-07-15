import { X, Calendar, Clock, Phone, Mail, ChevronDown, MapPin, CreditCard } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import StatusPill from "@/components/common/StatusPill";
import { T } from "@/utils/vendorTheme";
import { updateBookingStatus } from "@/services/vendorService";
import { toast } from "react-toastify";
import { useState } from "react";

export default function BookingDetailsModal({
    open,

onClose,

booking,

loading,

refreshBookings,
}) {


    if (!open) return null;

    return (

        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                padding: 20,
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: 700,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: T.white,
                    borderRadius: 12,
                    padding: 24,
                }}
            >

                {/* Header */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            fontFamily: "Geist,sans-serif",
                        }}
                    >
                        Booking Details
                    </h2>

                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                    >
                        <X />
                    </button>

                </div>

                {
                    loading ?

                        <div
                            style={{
                                padding: 50,
                                textAlign: "center",
                            }}
                        >
                            Loading...
                        </div>

                        :

                        booking && (

                            <>

                                {/* Booking */}

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 20,
                                        marginTop: 25,
                                    }}
                                >

                                    <div>

                                        <small>Booking Number</small>

                                        <h4>{booking.bookingNumber}</h4>

                                    </div>

                                    <div>

                                        <StatusPill
                                            status={booking.status}
                                        />

                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                        }}
                                    >

                                        <Calendar size={16} />

                                        {new Date(
                                            booking.bookingDate
                                        ).toLocaleDateString()}

                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                        }}
                                    >

                                        <Clock size={16} />

                                        {booking.bookingTime}

                                    </div>

                                </div>

                                <hr
                                    style={{
                                        margin: "24px 0",
                                    }}
                                />

                                {/* Customer */}

                                <h3>Customer</h3>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: 15,
                                        alignItems: "center",
                                    }}
                                >

                                    <Avatar
                                        initials={
                                            booking.customerId.fullName
                                                .split(" ")
                                                .map(word => word[0])
                                                .join("")
                                        }
                                        size={55}
                                    />

                                    <div>

                                        <h4>
                                            {booking.customerId.fullName}
                                        </h4>

                                        <p>

                                            <Phone size={14} />

                                            {" "}

                                            {booking.customerId.mobile}

                                        </p>

                                        <p>

                                            <Mail size={14} />

                                            {" "}

                                            {booking.customerId.email}

                                        </p>

                                    </div>

                                </div>

                                <hr style={{ margin: "24px 0" }} />

                                {/* Service */}

                                <h3>Service</h3>

                                <p>

                                    {booking.serviceId.serviceName}

                                </p>

                                <p>

                                    ₹{booking.serviceId.startingPrice}

                                </p>

                                <p>

                                    {booking.serviceId.duration} Minutes

                                </p>

                                <hr style={{ margin: "24px 0" }} />

                                {/* Address */}

                                <h3>Address</h3>

                                <p>

                                    <MapPin size={14} />

                                    {" "}

                                    {booking.address}

                                </p>

                                <hr style={{ margin: "24px 0" }} />

                                {/* Payment */}

                                <h3>Payment</h3>

                                <p>

                                    <CreditCard size={14} />

                                    {" "}

                                    {booking.paymentMethod}

                                </p>

                                <p>

                                    Status : {booking.paymentStatus}

                                </p>

                                <p>

                                    Amount : ₹{booking.totalAmount}

                                </p>

                                <hr style={{ margin: "24px 0" }} />


                                {/* Notes */}

                                <h3>Notes</h3>

                                <p>

                                    {booking.notes || "No Notes"}

                                </p>

                            </>

                        )

                }

            </div>

        </div>

    );

}