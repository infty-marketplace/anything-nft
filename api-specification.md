# INFTY

## Database

nft, album, user, draw, joint_ownership
NFT:{...., "share smart contract address": , "draw smart contract"}

## Parameters Types

String: id, address, currency, file(for now, base64 image)
Float: price, commission, percentage
Int: deadline, any timestamp related

## API Routes

### /api/auth

-   method: post
-   parameters:
    -   address
-   description: create a logged in session at the backend

### /api/update-profile

-   method: post
-   parameters:
    -   first_name (optioanl, required upon creation)
    -   last_name (optional)
    -   description (optional)
    -   profile_picture (optional)
-   description: create/update the profile information of a user

### /api/profile/:address

-   method: get
-   description: return profile information, including display name, collections, personal signature, etc. anything in profile page should be returned.
-   return: {"name": "Will", "nft_ids": ["nft id1", ...], "album_ids":[...]}

### /api/nft/:nft_id

-   method: get
-   description: return the NFT information based on the NFT id.
-   return: {"title": "my NFT", "description": "good", "file":"binary string", "price": 100.5, "currency":"cfx", "percentage": 0.65, "album_id":"xxx", "owner": "cfx:dsfawe"}

### /api/album/:album_id

-   method: get
-   description: return the NFT information based on the NFT id.
-   return: {"title": "my NFT", "description": "good", "file":"binary string", "price": 100.5, "currency":"cfx", "percentage": 0.65, "nft_ids": [...], "owner": "cfx:dsfawe"}

### /api/draw/:draw_id

-   method: get
-   description: return the draw information based on the draw id.
-   return: {"nft_id": "id1", "description": "good draw", "unit_price": 100.5, "quantity":101, "owner": "cfx:dsfawe", "deadline": 17389274}

### /api/market

-   method: post
-   parameters:
    -   offset
    -   limit
    -   filter(optional)
    -   type: nft/album/draw, default both
-   description: return NFT market information - a list of on sale NFT's id from cursor position, limit amount
-   return: {"nft_ids": ["nft id1", ...], "album_ids":[...]}

### /api/create-nft

-   require on chain interaction
-   method: post
-   parameters:
    -   address
    -   title
    -   description(optional)
    -   file
-   description: create a NFT piece locally, deploy on chain
-   return: status code, 200/400

### /api/list-nft

-   require on chain interaction, transfer/approve ownership to website
-   method: post
-   parameters:
    -   nft_id
    -   price
    -   currency(optional: default cfx)
    -   commission
    -   commission_currency
-   description: list the NFT on the market, change nft status to something like "on sale".

### /api/list-nft-draw

-   require on chain interaction, transfer/approve ownership to smart contract
-   method: post
-   parameters:
    -   nft_id
    -   description
    -   unit_price
    -   quantity(optional)
    -   deadline: optioanl when quantity is provided
    -   currency(optional: default cfx)
    -   commission(minimum 5%)
    -   commission_currency
-   description: create a NFT draw on the market

### /api/create-album

-   require on chain interaction
-   method: post
-   parameters:
    -   nft_ids
    -   title
    -   description(optional)
    -   file(optional)
-   description: create a NFT album locally using ids, deploy on chain
-   return: status code, 200/400

### /api/list-album

-   require on chain interaction, transfer/approve ownership to website
-   method: post
-   parameters:
    -   album_id
    -   price(optional)
    -   currency(optional: default cfx)
    -   commission
    -   commission_currency
-   description: list the NFT album on the market

### /api/purchase-nft

-   require on chain interaction
-   method: post
-   parameters:
    -   buyer
    -   nft_id
    -   commission
    -   commission_currency
-   description: purchase the NFT on the market, if this NFT fulfilled any album, transfer album to buyer as well

### /api/draw-nft

-   require on chain interaction, add buyer to smart contract, if draw is closed(i.e. quantity is full or deadline passed), transfer NFT to winner, transfer fund to seller
-   method: post
-   parameters:
    -   buyer
    -   draw_id
    -   quantity
    -   commission
    -   commission_currency
-   description: draw the NFT on the market, if draw is closed(i.e. quantity is full or deadline passed), transfer NFT to winner, transfer fund to seller

### /api/fund-nft

-   require on chain interaction, when fully purchased(optional, ideally should be moved on chain in the future)
-   method: post
-   parameters:
    -   buyer
    -   percentage
    -   nft_id
-   description: crowd funding the NFT on the market. wrap the nft with smart contract, within the smart contract, store buyers' address and parentages. in local db, have a nft address to smart contract address db.

### /api/purchase-album

-   require on chain interaction, transfer ownership to buyer
-   method: post
-   parameters:
    -   buyer
    -   album_id
    -   commission
    -   commission_currency
-   description: purchase the album on the market

### /api/stake

to be decided
