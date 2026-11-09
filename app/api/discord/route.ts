import { NextRequest, NextResponse } from "next/server";
import { verifyKey } from "discord-interactions";
import { supabase } from "@/lib/supabase";
import { defaultContent } from "@/lib/defaults";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const EPHEMERAL = 64;
async function readKey(key:string) {
  const {data}=await supabase.from("site_content").select("value").eq("key",key).maybeSingle();
  return data?.value ?? (defaultContent as any)[key];
}
async function writeKey(key:string,value:any) {
  const {error}=await supabase.from("site_content").upsert({key,value},{onConflict:"key"});
  if(error) throw error;
}
function reply(content:string) { return NextResponse.json({type:4,data:{content,flags:EPHEMERAL}}); }
export async function POST(req:NextRequest) {
  const raw=await req.text();
  const signature=req.headers.get("x-signature-ed25519")||"";
  const timestamp=req.headers.get("x-signature-timestamp")||"";
  const publicKey=process.env.DISCORD_PUBLIC_KEY||"";
  if(!publicKey || !verifyKey(raw,signature,timestamp,publicKey)) return new NextResponse("Invalid request signature",{status:401});
  const interaction=JSON.parse(raw);
  if(interaction.type===1) return NextResponse.json({type:1});
  const member=interaction.member?.permissions;
  const canManage=member && (BigInt(member)&BigInt(0x8))===BigInt(0x8);
  if(!canManage) return reply("You need Discord **Administrator** permission to edit the website.");
  const command=interaction.data?.name;
  const opts=interaction.data?.options||[];
  const get=(name:string)=>opts.find((x:any)=>x.name===name)?.value;
  try {
    if(command==="schedule-add") {
      const schedule=await readKey("schedule")||[];
      const day=get("day");
      const entry={day,title:get("event"),time:get("time")||"",location:get("location")||"",details:get("details")||""};
      const existing=schedule.findIndex((x:any)=>x.day.toLowerCase()===day.toLowerCase());
      if(existing>=0) schedule[existing]=entry; else schedule.push(entry);
      schedule.sort((a:any,b:any)=>["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(a.day)-["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(b.day));
      await writeKey("schedule",schedule);
      return reply(`Added **${get("event")}** to **${get("day")}**. Refresh the website to see it.`);
    }
    if(command==="schedule-remove") {
      const schedule=await readKey("schedule")||[];
      const day=get("day");
      const next=schedule.filter((x:any)=>x.day.toLowerCase()!==day.toLowerCase());
      await writeKey("schedule",next);
      return reply(next.length===schedule.length?`No schedule entry found for ${day}.`:`Removed the ${day} schedule entry.`);
    }
    if(command==="site-update") {
      const site=await readKey("site")||defaultContent.site;
      for(const key of ["team-name","tagline","discord-url"]) if(get(key)) site[key==="team-name"?"teamName":key==="tagline"?"tagline":"discordUrl"]=get(key);
      await writeKey("site",site);
      return reply("Website details updated.");
    }
    if(command==="announcement") {
      const items=await readKey("announcements")||[];
      items.unshift({title:get("title"),body:get("message"),date:new Date().toLocaleDateString("en-US")});
      await writeKey("announcements",items.slice(0,6));
      return reply("Announcement published to the website.");
    }
    if(command==="team-add") {
      const team=await readKey("team")||[];
      team.push({name:get("name"),role:get("role"),callsign:get("callsign")||"FLIGHT CREW"});
      await writeKey("team",team);
      return reply(`Added **${get("name")}** to the team page.`);
    }
    if(command==="team-remove") {
      const team=await readKey("team")||[];
      const next=team.filter((x:any)=>x.name.toLowerCase()!==String(get("name")).toLowerCase());
      await writeKey("team",next);
      return reply(next.length===team.length?"Couldn't find that team member.":"Removed the team member.");
    }
    return reply("Unknown command.");
  } catch(e:any) { console.error(e); return reply("Something went wrong saving that change. Check the Supabase setup and logs."); }
}
