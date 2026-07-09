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

// const PROFILE = {
//   name: "Rajesh Sharma",

//   avatar: "RS",

//   profession: "Electrician",

//   city: "Jaipur",

//   rating: 4.9,

//   reviews: 1248,

//   verified: true,
// };

const PROFILE_PROGRESS = [
  {
    title: "Profile Photo",
    done: true,
  },

  {
    title: "Business Details",
    done: true,
  },

  {
    title: "Skills",
    done: true,
  },

  {
    title: "Service Areas",
    done: true,
  },

  {
    title: "Portfolio",
    done: false,
  },

  {
    title: "Bank Details",
    done: false,
  },
];

const AI_SUGGESTIONS = [
  "Upload 5 more project photos to improve trust.",
  "Enable Sunday availability to receive more bookings.",
  "Customers appreciate your professionalism.",
];


export default function Profile() {

const bp = useBreakpoint();

const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);

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
    <Fade>

<div

style={{

background:T.slate,

borderRadius:22,

padding:bp.isMobile ? 20 : 28,

color:T.white,

display:"flex",

justifyContent:"space-between",

alignItems:"center",

flexWrap:"wrap",

gap:24,

}}

>

<div

style={{

display:"flex",

alignItems:"center",

gap:18,

}}

>

<Avatar

initials={profile.profileImage ? "" : profile.fullName.split(" ").map(n => n[0]).join("")}

size={72}

bg={T.bronze}

/>

<div>

<h1

style={{

fontFamily:"Geist,sans-serif",

fontSize:30,

fontWeight:600,

}}

>

{profile.fullName}

</h1>

<div

style={{

marginTop:8,

display:"flex",

gap:12,

flexWrap:"wrap",

alignItems:"center",

}}

>

<span>

⭐ {profile.rating}

</span>

<span>

({profile.reviews} Reviews)

</span>

<span>

{profile.profession}

</span>

<span>

{profile.city}

</span>

</div>

