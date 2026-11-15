export const achievements = [
 ...[[1,'First flight'],[5,'Getting started'],[10,'Frequent flyer'],[25,'Route regular'],[50,'Launch specialist'],[100,'Launch legend']].map(([goal,title],i)=>({id:'launch-'+goal,title,goal,metric:'launches',icon:'launcher',description:`Launch ${goal} ${goal===1?'proxy':'proxies'}.`})),
 ...[[5,'A little time'],[15,'Settling in'],[30,'Half-hour club'],[60,'One hour in'],[180,'Time well spent'],[600,'Ten-hour club']].map(([goal,title])=>({id:'time-'+goal,title,goal,metric:'minutes',icon:'activity',description:`Spend ${goal<60?goal+' active minutes':goal/60+' active '+(goal===60?'hour':'hours')} in Veil.`})),
 ...[[2,'Back again'],[3,'Three-day rhythm'],[5,'Keeping it going'],[7,'A full week'],[14,'Two-week streak'],[30,'Thirty-day dedication']].map(([goal,title])=>({id:'streak-'+goal,title,goal,metric:'streak',icon:'achievements',description:`Reach a ${goal}-day activity streak.`})),
 ...[
 ['site-one','Link collector','sites',1,'sites','Copy your first site link.'],
 ['site-five','Curious browser','sites',5,'sites','Copy links from 5 different sites.'],
 ['site-ten','Library explorer','sites',10,'sites','Copy links from 10 different sites.'],
 ['site-all','Full library','sites',20,'sites','Copy links from all 20 sites.'],
 ['route-three','Triple route','routes',3,'launcher','Launch 3 different routes.'],
 ['route-ten','Pathfinder','routes',10,'launcher','Launch 10 different routes.'],
 ['route-all','Every avenue','routes',32,'launcher','Launch all 32 different routes.'],
 ['page-five','Looking around','pages',5,'info','Visit 5 different Veil pages.'],
 ['page-all','Know your hub','pages',13,'info','Visit all 13 Veil pages.'],
 ['color-three','Color curious','colors',3,'appearance','Try 3 different accent colors.'],
 ['color-all','Full spectrum','colors',9,'appearance','Try all 9 colored accents.'],
 ['font-three','Type explorer','fonts',3,'appearance','Try 3 different fonts.'],
 ['font-all','Typography fan','fonts',6,'appearance','Try all 6 fonts.'],
 ['wallpaper-three','Scene changer','wallpapers',3,'appearance','Try 3 animated wallpapers.'],
 ['wallpaper-all','World builder','wallpapers',8,'appearance','Try all 8 animated wallpapers.'],
 ['trail-three','Making tracks','trails',3,'appearance','Try 3 cursor trails.'],
 ['trail-all','Trail collector','trails',8,'appearance','Try all 8 cursor trails.'],
 ['export-one','Safe keeping','exports',1,'settings','Export your Veil data.']
 ].map(([id,title,metric,goal,icon,description])=>({id,title,metric,goal,icon,description}))
];

export function achievementProgress(achievement,stats,discoveries={}){
 const value=achievement.metric==='minutes'?(Number(stats.activeMs)||0)/60000:achievement.metric==='streak'?Number(stats.bestStreak)||0:achievement.metric==='launches'?Number(stats.launches)||0:achievement.metric==='exports'?Number(discoveries.exports)||0:Array.isArray(discoveries[achievement.metric])?discoveries[achievement.metric].length:0;
 return Math.min(achievement.goal,Math.max(0,value));
}

export function cleanHistory(value){
 return (Array.isArray(value)?value:[]).filter(e=>typeof e?.name==='string'&&e.name.trim()&&Number.isFinite(e.at)&&e.at>0).map(e=>({name:e.name.trim().slice(0,120),at:e.at,mode:e.mode==='quick'?'quick':'rotation'})).sort((a,b)=>b.at-a.at).slice(0,500);
}

export const helpQuestions = [
 ['What is Veil?','Veil is a personal proxy launchpad with a rotating route pool, a curated Sites library, and a locally saved profile. It organizes links; the proxies themselves are separate services.'],
 ['How do I activate or change my membership?','Open Membership and enter your key under Already have a key? A valid key replaces your current tier. Your name, badges, and saved preferences stay in this browser. To buy a key, use Buy Member or Buy Premium and contact the owner.'],
 ['What do Member and Premium include?','Member costs $1 lifetime and includes three routes plus colors, fonts, and glow controls. Premium costs $5 lifetime and adds all 32 routes, Quick launch, eight animated wallpapers, and eight cursor trails. Owner has Premium access too.'],
 ['How does rotation work?','Launch proxy chooses from the routes enabled for your membership. Every route is used once per cycle, avoiding consecutive repeats. Only the switch on a route card excludes it; clicking the rest of the card does nothing.'],
 ['What does Quick launch do?','Premium and Owner users can launch a specific route with its Quick launch button, even when it is excluded from random rotation. Other tiers see a shaded button that explains how to purchase Premium.'],
 ['Why did a proxy not open or show a blank frame?','Allow popups for Veil and try again. Proxies open inside an about:blank window; some services prevent embedding or are temporarily unavailable. Try another route if the service cannot load inside the frame.'],
 ['How do I use the Sites page?','Click a site tile to copy its address, launch a Veil proxy, then paste the address into the proxy’s own address bar. If clipboard access is blocked, the popup provides a link you can select and copy manually.'],
 ['Where are my profile, achievements, and history saved?','They are saved in local storage for this browser and site address. They do not sync across devices or browsers. Clearing site data removes them. History keeps up to 500 launches; achievements remain earned when statistics are reset.'],
 ['How do activity, streaks, and achievements work?','Active time counts while Veil is visible, focused, and used within the last minute. Streaks follow your local calendar. Achievements recognize launches, active time, streaks, exploration, customization, and exports. Old statistics count toward achievements; only the last known launch can be recovered from before History was added.']
].map(([title,description])=>({title,description}));
