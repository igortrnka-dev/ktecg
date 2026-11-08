-- The three shipbuilding projects get shipyard photos (2026-11-08). Only rows still on the previous photo change.

update projects set stock_photo = 'project-ship-2' where slug = 'meyer-werft-cruise-ship-724' and stock_photo = 'trade-welding';
update projects set stock_photo = 'project-ship-3' where slug = 'electrical-installation-european-projects' and stock_photo = 'sector-electrical';
update projects set stock_photo = 'project-ship-1' where slug = 'disney-adventure-wismar' and stock_photo = 'service-leasing';
