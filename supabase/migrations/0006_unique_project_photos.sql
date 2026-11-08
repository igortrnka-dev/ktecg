-- Every project gets its own illustrative photo, none shared with the service or sector cards (2026-11-08).
-- Only rows still on the old seed photo change; a photo picked in the admin stays.

update projects set stock_photo = 'trade-welding' where slug = 'meyer-werft-cruise-ship-724' and stock_photo = 'sector-shipbuilding';
update projects set stock_photo = 'trade-electrical' where slug = 'robinson-alpenrose-zurs' and stock_photo = 'sector-buildings';
update projects set stock_photo = 'sector-logistics' where slug = 'shotton-mill-deeside' and stock_photo = 'sector-manufacturing';
update projects set stock_photo = 'service-leasing' where slug = 'disney-adventure-wismar' and stock_photo = 'division-electrical';
update projects set stock_photo = 'service-outages' where slug = 'mochovce-nuclear-power-plant-piping' and stock_photo = 'sector-energy';
update projects set stock_photo = 'trade-machining' where slug = 'ineos-project-one-antwerp' and stock_photo = 'sector-chemical';
update projects set stock_photo = 'sector-metalworking' where slug = 'orlen-unipetrol-vacuum-distillation-litvinov' and stock_photo = 'division-welding';
