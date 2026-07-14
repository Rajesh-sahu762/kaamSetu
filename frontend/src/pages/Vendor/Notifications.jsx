import { useMemo, useState } from "react";

import Fade from "@/components/common/Fade";

import {
  T,
  MOBILE_BOTTOM_NAV_HEIGHT,
} from "@/utils/vendorTheme";

import useBreakpoint from "@/utils/useBreakpoint";

import {
  Search,
  Bell,
  CalendarDays,
  CreditCard,
  Star,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

const FILTERS = [
  "All",
  "Bookings",
  "Payments",
  "Reviews",
  "Messages",
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: "Bookings",
    title: "New Booking Received",
    message: "Interior Painting • Rajesh Sharma",
    time: "2 mins ago",
    day: "Today",
    unread: true,
  },

  {
    id: 2,
    type: "Payments",
    title: "Settlement Completed",
    message: "₹18,200 transferred successfully.",
    time: "1 hour ago",
    day: "Today",
    unread: true,
  },

  {
    id: 3,
    type: "Reviews",
    title: "New 5★ Review",
    message: "Meera Joshi left a review.",
    time: "Today",
    day: "Today",
    unread: false,
  },

  {
    id: 4,
    type: "Messages",
    title: "New Customer Message",
    message: "Customer sent you a message.",
    time: "Yesterday",
    day: "Yesterday",
    unread: false,
  },

  {
    id: 5,
    type: "System",
    title: "KYC Approved",
    message: "Your PAN verification is complete.",
    time: "Yesterday",
    day: "Yesterday",
    unread: false,
  },

  {
    id: 6,
    type: "System",
    title: "Platform Maintenance",
    message: "Scheduled maintenance this Sunday.",
    time: "3 days ago",
    day: "Older",
    unread: false,
  },
];



export default function Notifications() {

const bp = useBreakpoint();

const [search,setSearch]=useState("");

const [filter,setFilter]=useState("All");

const notifications = useMemo(()=>{

return NOTIFICATIONS.filter((item)=>{

const matchesSearch=

item.title
.toLowerCase()
.includes(search.toLowerCase())

||

item.message
.toLowerCase()
.includes(search.toLowerCase());

const matchesFilter=

filter==="All"

? true

: item.type===filter;

return matchesSearch && matchesFilter;

});

},[search,filter]);


return(

<div
style={{

padding:bp.isMobile?16:24,

paddingBottom:

bp.isMobile

? MOBILE_BOTTOM_NAV_HEIGHT+24

:24,

}}

>
    <Fade>

<div

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

flexWrap:"wrap",

gap:18,

}}

>

<div>

<h1

style={{

fontFamily:"Geist,sans-serif",

fontSize:30,

fontWeight:600,

color:T.slate,

}}

>

Notifications

</h1>

<p

style={{

marginTop:6,

fontSize:14,

color:T.slateGray,

}}

>

Stay updated with your business.

</p>

</div>

<button

style={{

height:44,

padding:"0 18px",

border:"none",

background:T.slate,

color:T.white,

borderRadius:10,

cursor:"pointer",

display:"flex",

alignItems:"center",

gap:8,

}}

>

<Bell size={18}/>

Mark all as read

</button>

</div>

</Fade>

<Fade delay={0.08}>

<div

style={{

marginTop:24,

position:"relative",

}}

>

<Search

size={18}

style={{

position:"absolute",

left:16,

top:15,

color:T.slateGray,

}}

/>

<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search notifications..."

style={{

width:"100%",

padding:"14px 16px 14px 46px",

border:`1px solid ${T.border}`,

borderRadius:14,

outline:"none",

background:T.white,

}}

>

</input>

</div>

</Fade>

<Fade delay={0.12}>

<div

style={{

display:"flex",

gap:10,

overflowX:"auto",

marginTop:18,

paddingBottom:6,

}}

>

{FILTERS.map((item)=>(

<button

key={item}

onClick={()=>setFilter(item)}

style={{

border:

filter===item

? "none"

:`1px solid ${T.border}`,

background:

filter===item

? T.slate

:T.white,

color:

filter===item

? T.white

:T.slate,

padding:"10px 18px",

borderRadius:999,

cursor:"pointer",

whiteSpace:"nowrap",

fontWeight:600,

}}

>

{item}

</button>

))}

</div>

</Fade>

<Fade delay={0.18}>

<div
style={{
marginTop:30,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:20,
fontWeight:600,
color:T.slate,
marginBottom:18,
}}
>

