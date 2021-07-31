"use strict";
exports.buyItem = (pmcData, body, sessionID) => {
    if (!helper_f.payMoney(pmcData, body, sessionID)) {
//        logger.logError("no money found");
        return "";
    }
    let output = item_f.handler.getOutput();

    let newReq = {
        "items": [{
            "item_id": body.item_id,
            "count": body.count,
        }],
        "tid": body.tid
        
    };
    if (body.tid != "ragfair") {
        let _traderAssort = global._database.traders[body.tid].assort;
        let _traderItems = _traderAssort.items;
        let _itemStock = _traderItems.find(shid => shid._id === body.item_id);
        _itemStock = _itemStock.upd;
        let _inStock = _itemStock.StackObjectsCount;
        if (body.count > _inStock) {
            body.count = _inStock;
            _inStock = 0;
        } else { 
            _inStock = (_inStock -= body.count);
        }
        _itemStock.StackObjectsCount = _inStock;
//        logger.logSuccess(`Bought ${body.count} of ${body.item_id}, there are ${_inStock} left`);
        global._database.traders[body.tid].assort = _traderAssort;
        if (body.item_id === "mystery_box") {
            let traderItems = fileIO.readParsed(`user/cache/assort_ragfair.json`).data;
            let index = utility.getRandomInt(0, traderItems.items.length)
            let newID = traderItems.items[index]._id
            let newTpl = traderItems.items[index]._tpl
            let salePrice = traderItems.barter_scheme[newID][0][0].count
            while (salePrice === 0) {
                let substitute = utility.getRandomInt(0, traderItems.items.length)
                newID = traderItems.items[substitute]._id
                newTpl = traderItems.items[substitute]._tpl
                salePrice = traderItems.barter_scheme[newID][0][0].count
                if (itemCat(newTpl) === false){
                    let jackpot = utility.getRandomInt(0, 100)
                    if(jackpot === 69){
                        newID = "5449016a4bdc2d6f028b456f"
                        body.count = 1000000
                        salePrice = 1
                    }else{
                        salePrice = 0
                    }
                }
            }
            switch (itemCat(newTpl)){
                case "ammo":
                    body.count = (body.count * 240)
                    break
                case "ammoBox":
                    body.count = (body.count * 2)
                    break
                case "weapon":
                    break
                default:
                    
            }
            body.item_id = newID;
            body.tid = "ragfair"
            newReq = {
                "items": [{
                    "item_id": body.item_id,
                    "count": body.count,
                }],
                "tid": body.tid
                
            };
        }
        return move_f.addItem(pmcData, newReq, output, sessionID);
    } else {
//        logger.logSuccess(`Bought ${body.count} of ${body.item_id}`);
        return move_f.addItem(pmcData, newReq, output, sessionID);
    }
}
function itemCat(tpl){
    let itemList = fileIO.readParsed(`user/cache/items.json`)
    let ammo = "5485a8684bdc2da71d8b4567"
    let ammoBox = "543be5cb4bdc2deb348b4568"
    let weapon = [ 
        "5447b5fc4bdc2d87278b4567", "5447b6194bdc2d67278b4567", "5447b6094bdc2dc3278b4567", "5447b6254bdc2dc3278b4568", "5447bee84bdc2dc3278b4569",
        "5447b6254bdc2dc3278b4568", "5447b5cf4bdc2d65278b4567", "5447b5f14bdc2d61278b4567", "5447b5e04bdc2d62278b4567", "5447bed64bdc2d97278b4568"
    ]  
    for (let item of Object.values(itemList.data)){
        if (item._id === tpl){
            if (item._parent === ammo){
                return "ammo"
            }
            else if (item._parent === ammoBox){
                return "ammoBox"
            }
            else if (weapon.includes(item._parent)){
                return "weapon"
            }
            else {
                return false
            }
        }
    }
}