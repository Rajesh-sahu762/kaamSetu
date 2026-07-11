import { useState, useEffect } from 'react';
import { getVendorProfile } from "@/services/vendorService";

import Fade from '@/components/vendor/common/Fade';
import Avatar from '@/components/vendor/common/Avatar';

import { T, MOBILE_BOTTOM_NAV_HEIGHT } from '@/utils/vendorTheme';

import useBreakpoint from '@/utils/useBreakpoint';

import {
  User,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Pencil,
  CheckCircle2,
  ArrowRight,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function Profile() {

const bp = useBreakpoint();
const navigate = useNavigate();

const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);

const user = profile?.user;
const vendor = profile?.vendor;
const stats = profile?.stats;
const portfolio = profile?.portfolio;



const PROFILE_PROGRESS = [
  {
    title: "Profile Photo",
    done: !!user?.profileImage,
  },
  {
    title: "Business Details",
    done: !!vendor?.businessName,
  },
  {
    title: "Skills",
    done: vendor?.skills?.length > 0,
  },
  {
    title: "Bank Details",
    done: !!vendor?.bankDetails?.bankName,
  },
  {
    title: "Documents",
    done: !!vendor?.aadhaarImage && !!vendor?.panImage,
  },
];


const performanceCards = [
  {
    title: "Services",
    value: stats?.totalServices || 0,
    color: T.bronze,
  },
  {
    title: "Reviews",
    value: stats?.totalReviews || 0,
    color: T.green,
  },
  {
    title: "Completed",
    value: stats?.completedBookings || 0,
    color: T.blue,
  },
  {
    title: "Pending",
    value: stats?.pendingBookings || 0,
    color: "#F59E0B",
  },
  {
    title: "Earnings",
    value: `₹${(stats?.totalEarnings || 0).toLocaleString()}`,
    color: "#8B5CF6",
  },
];

const businessInfo = [
  ["Business Name", vendor?.businessName || "N/A"],

  ["Business Type", vendor?.businessType || "N/A"],

  ["Experience", `${vendor?.experience || 0} Years`],

  [
    "Business Address",
    `${vendor?.address || ""}, ${vendor?.city || ""}, ${vendor?.state || ""} - ${vendor?.pincode || ""}`,
  ],

  ["Service Radius", `${vendor?.radius || 0} KM`],

  ["Status", vendor?.status || "Pending"],

  [
    "Member Since",
    user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN")
      : "N/A",
  ],

  ["Bio", vendor?.bio || "No bio added"],
];

const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return "N/A";

  return "XXXXXXXX" + accountNumber.slice(-4);
};

const maskUpi = (upi) => {
  if (!upi) return "N/A";

  const [id, provider] = upi.split("@");

  return `${"*".repeat(Math.max(id.length - 2, 0))}${id.slice(-2)}@${provider}`;
};

const bankInfo = [
  [
    "Bank",
    vendor?.bankDetails?.bankName || "N/A",
  ],

  [
    "Account Holder",
    vendor?.bankDetails?.accountHolder || "N/A",
  ],

  [
    "Account Number",
    maskAccountNumber(
      vendor?.bankDetails?.accountNumber
    ),
  ],

  [
    "IFSC",
    vendor?.bankDetails?.ifscCode || "N/A",
  ],

  [
    "UPI",
    maskUpi(
      vendor?.bankDetails?.upiId
    ),
  ],
];


useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await getVendorProfile();

      setProfile(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

if (loading) {
  return <h2>Loading...</h2>;
}


return (

<div

style={{

padding:bp.isMobile ? 16 : 24,

paddingBottom:bp.isMobile

? MOBILE_BOTTOM_NAV_HEIGHT + 24

:24,

}}

>
  {/* personal information */}
    <Fade>
  <div
    style={{
      background: T.slate,
      borderRadius: 22,
      padding: bp.isMobile ? 20 : 28,
      color: T.white,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 24,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <Avatar
        initials={
          user?.profileImage
            ? ""
            : user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || ""
        }
        image={user?.profileImage}
        size={72}
        bg={T.bronze}
      />

      <div>
        <h1
          style={{
            fontFamily: "Geist,sans-serif",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          {user?.fullName || "N/A"}
        </h1>

        <div
          style={{
            marginTop: 8,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span>
            ⭐ {stats?.averageRating || 0}
          </span>

          <span>
            ({stats?.totalReviews || 0} Reviews)
          </span>

          <span>
            {vendor?.businessType || "N/A"}
          </span>

          <span>
            {vendor?.city || "N/A"}
          </span>
        </div>

        {vendor?.status === "approved" && (
          <div
            style={{
              marginTop: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              background: "rgba(255,255,255,.08)",
              borderRadius: 999,
            }}
          >
            <ShieldCheck
              size={16}
              color={T.green}
            />

            Verified Artisan
          </div>
        )}
      </div>
    </div>

    <button
      onClick={() => setIsEditOpen(true)}
      style={{
        height: 46,
        padding: "0 18px",
        border: "none",
        background: T.white,
        color: T.slate,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      <Pencil size={17} />
      Edit Profile
    </button>
  </div>
</Fade>

<Fade delay={0.08}>

<div

style={{

display:"grid",

gridTemplateColumns:bp.isDesktop

? "repeat(3,1fr)"

:"1fr",

gap:20,

marginTop:24,

}}

>
    <div

style={{

background:T.white,

border:`1px solid ${T.border}`,

borderRadius:18,

padding:22,

}}

>

<div

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

}}

>

<h3

style={{

fontFamily:"Geist,sans-serif",

fontSize:17,

}}

>

Profile Completion

</h3>

<Target

size={20}

color={T.bronze}

/>

</div>

<h1

style={{

marginTop:16,

fontFamily:"Geist,sans-serif",

fontSize:42,

}}

>

{stats?.profileCompletion || 0}%

</h1>

<div

style={{

marginTop:18,

height:10,

background:T.surfaceLow,

borderRadius:999,

overflow:"hidden",

}}

>

<div

style={{

width: `${stats?.profileCompletion || 0}%`,

height:"100%",

background:T.bronze,

}}

></div>

</div>

<div

style={{

marginTop:18,

display:"grid",

gap:8,

}}

>

{PROFILE_PROGRESS.map((item)=>(

<div

key={item.title}

style={{

display:"flex",

justifyContent:"space-between",

fontSize:13,

}}

>

<span>

{item.title}

</span>

<CheckCircle2

size={16}

color={item.done ? T.green : T.border}

/>

</div>

))}

</div>

</div>


<div
  style={{
    background: T.white,
    border: `1px solid ${T.border}`,
    borderRadius: 18,
    padding: 22,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h3
      style={{
        fontFamily: "Geist,sans-serif",
        fontSize: 17,
        color: T.slate,
      }}
    >
      Business Health
    </h3>

    <TrendingUp
      size={20}
      color={T.green}
    />
  </div>

  <h1
    style={{
      marginTop: 16,
      fontFamily: "Geist,sans-serif",
      fontSize: 42,
      color: T.slate,
    }}
  >
    {stats?.businessHealth || 0}%
  </h1>

  <p
    style={{
      color: T.green,
      fontWeight: 600,
      marginTop: 6,
    }}
  >
    {stats?.businessHealth >= 90
  ? "Excellent"
  : stats?.businessHealth >= 70
  ? "Good"
  : "Needs Improvement"}
  </p>

  <div
    style={{
      marginTop: 20,
      display: "grid",
      gap: 14,
    }}
  >
    {[
       {
    label: "Profile",
    value: stats?.profileCompletion || 0,
  },
  {
    label: "Reviews",
    value: Math.min((stats?.averageRating || 0) * 20, 100),
  },
  {
    label: "Bookings",
    value:
      stats?.completedBookings + stats?.pendingBookings > 0
        ? Math.round(
            (stats.completedBookings /
              (stats.completedBookings +
                stats.pendingBookings)) *
              100
          )
        : 0,
  },
  {
    label: "Portfolio",
    value: Math.min((portfolio?.length || 0) * 20, 100),
  },
    ].map((item) => (
      <div key={item.label}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          <span>{item.label}</span>

          <strong>{item.value}%</strong>
        </div>

        <div
          style={{
            height: 8,
            background: T.surfaceLow,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${item.value}%`,
              height: "100%",
              background: T.green,
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>


<div
  style={{
    background: T.slate,
    color: T.white,
    borderRadius: 18,
    padding: 22,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h3
      style={{
        fontFamily: "Geist,sans-serif",
        fontSize: 17,
      }}
    >
      AI Insights
    </h3>

    <Sparkles
      size={20}
      color={T.bronze}
    />
  </div>

  <p
    style={{
      marginTop: 8,
      opacity: .75,
      fontSize: 13,
      lineHeight: 1.7,
    }}
  >
    Suggestions to improve your profile.
  </p>

  <div
    style={{
      marginTop: 22,
      display: "grid",
      gap: 14,
    }}
  >
    {stats?.aiSuggestions?.map((item) => (
      <div
        key={item}
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <ArrowRight
          size={16}
          color={T.bronze}
          style={{
            marginTop: 2,
            flexShrink: 0,
          }}
        />

        <span
          style={{
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          {item}
        </span>
      </div>
    ))}
  </div>
</div>

</div>

</Fade>

{/* performance */}

<Fade delay={0.15}>

<div
  style={{
    marginTop: 28,
  }}
>

<div
  style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:18,
  }}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
color:T.slate,
}}
>

Performance
</h2>
</div>

<div
style={{
display:"grid",
gridTemplateColumns:
bp.isDesktop
? "repeat(5,1fr)"
: bp.isTablet
? "repeat(3,1fr)"
: "repeat(2,1fr)",

gap:16,
}}
>

{performanceCards.map((item) => (
  <div
    key={item.title}
    style={{
      background: T.white,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 20,
      textAlign: "center",
    }}
  >
    <h1
      style={{
        fontFamily: "Geist,sans-serif",
        fontSize: 30,
        color: item.color,
        marginBottom: 8,
      }}
    >
      {item.value}
    </h1>

    <p
      style={{
        color: T.textSecondary,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {item.title}
    </p>
  </div>
))}

    </div>

</div>

</Fade>

<Fade delay={0.2}>

<div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
marginTop:28,
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:24,
}}
>

<div>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
color:T.slate,
}}
>

Personal Information

</h2>

<p
style={{
marginTop:6,
fontSize:13,
color:T.slateGray,
}}
>

Basic details visible to customers.

</p>

</div>

<button
style={{
height:42,
padding:"0 18px",
border:"none",
borderRadius:10,
background:T.slate,
color:T.white,
display:"flex",
alignItems:"center",
gap:8,
cursor:"pointer",
}}
>

<Pencil size={16}/>

Edit

</button>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:
bp.isDesktop
? "repeat(2,1fr)"
:"1fr",

gap:18,
}}
>

{[
["Full Name",profile.user.fullName],

["Email",profile.user.email],

["Mobile",profile.user.mobile],

// ["Gender",profile.gender],

// ["Languages",profile.languages],

["Experience",profile.vendor.experience],
].map(([label,value])=>(

<div
key={label}
style={{
background:T.surfaceLow,
borderRadius:14,
padding:18,
}}
>

<div
style={{
fontSize:12,
color:T.slateGray,
marginBottom:8,
}}
>

{label}

</div>

<div
style={{
fontWeight:600,
fontSize:15,
color:T.slate,
}}
>

{value}

</div>

</div>

))}
</div>

</div>

</Fade>


<Fade delay={0.25}>

<div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
marginTop:28,
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:24,
}}
>

<div>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
color:T.slate,
}}
>
Business Information
</h2>

<p
style={{
marginTop:6,
fontSize:13,
color:T.slateGray,
}}
>
Business details shown on your public profile.
</p>

</div>

<button
style={{
height:42,
padding:"0 18px",
border:"none",
borderRadius:10,
background:T.slate,
color:T.white,
display:"flex",
alignItems:"center",
gap:8,
cursor:"pointer",
}}
>

<Pencil size={16}/>

Edit

</button>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:
bp.isDesktop
? "repeat(2,1fr)"
:"1fr",

gap:18,
}}
>

{businessInfo.map(([label,value])=>(

<div
key={label}
style={{
background:T.surfaceLow,
borderRadius:14,
padding:18,
}}
>

<div
style={{
fontSize:12,
color:T.slateGray,
marginBottom:8,
}}
>

{label}

</div>

<div
style={{
fontWeight:600,
fontSize:15,
color:T.slate,
lineHeight:1.7,
}}
>

{label === "Status" ? (
  <span
    style={{
      color:
        value === "approved"
          ? T.green
          : value === "pending"
          ? "#F59E0B"
          : "#EF4444",
      fontWeight: 700,
      textTransform: "capitalize",
    }}
  >
    {value}
  </span>
) : (
  value
)}

</div>

</div>

))}

</div>

</div>

</Fade>


{/* skills */}
<Fade delay={0.3}>

<div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
marginTop:28,
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:22,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
color:T.slate,
}}
>

Skills

</h2>

<button
style={{
height:42,
padding:"0 18px",
border:"none",
borderRadius:10,
background:T.slate,
color:T.white,
display:"flex",
alignItems:"center",
gap:8,
cursor:"pointer",
}}
>

<Pencil size={16}/>

Edit

</button>

</div>

<div
style={{
display:"flex",
flexWrap:"wrap",
gap:12,
}}
>

{vendor?.skills?.length > 0 ? (
  vendor.skills.map((skill, index) => (
    <div
      key={index}
      style={{
        padding: "10px 16px",
        background: T.surfaceLow,
        border: `1px solid ${T.border}`,
        borderRadius: 999,
        fontWeight: 500,
        fontSize: 13,
      }}
    >
      {skill}
    </div>
  ))
) : (
  <div
    style={{
      width: "100%",
      padding: 20,
      textAlign: "center",
      color: T.slateGray,
      background: T.surfaceLow,
      borderRadius: 12,
    }}
  >
    No skills added yet.
  </div>
)}

</div>

</div>

</Fade>



<Fade delay={0.55}>

<div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
marginTop:28,
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:24,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
}}
>
Bank Details
</h2>

<button
style={{
height:42,
padding:"0 18px",
border:"none",
background:T.slate,
color:T.white,
borderRadius:10,
cursor:"pointer",
}}
>
Update
</button>

</div>

<div
style={{
display:"grid",
gridTemplateColumns: bp.isDesktop
  ? (vendor?.bankDetails?.bankName ? "repeat(2, 1fr)" : "1fr")
  : "1fr",

gap:18,
}}
>

{vendor?.bankDetails?.bankName ? (
  bankInfo.map(([label,value])=>(
  
  <div
  key={label}
  style={{
  background:T.surfaceLow,
  padding:18,
  borderRadius:14,
  }}
  >
  
  <div
  style={{
  fontSize:12,
  color:T.slateGray,
  marginBottom:8,
  }}
  >
  {label}
  </div>
  
  <div
  style={{
  fontWeight:600,
  }}
  >
  {value}
  </div>
  
  </div>
  
  ))
) : (
  <div
    style={{
      width: "100%",
      padding: 20,
      textAlign: "center",
      color: T.slateGray,
      background: T.surfaceLow,
      borderRadius: 12,
    }}
  >
    No bank details added yet.
  </div>
)}
</div>

</div>

</Fade>

<Fade delay={0.6}>

<div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
marginTop:28,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
marginBottom:24,
}}
>
Account Settings
</h2>

<div
style={{
display:"grid",
gap:14,
}}
>
<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"16px 0",
borderBottom:`1px solid ${T.border}`,
cursor:"pointer",
}}
>

<div
style={{
fontWeight:500,
}}
>
  <button className="btn btn-outline cursor-pointer" onClick={() => navigate("/reset-password")}>change password</button>

</div>

<ArrowRight size={18}/>

</div>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"16px 0",
borderBottom:`1px solid ${T.border}`,
cursor:"pointer",
}}
>

<div
style={{
fontWeight:500,
}}
>
  <button className="btn btn-outline cursor-pointer" onClick={() => navigate("")}>Deactivate Account</button>

</div>

<ArrowRight size={18}/>

</div>

</div>

</div>

</Fade>


{bp.isMobile && (

<button
style={{
position:"fixed",
right:20,
bottom:MOBILE_BOTTOM_NAV_HEIGHT+20,
width:58,
height:58,
borderRadius:"50%",
border:"none",
background:T.bronze,
color:T.white,
display:"flex",
alignItems:"center",
justifyContent:"center",
cursor:"pointer",
boxShadow:"0 12px 30px rgba(0,0,0,.15)",
zIndex:40,
}}
>

<Pencil size={22}/>

</button>

)}

</div>

);

}




