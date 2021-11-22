Moralis.Cloud.define("getAvgGas", async function (request) { 
    const query = new Moralis.Query("EthTransactions"); 
    const pipeline = [
        { 
            group: {        
            // group by "from_address"        
            objectId: "$from_address",        
            // add computed property avgGas        
            // get average and convert wei to gwei        
            avgGas: { $avg: { $divide: ["$gas_price", 1000000000]} },      
            },    
        },    
        { sort: { avgGas: -1 } }, 
        // sort by avgGas high to low    
        { limit: 10 }, 
        // only return top 10 results  
    ];  
    // the master key is required for aggregate queries  
    const results = await query.aggregate(pipeline, { useMasterKey: true });  
    return results;
})