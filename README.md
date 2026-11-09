# PTFS Flight Team Website + Discord Integration

A responsive PTFS team website inspired by the reference screenshot, with schedule, team roster, announcements, and Discord slash commands for editing site content.

## Stack
- Next.js website (deploy to Vercel)
- Supabase Postgres JSON content store
- Discord Interactions endpoint (slash commands; no always-on bot process required)

## 1. Create the database
1. Create a free project at https://supabase.com.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In Project Settings → API, copy the Project URL, anon/public key, and service_role key.

## 2. Configure Discord
1. In https://discord.com/developers/applications create an application and add a bot.
2. Copy the Application ID, Bot Token, and General Information → Public Key.
3. Enable the bot's presence in your server only if desired; the commands work through Discord Interactions.
4. Add a Guild ID by enabling Developer Mode in Discord, then right-click your server → Copy Server ID.
5. In the app's **General Information**, set **Interactions Endpoint URL** to `https://YOUR-VERCEL-DOMAIN/api/discord` after deployment. Discord validates this URL.
6. Invite the app to your server with the `applications.commands` scope and no extra permissions required. The slash commands check for Administrator permission.

## 3. Deploy the website to Vercel
1. Upload this project to a GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Add the variables from `.env.example` in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DISCORD_APPLICATION_ID`
   - `DISCORD_PUBLIC_KEY`
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_GUILD_ID`
4. Deploy. Copy your live Vercel domain.

## 4. Register slash commands
On a computer with Node.js installed:
```bash
npm install
# Put the Discord variables in your local .env.local (copy .env.example)
npm run register-commands
```
This registers the commands in the one Discord server whose ID is in `DISCORD_GUILD_ID`. For local testing, set `DISCORD_GUILD_ID` to your test server. After the commands are registered, you can use them in that server.

## Discord commands
All commands require the user invoking them to have the Discord **Administrator** permission:
- `/schedule-add day event time location details`
- `/schedule-remove day`
- `/site-update team-name tagline discord-url`
- `/announcement title message`
- `/team-add name role callsign`
- `/team-remove name`

Changes save to Supabase and show on the website after refresh/revalidation. `site-update` saves a Discord invite URL, but change the hard-coded Discord links in `app/page.tsx` to read `site.discordUrl` if you want the button to use the configured invite; this is an easy next customization.

## Customize
- Change starter schedule and text in `lib/defaults.ts`.
- Change colors, spacing, typography, and mobile layout in `app/globals.css`.
- Replace the default aircraft hero background URL in the Supabase `site` row or `lib/defaults.ts` with an image you have permission to use.
- The U.S. Air Force / Thunderbirds marks in the reference are not included. This starter uses generic PTFS team branding so you can add your own team logo.

## Important
- Keep the Supabase service-role key and Discord bot token private. Do not put them in client-side code or commit `.env.local`.
- This is a starter build. Set your real team name, schedule, Discord invite, roster, and imagery before publishing.
