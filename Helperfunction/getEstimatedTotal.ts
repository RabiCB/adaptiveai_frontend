export const estimatedTotal=(cart:any)=>{

    const totalprice=cart?.reduce((total:number,item:any)=>total+ (item.price *item.quantity),0)
    return totalprice?.toFixed(2)

}