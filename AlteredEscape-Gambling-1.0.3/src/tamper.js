exports.mod = (mod_info) => {
//    logger.logInfo(`   [MOD] Loading: ${mod_info.name} (${mod_info.version}) by ${mod_info.author}`);
    trade_f.buyItem = require("./trade").buyItem; 
	
}

