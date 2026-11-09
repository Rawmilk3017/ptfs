import { supabase } from "@/lib/supabase";
import { defaultContent } from "@/lib/defaults";

export const revalidate = 0;
async function getContent() {
  try {
    const {data,error} = await supabase.from("site_content").select("key,value");
    if (error || !data?.length) return defaultContent;
    const saved = Object.fromEntries(data.map((x:any)=>[x.key,x.value]));
    return {...defaultContent,...saved,site:{...defaultContent.site,...(saved.site||{})}};
  } catch { return defaultContent; }
}
export default async function Home() {
  const content:any = await getContent();
  const site=content.site||defaultContent.site;
  const schedule=content.schedule||defaultContent.schedule;
  const team=content.team||defaultContent.team;
  const announcements=content.announcements||[];\n  const discordUrl=site.discordUrl||"https://discord.com";
  return <main>
    <header className="nav">
      <a className="brand" href="#"><span className="wing">✦</span><span>{site.logoText||"PTFS FLIGHT TEAM"}</span></a>
      <nav><a href="#schedule">Schedule</a><a href="#about">About</a><a href="#team">The Team</a><a href="#news">News</a><a href="#contact">Contact</a></nav>
      <a className="discord" href={discordUrl} target="_blank">Join Discord ↗</a>
    </header>
    <section className="hero" style={{backgroundImage:`linear-gradient(90deg,rgba(3,13,28,.92),rgba(3,13,28,.38)),url("${site.heroImage}")`}}>
      <div className="heroCopy"><div className="eyebrow">{site.eyebrow}</div><h1>{site.teamName}</h1><div className="sub">PTFS FLIGHT TEAM</div><p>{site.tagline}</p><a className="primary" href="#schedule">VIEW FLIGHT SCHEDULE <span>→</span></a></div>
      <div className="heroStamp"><span>PTFS</span><b>FLIGHT<br/>OPERATIONS</b><small>PRECISION IN EVERY FORMATION</small></div>
    </section>
    <section id="schedule" className="section scheduleSection"><div className="sectionHead"><div><span className="eyebrow red">FLIGHT OPERATIONS</span><h2>Weekly Schedule</h2></div><span className="sectionNote">ALL TIMES {site.timezone||"CST"}</span></div>
      <div className="scheduleGrid">{schedule.map((event:any,i:number)=><article className="dayCard" key={i}><div className="day">{event.day}</div><div className="redline"/><h3>{event.title}</h3>{event.title?.toLowerCase().includes("no event")?<p className="muted">No scheduled events</p>:<div className="eventInfo">{event.time&&<p>◷ <span>{event.time}</span></p>}{event.location&&<p>⌖ <span>{event.location}</span></p>}{event.details&&<p className="details">{event.details}</p>}</div>}<div className="watermark">✦</div></article>)}</div>
    </section>
    <section id="about" className="about section"><div><span className="eyebrow red">WHO WE ARE</span><h2>Built on precision.<br/><i>Driven by teamwork.</i></h2></div><p>We are a PTFS flight team focused on disciplined formation flying, coordinated training, and memorable public airshows. Whether you're watching from the ground or flying alongside us, you're part of the experience.</p></section>
    <section id="team" className="section teamSection"><div className="sectionHead"><div><span className="eyebrow red">THE FLIGHT LINE</span><h2>Meet the Team</h2></div></div><div className="teamGrid">{team.map((member:any,i:number)=><article className="member" key={i}><div className="memberIcon">✦</div><span>{member.callsign||"FLIGHT CREW"}</span><h3>{member.name}</h3><p>{member.role}</p></article>)}</div></section>
    <section id="news" className="section newsSection"><div className="sectionHead"><div><span className="eyebrow red">LATEST UPDATES</span><h2>Team News</h2></div></div><div className="newsGrid">{announcements.map((item:any,i:number)=><article className="newsCard" key={i}><span className="eyebrow red">{item.date||"TEAM ANNOUNCEMENT"}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
    <section id="contact" className="contact"><span className="eyebrow">READY FOR TAKEOFF?</span><h2>Fly with the team.</h2><p>Join our Discord to ask questions, attend events, or apply to become a pilot.</p><a className="primary" href={discordUrl} target="_blank">JOIN OUR DISCORD ↗</a></section>
    <footer><div><b>{site.teamName}</b><span>{site.footer}</span></div><small>UNOFFICIAL PTFS COMMUNITY TEAM WEBSITE • NOT AFFILIATED WITH THE U.S. AIR FORCE</small></footer>
  </main>;
}
