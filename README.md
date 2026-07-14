# Scholar Junction — Modern Academic Community Platform

Premium SaaS — Inspired by LinkedIn • Notion • GitHub • Linear • Discord • Framer

Live landing: `index.html`

**Design System**
- Primary #2563EB • Secondary #7C3AED • Accent #22C55E
- Background #F8FAFC • Cards #FFFFFF • Text #0F172A • Secondary Text #64748B
- Typography: Inter + Poppins
- 16px border radius • Glassmorphism • Soft shadows • Gradient buttons
- Desktop 1440px • Responsive Tablet / Mobile

## Pages (20 total — each with separate HTML / CSS / JS)

1. **/** `index.html` — Landing Page  
   Hero: Connect. Learn. Collaborate. + Stats, Features, Communities, Events, Articles, Projects, AI Preview, Testimonials, FAQ, CTA
2. **/pages/login.html** — Split auth • Login / Register / Forgot • Social: Google / Microsoft / GitHub
3. **/pages/profile-setup.html** — 4-step wizard • Student / Teacher branching
4. **/pages/dashboard.html** — SaaS dashboard • Sidebar, Welcome, Events, Articles, Projects, AI Suggestions, Progress, Tasks, Calendar
5. **/pages/profile.html** — LinkedIn-style • Cover, avatar, About / Posts / Articles / Projects / Events / Certificates / Achievements / Skills
6. **/pages/knowledge-hub.html** — Medium-inspired • Search, categories, trending, featured, popular authors, editor preview
7. **/pages/forum.html** — Discord + Reddit • Categories, votes, tags, pinned
8. **/pages/events.html** — Calendar / Grid • Join, countdown, participants
9. **/pages/projects.html** — GitHub-inspired • stars, tech tags, demo / repo
10. **/pages/collaboration.html** — Team finder • skill matching • availability
11. **/pages/resources.html** — PDF / Videos / PPT / Books / Links • upload, bookmarks
12. **/pages/ai-assistant.html** — ChatGPT-inspired Scholar AI • templates, recent chats, summarize / study plan / career advice
13. **/pages/messages.html** — Discord-inspired • group chat, video / voice call
14. **/pages/notifications.html** — Today / Yesterday / This Week • read / unread
15. **/pages/settings.html** — Profile / Security / Password / Notifications / Appearance / Theme / Language / Privacy / Connected Accounts / Delete
16. **/pages/create-article.html** — Rich text editor • LaTeX, images, video, tags, preview
17. **/pages/create-event.html** — Title, description, date/time, location, online link, banner, max participants
18. **/pages/create-project.html** — GitHub + demo links, tech stack, team, hiring
19. **/pages/admin.html** — Analytics dashboard • Users / Events / Articles / Projects • charts
20. **/pages/about.html** — Mission, Vision, Story, Values, Team, Timeline, Partners, CTA

## File Structure
```
/index.html
/assets/
  css/
    tokens.css
    global.css
    landing.css
    login.css
    profile-setup.css
    dashboard.css
    profile.css
    knowledge-hub.css
    forum.css
    events.css
    projects.css
    collaboration.css
    resources.css
    ai-assistant.css
    messages.css
    notifications.css
    settings.css
    create-article.css
    create-event.css
    create-project.css
    admin.css
    about.css
  js/
    app.js
    landing.js
    login.js
    ... (1 per page)
  img/
    logo.png  ← Scholar Junction phoenix logo
/pages/
  login.html
  profile-setup.html
  dashboard.html
  ... (all 19 app pages)
```

Every page includes:
- Global Header / Footer
- Responsive Navigation
- Notification Icon • Message Icon • Profile Avatar
- Breadcrumb where applicable
- 80×80 logo placeholder replaced with actual Scholar Junction logo

Built vanilla HTML/CSS/JS — no build step. Open `index.html` to start.