{profile.verified && (

<div

style={{

marginTop:14,

display:"inline-flex",

alignItems:"center",

gap:8,

padding:"6px 12px",

background:"rgba(255,255,255,.08)",

borderRadius:999,

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

style={{

height:46,

padding:"0 18px",

border:"none",

background:T.white,

color:T.slate,

borderRadius:10,

display:"flex",

alignItems:"center",

gap:8,

cursor:"pointer",

fontWeight:600,

}}

>

<Pencil size={17}/>

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

82%

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

width:"82%",

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
    94%
  </h1>

  <p
    style={{
      color: T.green,
      fontWeight: 600,
      marginTop: 6,
    }}
  >
    Excellent
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
        value: 100,
      },
      {
        label: "Reviews",
        value: 96,
      },
      {
        label: "Response",
        value: 91,
      },
      {
        label: "Portfolio",
        value: 80,
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
    {AI_SUGGESTIONS.map((item) => (
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
["Full Name",profile.fullName],

["Email",profile.email],

["Mobile",profile.mobile],

// ["Gender",profile.gender],

// ["Languages",profile.languages],

["Experience",profile.experience],
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

{[
["Business Name",profile.businessName],

["Business Type",profile.businessType],

["Experience",profile.experience],

["Team Size",profile.teamSize],

["Working Since",profile.workingSince],

["GST",profile.gst],

["Business Address",profile.businessAddress],

["Bio",profile.bio],

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
lineHeight:1.7,
}}
>

{value}

</div>

</div>

))}

</div>

</div>

</Fade>


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

{[
"Electrical Repair",

"Fan Installation",

"Switch Board",

"House Wiring",

"MCB Installation",

"Commercial Work",

"Emergency Repair",

"Maintenance",

].map((skill)=>(

<div
key={skill}
style={{
padding:"10px 16px",
background:T.surfaceLow,
border:`1px solid ${T.border}`,
borderRadius:999,
fontWeight:500,
fontSize:13,
}}
>

{skill}

</div>

))}

</div>

</div>

</Fade>


<Fade delay={0.35}>

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

Service Areas

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

{[
"Jaipur",

"Ajmer",

"Bhilwara",

"Kishangarh",

"Tonk",

].map((city)=>(

<div
key={city}
style={{
padding:"10px 18px",
borderRadius:999,
background:T.bronzeLight,
color:T.slate,
fontWeight:600,
fontSize:13,
}}
>

{city}

</div>

))}

</div>

<div
style={{
marginTop:22,
padding:18,
borderRadius:14,
background:T.surfaceLow,
}}
>

<div
style={{
fontSize:13,
color:T.slateGray,
}}
>

Maximum Service Radius

</div>

<div
style={{
marginTop:8,
fontFamily:"Geist,sans-serif",
fontSize:26,
fontWeight:700,
color:T.slate,
}}
>

{profile.radius} km

</div>

</div>

</div>

</Fade>

<Fade delay={0.4}>

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

Portfolio

</h2>

<p
style={{
marginTop:6,
fontSize:13,
color:T.slateGray,
}}
>

Showcase your best completed projects.

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

Manage

</button>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:
bp.isMobile
? "repeat(2,1fr)"
: "repeat(4,1fr)",

gap:16,
}}
>

{Array.from({length:8}).map((_,i)=>(

<div
key={i}
style={{
aspectRatio:"1",
borderRadius:18,
background:"linear-gradient(135deg,#EEF2FF,#D6E4FF)",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:34,
}}
>

🛠️

</div>

))}

</div>

</div>

</Fade>

<Fade delay={0.45}>

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
Documents
</h2>

<p
style={{
marginTop:6,
fontSize:13,
color:T.slateGray,
}}
>
Verified documents managed by KaamSetu.
</p>

</div>

</div>

<div
style={{
display:"grid",
gap:14,
}}
>

{[
["Aadhar Card","Verified",T.green],
["PAN Card","Verified",T.green],
["Police Verification","Pending",T.amber],
["GST Certificate","Uploaded",T.blue],
].map(([name,status,color])=>(

<div
key={name}
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"18px",
border:`1px solid ${T.border}`,
borderRadius:14,
}}
>

<div>

<div
style={{
fontWeight:600,
color:T.slate,
}}
>
{name}
</div>

<div
style={{
fontSize:13,
marginTop:4,
color,
}}
>
{status}
</div>

</div>

<button
style={{
border:"none",
background:T.surfaceLow,
padding:"10px 18px",
borderRadius:10,
cursor:"pointer",
fontWeight:600,
}}
>
View
</button>

</div>

))}

</div>

</div>

</Fade>


<Fade delay={0.5}>

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
color:T.slate,
}}
>
Availability
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
Edit
</button>

</div>

<div
style={{
display:"grid",
gap:12,
}}
>

{[
["Monday","9:00 AM - 6:00 PM"],
["Tuesday","9:00 AM - 6:00 PM"],
["Wednesday","9:00 AM - 6:00 PM"],
["Thursday","9:00 AM - 6:00 PM"],
["Friday","9:00 AM - 6:00 PM"],
["Saturday","10:00 AM - 4:00 PM"],
["Sunday","Holiday"],
].map(([day,time])=>(

<div
key={day}
style={{
display:"flex",
justifyContent:"space-between",
padding:"14px 0",
borderBottom:`1px solid ${T.border}`,
}}
>

<span
style={{
fontWeight:600,
}}
>
{day}
</span>

<span
style={{
color:T.slateGray,
}}
>
{time}
</span>

</div>

))}

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
gridTemplateColumns:
bp.isDesktop
?"repeat(2,1fr)"
:"1fr",

gap:18,
}}
>

{[
["Bank","HDFC Bank"],

["Account","XXXXXXXX4532"],

["IFSC","HDFC0001245"],

["UPI","*******@okaxis"],

].map(([label,value])=>(

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

))}

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

{[
"Change Password",

"Notification Preferences",

"Privacy Settings",

"Logout",

].map((item)=>(

<div
key={item}
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
{item}
</div>

<ArrowRight size={18}/>

</div>

))}

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




