import { useState, useEffect } from "react";

import Fade from "@/components/common/Fade";

import {
  getVendorEarnings,
  getVendorTransactions,
} from "@/services/vendorService";

import {
  T,
  MOBILE_BOTTOM_NAV_HEIGHT,
} from "@/utils/vendorTheme";

import useBreakpoint from "@/utils/useBreakpoint";

import {
  TrendingUp,
  Wallet,
  CalendarClock,
  CircleCheckBig,
} from "lucide-react";



export default function Earnings() {

const bp = useBreakpoint();

const [earnings, setEarnings] = useState(null);

const [transactions, setTransactions] = useState([]);

const [loading, setLoading] = useState(true);

useEffect(() => {

  const fetchDashboard = async () => {
  try {
    setLoading(true);

    const [earningsRes, transactionRes] = await Promise.all([
      getVendorEarnings(),
      getVendorTransactions({
        page: 1,
        limit: 5,
      }),
    ]);

    if (earningsRes.success) {
      setEarnings(earningsRes.data);
    }

    if (transactionRes.success) {
      setTransactions(transactionRes.data);
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  fetchDashboard();

}, []);

if (loading) {

  return (

    <div
      style={{
        padding: 30,
      }}
    >

      Loading Earnings...

    </div>

  );

}

if (!earnings) {
  return (
    <div style={{ padding: 30 }}>
      Unable to load earnings.
    </div>
  );
}


return (

<div

style={{

padding:bp.isMobile ? 16 : 24,

paddingBottom:

bp.isMobile

? MOBILE_BOTTOM_NAV_HEIGHT + 24

:24,

}}

>
    <Fade>

<div

style={{

background:T.slate,

borderRadius:22,

padding:bp.isMobile ? 22 : 28,

display:"flex",

justifyContent:"space-between",

alignItems:"center",

flexWrap:"wrap",

gap:24,

color:T.white,

}}

>

<div>

<div

style={{

fontSize:13,

opacity:.75,

}}

>

This Month Earnings

</div>

<h1

style={{

marginTop:12,

fontFamily:"Geist,sans-serif",

fontSize:bp.isMobile ? 34 : 46,

fontWeight:700,

}}

>

₹{earnings?.thisMonthEarnings?.toLocaleString("en-IN") || 0}

</h1>


</div>

<div

style={{

display:"flex",

alignItems:"center",

justifyContent:"center",

width:74,

height:74,

borderRadius:"50%",

background:"rgba(255,255,255,.08)",

}}

>

<Wallet

size={34}

color={T.bronze}

/>

</div>

</div>

</Fade>


<Fade delay={0.08}>

<div

style={{

display:"grid",

gridTemplateColumns:

bp.isDesktop

? "repeat(4,1fr)"

: bp.isTablet

? "repeat(2,1fr)"

:"repeat(2,1fr)",

gap:18,

marginTop:24,

}}

>
    {
 [
  {
    title: "Lifetime Earnings",
    value: `₹${(
      earnings?.totalEarnings || 0
    ).toLocaleString("en-IN")}`,
    icon: Wallet,
    color: T.bronze,
  },

  {
    title: "This Month",
    value: `₹${(
      earnings?.thisMonthEarnings || 0
    ).toLocaleString("en-IN")}`,
    icon: TrendingUp,
    color: T.green,
  },

  {
    title: "Pending Settlement",
    value: `₹${(
      earnings?.pendingSettlement || 0
    ).toLocaleString("en-IN")}`,
    icon: CalendarClock,
    color: T.amber,
  },

  {
    title: "Settled Amount",
    value: `₹${(
      earnings?.completedSettlement || 0
    ).toLocaleString("en-IN")}`,
    icon: CircleCheckBig,
    color: T.green,
  },
].map((card)=>(

<div

key={card.title}

style={{

background:T.white,

border:`1px solid ${T.border}`,

borderRadius:18,

padding:20,

}}

>

<div

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

}}

>

<div

style={{

fontSize:13,

color:T.slateGray,

}}

>

{card.title}

</div>

<card.icon

size={20}

color={card.color}

/>

</div>

<div

style={{

marginTop:14,

fontFamily:"Geist,sans-serif",

fontSize:bp.isMobile ? 24 : 30,

fontWeight:700,

color:T.slate,

}}

>

{card.value}

</div>

</div>

))}

</div>

</Fade>

<Fade delay={0.15}>

<div
style={{
marginTop:28,

background:T.slate,

borderRadius:22,

padding:bp.isMobile ? 22 : 28,

color:T.white,

display:"grid",

gridTemplateColumns:
bp.isDesktop
? "1.6fr 1fr"
: "1fr",

gap:28,
}}
>

{/* Left */}

<div>

<div
style={{
fontSize:13,
opacity:.7,
}}
>

Next Settlement

</div>

<h1
style={{
marginTop:12,
fontFamily:"Geist,sans-serif",
fontSize:bp.isMobile ? 38 : 48,
fontWeight:700,
}}
>

₹{(
  earnings?.pendingSettlement || 0
).toLocaleString("en-IN")}

</h1>

<p
style={{
marginTop:10,
opacity:.8,
lineHeight:1.7,
}}
>

Your pending settlements will be transferred after the settlement process is completed.
</p>

<div
style={{
marginTop:22,

display:"inline-flex",

alignItems:"center",

gap:10,

padding:"10px 16px",

borderRadius:999,

background:"rgba(255,255,255,.08)",
}}
>

<CircleCheckBig
size={18}
color={T.green}
/>

{
  earnings?.pendingSettlement > 0
    ? "Settlement Processing"
    : "No Pending Settlement"
}
</div>

</div>

{/* Right */}

<div
style={{
background:"rgba(255,255,255,.06)",

borderRadius:18,

padding:22,
}}
>

<div
style={{
fontSize:13,
opacity:.7,
}}
>

Transfer Details

</div>

<div
style={{
marginTop:18,
display:"grid",
gap:18,
}}
>

<div>

<div
style={{
fontSize:12,
opacity:.65,
}}
>

Settlement Date

</div>

<div
style={{
marginTop:4,
fontWeight:600,
}}
>

Pending

</div>

</div>

<div>

<div
style={{
fontSize:12,
opacity:.65,
}}
>

Bank

</div>

<div
style={{
marginTop:4,
fontWeight:600,
}}
>

{Vendor.bankDetails.bankName}

</div>

</div>

<div>

<div
style={{
fontSize:12,
opacity:.65,
}}
>

Account

</div>

<div
style={{
marginTop:4,
fontWeight:600,
}}
>

const maskedAccount =
accountNumber
? `******${accountNumber.slice(-4)}`
: "Not Added";

</div>

</div>

</div>

</div>

</div>

</Fade>


<Fade delay={0.22}>

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
color:T.slate,
marginBottom:26,
}}
>

Settlement Timeline

</h2>

<div
style={{
display:"grid",
gap:18,
}}
>

{[
["Booking Completed",true],

["Customer Confirmation",true],

["Settlement Generated",true],

["Bank Processing",false],

["Transferred",false],

].map(([title,done],index)=>(

<div
key={title}
style={{
display:"flex",
alignItems:"center",
gap:18,
}}
>

<div
style={{
width:28,
height:28,
borderRadius:"50%",

background:done
? T.green
: T.surfaceLow,

display:"flex",

alignItems:"center",

justifyContent:"center",

color:T.white,

fontWeight:700,

flexShrink:0,
}}
>

{done ? "✓" : index+1}

</div>

<div>

<div
style={{
fontWeight:600,
color:T.slate,
}}
>

{title}

</div>

{!done && (

<div
style={{
marginTop:4,
fontSize:13,
color:T.slateGray,
}}
>

Waiting...

</div>

)}

</div>

</div>

))}

</div>

</div>

</Fade>

{/* part 3 */}
<Fade delay={0.28}>

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

Pending Settlements

</h2>

<div
style={{
fontSize:13,
color:T.slateGray,
}}
>

2 Pending

</div>

</div>

<div
style={{
display:"grid",
gap:16,
}}
>

{[
{
id:"KS-2041",
service:"Interior Painting",
amount:"₹8,500",
status:"Tomorrow",
},

{
id:"KS-2037",
service:"Electrical Repair",
amount:"₹9,700",
status:"Waiting Customer Confirmation",
},

].map((item)=>(

<div
key={item.id}
style={{
display:"flex",

justifyContent:"space-between",

alignItems:"center",

padding:20,

background:T.surfaceLow,

borderRadius:16,

flexWrap:"wrap",

gap:14,
}}
>

<div>

<div
style={{
fontWeight:700,
color:T.slate,
}}
>

{item.id}

</div>

<div
style={{
marginTop:5,
fontSize:13,
color:T.slateGray,
}}
>

{item.service}

</div>

</div>

<div
style={{
textAlign:"right",
}}
>

<div
style={{
fontFamily:"Geist,sans-serif",
fontWeight:700,
fontSize:20,
color:T.slate,
}}
>

{item.amount}

</div>

<div
style={{
marginTop:6,
fontSize:13,
color:T.amber,
}}
>

{item.status}

</div>

</div>

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
marginBottom:26,
flexWrap:"wrap",
gap:12,
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
Revenue Analytics
</h2>

<p
style={{
marginTop:6,
fontSize:13,
color:T.slateGray,
}}
>
Monthly earnings overview
</p>

</div>

<div
style={{
display:"flex",
gap:10,
}}
>

{["6M","1Y"].map((item)=>(

<button
key={item}
style={{
padding:"8px 16px",
border:item==="6M"
? "none"
:`1px solid ${T.border}`,
background:item==="6M"
? T.slate
:T.white,
color:item==="6M"
? T.white
:T.slate,
borderRadius:8,
cursor:"pointer",
}}
>

{item}

</button>

))}

</div>

</div>

<div
style={{
display:"flex",
alignItems:"flex-end",
justifyContent:"space-between",
height:220,
gap:12,
}}
>

{[
45,
62,
58,
80,
74,
96,
].map((value,index)=>(

<div
key={index}
style={{
flex:1,
display:"flex",
flexDirection:"column",
alignItems:"center",
}}
>

<div
style={{
height:`${value}%`,
width:"100%",
maxWidth:42,
background:index===5
? T.bronze
:T.surfaceLow,
borderRadius:"10px 10px 0 0",
transition:".3s",
}}
></div>

<div
style={{
marginTop:10,
fontSize:12,
color:T.slateGray,
}}
>

{["Jan","Feb","Mar","Apr","May","Jun"][index]}

</div>

</div>

))}

</div>

</div>

</Fade>
{/* part 4 */}

<Fade delay={0.42}>

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

Settlement History

</h2>

<button
style={{
border:"none",
background:T.surfaceLow,
padding:"10px 16px",
borderRadius:10,
cursor:"pointer",
}}
>

View All

</button>

</div>

<div
style={{
overflowX:"auto",
}}
>

<table
style={{
width:"100%",
borderCollapse:"collapse",
minWidth:760,
}}
>

<thead>

<tr>

{[
"Booking",

"Gross",

"Commission",

"GST",

"Net",

"Status",

].map((item)=>(

<th
key={item}
style={{
padding:"14px",
textAlign:"left",
borderBottom:`1px solid ${T.border}`,
fontSize:13,
color:T.slateGray,
}}
>

{item}

</th>

))}

</tr>

</thead>

<tbody>

{[
["KS2041","₹8500","₹850","₹153","₹7497","Completed"],

["KS2040","₹9700","₹970","₹175","₹8555","Processing"],

["KS2038","₹6200","₹620","₹112","₹5468","Completed"],

].map((row,index)=>(

<tr key={index}>

{row.map((cell,i)=>(

<td
key={i}
style={{
padding:"16px 14px",
borderBottom:`1px solid ${T.border}`,
fontSize:14,
color:
i===5
? cell==="Completed"
? T.green
:T.amber
:T.slate,
fontWeight:
i===5
?600
:500,
}}
>

{cell}

</td>

))}

</tr>

))}

</tbody>

</table>

</div>

</div>

</Fade>

<Fade delay={0.48}>

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
}}
>

Recent Transactions

</h2>

</div>

<div
style={{
display:"grid",
gap:14,
}}
>

{
transactions?.map((transaction) => (

<div
key={item.title}
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:18,
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

{item.title}

</div>

<div
style={{
marginTop:4,
fontSize:13,
color:T.slateGray,
}}
>

{item.type}

</div>

</div>

<div
style={{
fontFamily:"Geist,sans-serif",
fontWeight:700,
fontSize:18,
color:item.color,
}}
>

{item.amount}

</div>

</div>

))}

</div>

</div>

</Fade>

<Fade delay={0.55}>

<div
style={{
background:T.slate,
borderRadius:20,
padding:24,
marginTop:28,
color:T.white,
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

<div>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
}}
>

AI Financial Insights

</h2>

<p
style={{
marginTop:6,
opacity:.75,
fontSize:13,
}}
>

Smart suggestions to improve your earnings.

</p>

</div>

</div>

<div
style={{
display:"grid",
gap:16,
}}
>

{[
"Painting services generated 62% of your monthly revenue.",

"Weekend bookings increased your earnings by 18%.",

"Average settlement time improved from 3 days to 1 day.",

"Adding Plumbing service could increase revenue by approximately 12%.",

].map((item,index)=>(

<div
key={index}
style={{
display:"flex",
gap:14,
alignItems:"flex-start",
}}
>

<div
style={{
width:28,
height:28,
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
display:"flex",
alignItems:"center",
justifyContent:"center",
color:T.bronze,
fontWeight:700,
flexShrink:0,
}}
>

{index+1}

</div>

<div
style={{
lineHeight:1.8,
opacity:.9,
}}
>

{item}

</div>

</div>

))}

</div>

</div>

</Fade>


<Fade delay={0.62}>

<div
style={{
display:"grid",
gridTemplateColumns:
bp.isDesktop
? "1.4fr 1fr"
:"1fr",

gap:24,

marginTop:28,
}}
>

    <div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
marginBottom:24,
color:T.slate,
}}
>