Today

</h2>

<div
style={{
display:"grid",
gap:16,
}}
>

{notifications
.filter((item)=>item.day==="Today")
.map((item)=>{
    let Icon = Bell;

let iconColor = T.slate;

switch(item.type){

case "Bookings":

Icon = CalendarDays;

iconColor = "#2563EB";

break;

case "Payments":

Icon = CreditCard;

iconColor = T.green;

break;

case "Reviews":

Icon = Star;

iconColor = T.bronze;

break;

case "Messages":

Icon = MessageCircle;

iconColor = "#7C3AED";

break;

default:

Icon = ShieldCheck;

iconColor = T.slateGray;

}

return(

<div

key={item.id}

style={{

background:T.white,

border:`1px solid ${T.border}`,

borderRadius:18,

padding:20,

display:"flex",

justifyContent:"space-between",

alignItems:"center",

gap:18,

flexWrap:"wrap",

}}

>
    <div

style={{

display:"flex",

gap:16,

alignItems:"flex-start",

flex:1,

minWidth:0,

}}

>

<div

style={{

width:48,

height:48,

borderRadius:14,

background:T.surfaceLow,

display:"flex",

alignItems:"center",

justifyContent:"center",

flexShrink:0,

}}

>

<Icon

size={22}

color={iconColor}

/>

</div>

<div
style={{
minWidth:0,
}}
>

<div

style={{

display:"flex",

alignItems:"center",

gap:8,

flexWrap:"wrap",

}}

>

<h3

style={{

fontFamily:"Geist,sans-serif",

fontSize:16,

fontWeight:600,

color:T.slate,

}}

>

{item.title}

</h3>

{item.unread && (

<div

style={{

width:8,

height:8,

borderRadius:"50%",

background:T.green,

}}

></div>

)}

</div>

<p

style={{

marginTop:8,

fontSize:14,

lineHeight:1.7,

color:T.slateGray,

}}

>

{item.message}

</p>

<div

style={{

marginTop:10,

fontSize:12,

color:T.slateGray,

}}

>

{item.time}

</div>

</div>

</div>

<div>

<button

style={{

height:40,

padding:"0 18px",

border:`1px solid ${T.border}`,

background:T.white,

borderRadius:10,

cursor:"pointer",

fontWeight:600,

color:T.slate,

}}

>

View

</button>

</div>

</div>

);

})}

</div>

</div>

</Fade>

<div
style={{
marginTop:30,
marginBottom:6,
height:1,
background:T.border,
opacity:.5,
}}
>
    <Fade delay={0.25}>

<div
style={{
marginTop:28,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:20,
fontWeight:600,
color:T.slate,
marginBottom:18,
}}
>

Yesterday

</h2>

<div
style={{
display:"grid",
gap:16,
}}
>

{notifications
.filter((item)=>item.day==="Yesterday")
.map((item)=>{

let Icon = Bell;
let iconColor = T.slate;

switch(item.type){

case "Bookings":
Icon = CalendarDays;
iconColor = "#2563EB";
break;

case "Payments":
Icon = CreditCard;
iconColor = T.green;
break;

case "Reviews":
Icon = Star;
iconColor = T.bronze;
break;

case "Messages":
Icon = MessageCircle;
iconColor = "#7C3AED";
break;

default:
Icon = ShieldCheck;
iconColor = T.slateGray;

}

return(

<div

key={item.id}

style={{

background:T.white,

border:`1px solid ${T.border}`,

borderRadius:18,

padding:20,

display:"flex",

justifyContent:"space-between",

alignItems:"center",

gap:18,

flexWrap:"wrap",

}}

>

<div
style={{
display:"flex",
gap:16,
alignItems:"flex-start",
flex:1,
minWidth:0,
}}
>

<div
style={{
width:48,
height:48,
borderRadius:14,
background:T.surfaceLow,
display:"flex",
alignItems:"center",
justifyContent:"center",
flexShrink:0,
}}
>

<Icon
size={22}
color={iconColor}
/>

</div>

<div
style={{
minWidth:0,
}}
>

<h3
style={{
fontFamily:"Geist,sans-serif",
fontSize:16,
fontWeight:600,
color:T.slate,
}}
>

{item.title}

</h3>

<p
style={{
marginTop:8,
fontSize:14,
lineHeight:1.7,
color:T.slateGray,
}}
>

{item.message}

</p>

<div
style={{
marginTop:10,
fontSize:12,
color:T.slateGray,
}}
>

{item.time}

</div>

</div>

</div>

<button
style={{
height:40,
padding:"0 18px",
border:`1px solid ${T.border}`,
background:T.white,
borderRadius:10,
cursor:"pointer",
fontWeight:600,
}}
>

View

</button>

</div>

);

})}

