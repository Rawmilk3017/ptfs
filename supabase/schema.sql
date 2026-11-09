create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
-- The website reads through the server using the service-role key.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in NEXT_PUBLIC_* variables.
insert into public.site_content(key,value) values
('site','{"teamName":"THUNDERBIRDS","eyebrow":"PTFS FLIGHT TEAM","tagline":"DISCIPLINE • PRECISION • EXCELLENCE","footer":"YOUR TEAM. YOUR SKY.","timezone":"CST","heroImage":"https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=2200&q=85","logoText":"PTFS FLIGHT TEAM"}'::jsonb),
('schedule','[{"day":"Monday","title":"Practice","time":"7:00 PM CST","location":"","details":"Formation training"},{"day":"Tuesday","title":"No Events","time":"","location":"","details":""},{"day":"Wednesday","title":"Practice","time":"7:00 PM CST","location":"","details":"Formation training"},{"day":"Thursday","title":"No Events","time":"","location":"","details":""},{"day":"Friday","title":"Practice","time":"7:00 PM CST","location":"","details":"Formation training"},{"day":"Saturday","title":"Airshow","time":"2:00 PM CST","location":"Greater Rockford","details":"Public airshow"},{"day":"Sunday","title":"Airshow","time":"2:00 PM CST","location":"Greater Rockford","details":"Public airshow"}]'::jsonb),
('team','[{"name":"Team Commander","role":"Commander","callsign":"THUNDER 1"},{"name":"Deputy Commander","role":"Deputy Commander","callsign":"THUNDER 2"},{"name":"Pilot Name","role":"Pilot","callsign":"THUNDER 3"}]'::jsonb),
('announcements','[{"title":"Welcome to the team","body":"Check the schedule for upcoming practices and public airshows.","date":"TEAM ANNOUNCEMENT"}]'::jsonb)
on conflict(key) do nothing;