Tax Summary

</h2>

<div
style={{
display:"grid",
gap:18,
}}
>

{[
  ["Gross Revenue", `₹${earnings?.grossRevenue?.toLocaleString() || 0}`],

  ["Platform Commission", `₹${earnings?.totalCommission?.toLocaleString() || 0}`],

  ["Net Earnings", `₹${earnings?.netEarnings?.toLocaleString() || 0}`],
].map(([label,value])=>(

<div
key={label}
style={{
display:"flex",
justifyContent:"space-between",
}}
>

<div
style={{
color:T.slateGray,
}}
>

{label}

</div>

<div
style={{
fontWeight:700,
color:T.slate,
}}
>

{value}

</div>

</div>

))}

</div>

</div>

<div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
marginBottom:24,
}}
>

Statements

</h2>

<div
style={{
display:"grid",
gap:14,
}}
>

{[
"Download PDF",

"Download Excel",

"Download CSV",

].map((item)=>(

<button
key={item}
style={{
height:46,
border:`1px solid ${T.border}`,
background:T.surfaceLow,
borderRadius:12,
cursor:"pointer",
fontWeight:600,
}}
>

{item}

</button>

))}

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

cursor:"pointer",

display:"flex",

alignItems:"center",

justifyContent:"center",

boxShadow:"0 12px 30px rgba(0,0,0,.15)",

zIndex:40,
}}
>

<Wallet size={22}/>

</button>

)}

</div>

);

}