</div>

</div>

</Fade>

<div
style={{
marginTop:30,
marginBottom:6,
height:1,
background:T.border,
opacity:.5,
}}
></div>

<Fade delay={0.32}>

<div
style={{
marginTop:28,
}}
>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:20,
fontWeight:600,
color:T.slate,
marginBottom:18,
}}
>

Older

</h2>

<div
style={{
display:"grid",
gap:16,
}}
>

{notifications
.filter((item)=>item.day==="Older")
.map((item)=>(

<div

key={item.id}

style={{

background:T.white,

border:`1px solid ${T.border}`,

borderRadius:18,

padding:20,

display:"flex",

justifyContent:"space-between",

alignItems:"center",

gap:18,

flexWrap:"wrap",

}}

>

<div
style={{
display:"flex",
gap:16,
alignItems:"center",
}}
>

<div
style={{
width:48,
height:48,
borderRadius:14,
background:T.surfaceLow,
display:"flex",
alignItems:"center",
justifyContent:"center",
}}
>

<ShieldCheck
size={22}
color={T.slateGray}
/>

</div>

<div>

<h3
style={{
fontFamily:"Geist,sans-serif",
fontSize:16,
fontWeight:600,
}}
>

{item.title}

</h3>

<p
style={{
marginTop:8,
fontSize:14,
color:T.slateGray,
}}
>

{item.message}

</p>

<div
style={{
marginTop:10,
fontSize:12,
color:T.slateGray,
}}
>

{item.time}

</div>

</div>

</div>

<button
style={{
height:40,
padding:"0 18px",
border:`1px solid ${T.border}`,
background:T.white,
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

{notifications.length===0 && (

<Fade>

<div
style={{
marginTop:50,

background:T.white,

border:`1px solid ${T.border}`,

borderRadius:20,

padding:"60px 20px",

textAlign:"center",
}}
>

<Bell
size={56}
color={T.border}
/>

<h2
style={{
marginTop:20,
fontFamily:"Geist,sans-serif",
fontSize:24,
color:T.slate,
}}
>

You're all caught up!

</h2>

<p
style={{
marginTop:12,
color:T.slateGray,
lineHeight:1.7,
}}
>

No notifications found.

</p>

</div>

</Fade>

)}


<Fade delay={0.38}>

<div
style={{
background:T.white,
border:`1px solid ${T.border}`,
borderRadius:20,
padding:24,
marginTop:32,
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
flexWrap:"wrap",
gap:16,
marginBottom:24,
}}
>

<div>

<h2
style={{
fontFamily:"Geist,sans-serif",
fontSize:22,
fontWeight:600,
color:T.slate,
}}
>

Notification Settings

</h2>

<p
style={{
marginTop:6,
fontSize:13,
color:T.slateGray,
}}
>

Choose which notifications you want to receive.

</p>

</div>

<button
style={{
height:42,
padding:"0 18px",
border:"none",
background:T.slate,
color:T.white,
borderRadius:10,
cursor:"pointer",
fontWeight:600,
}}
>

Manage

</button>

</div>

<div
style={{
display:"grid",
gap:16,
}}
>

{[
["Booking Notifications",true],

["Payment Updates",true],

["Reviews & Ratings",true],

["Messages",true],

["Platform Announcements",false],

].map(([title,enabled])=>(

<div

key={title}

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

paddingBottom:16,

borderBottom:`1px solid ${T.border}`,

}}

>

<div>

<div
style={{
fontWeight:600,
color:T.slate,
}}
>

{title}

</div>

<div
style={{
marginTop:4,
fontSize:13,
color:T.slateGray,
}}
>

Receive alerts related to {title.toLowerCase()}.

</div>

</div>

<div
style={{
width:46,
height:26,
borderRadius:999,
background:enabled
?T.green
:T.border,
position:"relative",
cursor:"pointer",
transition:".25s",
}}
>

<div
style={{
position:"absolute",
top:3,
left:enabled
?24
:3,
width:20,
height:20,
borderRadius:"50%",
background:T.white,
transition:".25s",
}}
>

</div>

</div>

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

<Bell size={22}/>

</button>

)}

</div>
</div>

);

}
