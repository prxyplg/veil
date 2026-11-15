// Hand-drawn, layered animal emblems. IDs remain stable for existing profiles.
const shape=(d,opacity=1)=>`<path d="${d}" fill="currentColor" fill-opacity="${opacity}"/>`;
const line=d=>`<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
const light=d=>`<path d="${d}" fill="#f7f5fa"/>`;
const dark=d=>`<path d="${d}" fill="#17151e"/>`;
const eyes=(y=32,gap=11)=>`<ellipse cx="${32-gap}" cy="${y}" rx="2.5" ry="3" fill="#17151e"/><ellipse cx="${32+gap}" cy="${y}" rx="2.5" ry="3" fill="#17151e"/><circle cx="${31.3-gap}" cy="${y-.9}" r=".8" fill="#fff"/><circle cx="${31.3+gap}" cy="${y-.9}" r=".8" fill="#fff"/>`;
const muzzle=(y=43)=>dark(`M28 ${y}Q32 ${y-2} 36 ${y}Q36 ${y+3} 32 ${y+5}Q28 ${y+3} 28 ${y}Z`)+`<path d="M32 ${y+5}v3m-6 0q3 4 6 0 3 4 6 0" fill="none" stroke="#17151e" stroke-width="1.8" stroke-linecap="round"/>`;
const roundHead=shape('M9 31C9 14 55 14 55 31v12C55 62 9 62 9 43Z',.85);
const svg=body=>'<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">'+body+'</svg>';
export const animals=[
 ['fox','Fox',
 shape('M8 30 5 4Q18 7 24 17h16Q47 7 59 4l-3 26 4 10-13 13-15 9-15-9L4 40Z',.65)+dark('M10 11 13 28 22 20ZM54 11 42 20 51 28Z')+light('M8 36Q22 36 32 48 42 36 56 36L45 51 32 59 19 51Z')+eyes(31,13)+muzzle(45)],
 ['cat','Cat',
 shape('M10 31 8 5 25 16h14L56 5l-2 26v11C54 62 10 62 10 42Z',.85)+dark('m13 13 2 14 9-8Zm38 0-11 6 9 8Z')+eyes(33,11)+light('M22 42q10-8 20 0v10H22Z')+muzzle(42)+line('M4 39 19 42M3 47l16-1m42-7-16 3m17 5-16-1')],
 ['dog','Dog',
 shape('M16 14Q32 2 48 14l6 20-7 19q-15 12-30 0L10 34Z',.8)+shape('M19 12C3 8 1 25 4 43q7 6 14-6L22 19Zm26 0c16-4 18 13 15 31q-7 6-14-6L42 19Z',1)+light('M25 14h14l-2 22q14 2 11 13-16 17-32 0-3-11 11-13Z')+eyes(31,9)+muzzle(39)+shape('M28 52h8v5q-4 7-8 0Z',.65)],
 ['wolf','Wolf',
 shape('M9 27 10 3 26 14h12L54 3l1 24 6 11-10-2 5 10-12 3-12 13-12-13-12-3 5-10-10 2Z',.7)+dark('m15 12 2 13 9-7Zm34 0-11 6 9 7Z')+light('M14 37q10 0 18 8 8-8 18-8l-8 13-10 9-10-9Z')+eyes(32,11)+dark('m17 26 12 3-3 3-10-3Zm30 0-12 3 3 3 10-3Z')+muzzle(44)],
 ['bear','Bear',
 shape('M19 14a9 9 0 1 1-15 5A9 9 0 0 1 19 14Zm26 0a9 9 0 1 0 15 5 9 9 0 0 0-15-5Z',.9)+dark('M9 14a4 4 0 1 0 6 5 4 4 0 0 0-6-5Zm46 0a4 4 0 1 1-6 5 4 4 0 0 1 6-5Z')+roundHead+eyes(32,11)+light('M19 43c0-12 26-12 26 0v7c0 12-26 12-26 0Z')+muzzle(40)],
 ['panda','Panda',
 shape('M20 13a10 10 0 1 1-18 6 10 10 0 0 1 18-6Zm24 0a10 10 0 1 0 18 6 10 10 0 0 0-18-6Z',.65)+light('M9 29C9 7 55 7 55 29v14C55 65 9 65 9 43Z')+dark('M17 25c7-6 14 3 10 10s-16 7-15-1q0-5 5-9Zm30 0c-7-6-14 3-10 10s16 7 15-1q0-5-5-9Z')+'<circle cx="22" cy="30" r="2" fill="#fff"/><circle cx="42" cy="30" r="2" fill="#fff"/>'+muzzle(42)],
 ['rabbit','Rabbit',
 shape('M17 29C5-5 26-10 27 25h10C38-10 59-5 47 29Z',.8)+light('M18 22C13 3 20 0 22 22Zm24 0c2-22 9-19 4 0Z')+shape('M10 38C10 15 54 15 54 38v7c0 23-44 23-44 0Z',.9)+eyes(36,11)+light('M23 49h18v11H23Z')+dark('M31 50h2v10h-2Z')+muzzle(44)],
 ['tiger','Tiger',
 shape('M18 15a8 8 0 1 0-13 9Zm28 0a8 8 0 1 1 13 9Z',.9)+roundHead+dark('M29 13h6l-3 13Zm-14 4 11 6-3 4-10-7Zm34 0-11 6 3 4 10-7ZM9 32l12 5-12 2Zm1 13 12-3-9 8Zm45-13-12 5 12 2Zm-1 13-12-3 9 8Z')+eyes(32,10)+light('M18 44q7-8 14-2 7-6 14 2v7q-14 15-28 0Z')+muzzle(42)],
 ['lion','Lion',
 shape('M32 2 40 7 50 6l3 10 8 6-4 10 4 10-8 6-3 10-10-1-8 6-8-6-10 1-3-10-8-6 4-10-4-10 8-6 3-10 10 1Z',.55)+shape('M16 22C12 5 27 10 28 16h8c1-6 16-11 12 6v18c0 26-32 26-32 0Z')+light('M22 41q10-7 20 0v10q-10 10-20 0Z')+eyes(31,9)+muzzle(40)],
 ['frog','Frog',
 shape('M7 27C-7 5 23-6 27 20h10C41-6 71 5 57 27q7 24-25 32Q0 51 7 27Z',.85)+'<circle cx="16" cy="17" r="9" fill="#f7f5fa"/><circle cx="48" cy="17" r="9" fill="#f7f5fa"/><circle cx="16" cy="18" r="4" fill="#17151e"/><circle cx="48" cy="18" r="4" fill="#17151e"/>'+dark('M13 38q19 17 38 0-19 26-38 0Z')+light('M16 39q16 11 32 0-16 16-32 0Z')],
 ['penguin','Penguin',
 '<path d="M16 18C16-4 48-4 48 18l5 19 7 9-10-2q-2 16-18 16T14 44L4 46l7-9Z" fill="#272430" stroke="currentColor" stroke-width="1"/>'+light('M18 23C12 4 29 8 32 18 35 8 52 4 46 23l1 21c0 17-30 17-30 0Z')+eyes(22,9)+dark('m26 29 6-5 6 5-6 7Z')+shape('M17 55 11 62h17l-1-7Zm30 0 6 7H36l1-7Z')],
 ['koala','Koala',
 shape('M24 21C23-3 0-1 1 22c0 14 17 16 23 6Zm16 0C41-3 64-1 63 22c0 14-17 16-23 6Z',.65)+light('M15 14C5 7 3 27 15 27Zm34 0c10-7 12 13 0 13Z')+shape('M15 27C15 9 49 9 49 27v15c0 25-34 25-34 0Z',.9)+eyes(31,10)+dark('M25 34c0-13 14-13 14 0v9q-7 8-14 0Z')+'<path d="M27 51q5 4 10 0" stroke="#17151e" stroke-width="2" stroke-linecap="round"/>'],
 ['raccoon','Raccoon',
 shape('M11 25 9 7q12-2 17 10h12Q43 5 55 7l-2 18 7 12-13 18-15 7-15-7L4 37Z',.65)+dark('m15 12 3 12 7-5Zm34 0-10 7 7 5Z')+light('M12 30q20-14 40 0L47 50 32 60 17 50Z')+dark('M10 31q12-9 22 1 10-10 22-1l-4 11q-10 2-18-5-8 7-18 5Z')+'<circle cx="22" cy="34" r="2" fill="#fff"/><circle cx="42" cy="34" r="2" fill="#fff"/>'+muzzle(45)],
 ['otter','Otter',
 shape('M17 22a7 7 0 1 0-12 5Zm30 0a7 7 0 1 1 12 5Z',.8)+shape('M8 31C8 7 56 7 56 31v11C56 65 8 65 8 42Z',.8)+light('M13 39q6-12 19-4 13-8 19 4v8q-19 22-38 0Z')+eyes(29,11)+muzzle(37)+line('M2 39 17 42M3 48l14-2m45-7-15 3m14 6-14-2')],
].map(([id,name,body])=>({id,name,icon:svg(body)}));
export const ANIMAL_IDS=animals.map(a=>a.id);
export function assignAnimal(profile,random=Math.random){
 if(profile.avatar&&ANIMAL_IDS.includes(profile.avatar))return profile;
 const index=Math.min(animals.length-1,Math.max(0,Math.floor(random()*animals.length)));
 return {...profile,avatar:ANIMAL_IDS[index]};
}
