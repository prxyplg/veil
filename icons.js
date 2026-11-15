export const tierIcons = {
  banned:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m6 6 12 12" stroke-linecap="round"/></svg>',
  unverified: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2 3"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/><path d="M7 17c1-4 9-4 10 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  member: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3c3 2 6 2 8 3v6c0 5-5 8-8 9-3-1-8-4-8-9V6c2-1 5-1 8-3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m8 12 3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  premium: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 6c1 4 2 5 6 6-4 1-5 2-6 6-1-4-2-5-6-6 4-1 5-2 6-6Z" fill="currentColor" stroke="currentColor" stroke-linejoin="round"/></svg>',
  owner: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 16 3 7l5 4 4-7 4 7 5-4-2 9H5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};



const svg = content => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+content+'</svg>';
export const personIcon=svg('<circle cx="12" cy="6.8" r="3.4"/><path d="M5 21v-2c0-3 3-5 7-5s7 2 7 5v2H5Z" fill="currentColor" fill-opacity=".12"/>');
export const closeIcon=svg('<path d="m7 7 10 10M17 7 7 17"/>');
export const badgeIcons={
 advertiser:svg('<path d="M3 9h5l11-5v16L8 15H3V9Zm5 6 2 6h4l-2-5M22 9v6"/>'),
 admin:svg('<path d="m3 5 3-3 6 6-3 3-6-6Zm7 5 10 10M21 3l-3 3-3-3a5 5 0 0 0-2 6L3 19a1.5 1.5 0 0 0 2 2L15 11a5 5 0 0 0 6-8Z"/>'),
 helper:svg('<path d="M8 15c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7H8Zm0 3h8m-6 3h4M9 8l3 3 3-3m-3 3v4"/>'),
 'bug-tester':svg('<ellipse cx="12" cy="14" rx="7" ry="8" fill="currentColor" fill-opacity=".1"/><path d="M8 7V5a4 4 0 0 1 8 0v2m-4 0v15M5 11 2 9m3 6H2m4 4-3 2m16-10 3-2m-3 6h3m-4 4 3 2"/><circle cx="9" cy="12" r=".8" fill="currentColor"/><circle cx="15" cy="12" r=".8" fill="currentColor"/><circle cx="9" cy="17" r=".8" fill="currentColor"/><circle cx="15" cy="17" r=".8" fill="currentColor"/>'),
 friend:svg('<path d="M12 21S3 15 3 8a5 5 0 0 1 9-2 5 5 0 0 1 9 2c0 7-9 13-9 13Z" fill="currentColor" fill-opacity=".13"/>'),
 'early-access':svg('<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1 3-6Z" fill="currentColor" fill-opacity=".13"/>'),
 donor:svg('<path d="M8 3h8l-2 5c5 4 8 8 6 12-1 3-15 3-16 0-2-4 1-8 6-12L8 3Zm1 5h6m-3 4v8m2-7h-3a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3h-3"/>'),
 artist:svg('<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4c-2-1-1-3 1-3h3c6 0 3-11-6-11Z"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="7" r="1" fill="currentColor"/><circle cx="14" cy="7" r="1" fill="currentColor"/><circle cx="18" cy="10" r="1" fill="currentColor"/>')
};
export const badgeDetails={
 advertiser:{name:'Advertiser',summary:'Helped advertise Veil.',meaning:'Recognizes people who introduce Veil to others and help the community grow.',how:'Share Veil responsibly, then show the owner where you promoted it. The owner decides when to award it.'},
 admin:{name:'Admin',summary:'Helped with development.',meaning:'Recognizes contributions to Veil’s code, features, fixes, or technical setup. The badge is recognition, not access to the master menu.',how:'Contribute a useful development improvement and have the owner review your work.'},
 helper:{name:'Helper',summary:'Gave feedback for future updates.',meaning:'Recognizes thoughtful suggestions that help shape future versions of Veil.',how:'Send the owner clear, constructive feedback or a feature idea with an explanation of how it would help.'},
 'bug-tester':{name:'Bug tester',summary:'Submitted a bug report.',meaning:'Recognizes people who find and report problems so Veil can improve.',how:'Send the owner a reproducible bug report: what happened, what you expected, and the steps to repeat it.'},
 friend:{name:'Friend',summary:'A friend of the owner.',meaning:'A personal badge given by the owner to their friends.',how:'The owner awards this personally. It is not a purchasable membership benefit.'},
 'early-access':{name:'Early access',summary:'Got access to beta versions of Veil.',meaning:'Recognizes people invited to try Veil before a general release.',how:'Join an owner-organized beta and receive early access to a test version.'},
 donor:{name:'Donor',summary:'Donated to Veil’s development.',meaning:'Recognizes a donation made to support the development of Veil. This badge does not change membership or unlock paid features.',how:'Arrange a donation directly with the owner. The owner can award the badge after confirming it.'},
 artist:{name:'Artist',summary:'Helped with effects and animations.',meaning:'Recognizes creative contributions such as visual effects, animations, icons, or other artwork used in Veil.',how:'Share original visual work with the owner and have a contribution accepted for Veil.'}
};

export const navIcons={
 home:svg('<path d="m3 10 9-7 9 7M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M9 21v-7h6v7"/>'),
 launcher:svg('<path d="M10 15c-2-4 2-10 10-12 1 8-3 13-7 14l-3-2Zm1-5-5 1-3 5 7-1m6-1-1 6-5 1 1-5M7 18l-3 3m2-5-3 3"/><circle cx="16" cy="8" r="2"/>'),
 activity:svg('<path d="M4 3v16a2 2 0 0 0 2 2h15M8 16v-5m5 5V6m5 10V9"/>'),
 badges:svg('<circle cx="12" cy="9" r="6"/><path d="m8 14-2 7 6-3 6 3-2-7m-6-5 1.5 1.5L14 7"/>'),
 membership:svg('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M6 16c0-3 6-3 6 0m3-7h3m-3 4h3"/>'),
 appearance:svg('<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4c-2-1-1-3 1-3h3c6 0 3-11-6-11Z"/><circle cx="7" cy="12" r=".8" fill="currentColor"/><circle cx="9" cy="7" r=".8" fill="currentColor"/><circle cx="14" cy="7" r=".8" fill="currentColor"/><circle cx="18" cy="10" r=".8" fill="currentColor"/>'),
 settings:svg('<path d="M4 7h4m4 0h8M4 17h8m4 0h4"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/>')
};
