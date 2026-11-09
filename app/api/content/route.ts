import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { defaultContent } from "@/lib/defaults";
export const dynamic = "force-dynamic";
export async function GET() {
  const {data,error}=await supabase.from("site_content").select("key,value");
  if(error) return NextResponse.json(defaultContent);
  const saved=Object.fromEntries((data||[]).map((r:any)=>[r.key,r.value]));
  return NextResponse.json({...defaultContent,...saved,site:{...defaultContent.site,...(saved.site||{})}});
}
