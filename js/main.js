$(document).ready(function(){
    $(".inCart").click(function(){
        getArticles("data/artikli.json",function(res){
            const cart=[...document.querySelectorAll(".articlesDdl")];
            const cartIds=cart.map(elem=>elem.value);
            let newArr=res;
            cartIds.forEach(elem=>{
                newArr=newArr.filter(element=>element.idArtikla!=elem);
            })
            showArticles(newArr);
        })
    })
    $(".send").click(function(){
        const quantity=[...document.querySelectorAll(".quantity")].map(elem=>elem.value);
        const price=[...document.querySelectorAll(".price")].map(elem=>elem.innerHTML);
        const id=[...document.querySelectorAll(".articlesDdl")].map(elem=>elem.value);;
        const cart=[];
        for(let i in quantity){
            const item={
                id:id[i],
                quantity:quantity[i],
                price:price[i]
            };
            cart.push(item);
        }
        if(cart.length!=0){
            $.ajax({
                url:"orders.php",
                method:"POST",
                dataType:"json",
                data:{
                    orders:cart
                },
                succes:function(res){

                },
                error:function(xhr){
                    console.log(xhr);
                }
            })
        }
    })
})
function showArticles(arr){
    const table=$("table tbody");
    let html="";
        html+=`<tr>
            <td>${dropDown(arr)}</td>
            <td><input type="number" class="quantity" /></td>
            <td class="price"></td>
            <td><button class="outCart btn btn-primary">Izbaci</button></td>
        </tr>`;
    table.append(html);
    $(".quantity").on("input",function(){
        getPrice(this);
    })
    $(".articlesDdl").on("change",function(){
        getPrice(this);
    })
    $(".outCart").click(function(){
        $(this).parent().parent().remove();
        totalPrice();
    })
}
function getArticles(url,callback){
    $.ajax({
        url:url,
        method:"GET",
        dataType:"json",
        success:callback,
        error:function(xhr){
            console.log(xhr);
        }
    })
}
function dropDown(arr){
    let select=`<select class="articlesDdl">`;
    arr.forEach(element => {
        select+=`<option value="${element.idArtikla}" data-price1="${element.cena1}" data-price2="${element.cena2}">${element.imeArtikla}</option>`;
    });
    select+=`</select>`;
    return select;
}
function getPrice(target){
    const priceNode=$(target).parent().parent().find(".price");
    const quantity=$(target).parent().parent().find(".quantity").val();
    const ddlValue=$(target).parent().parent().find(".articlesDdl").val();
    let price=0;
    getArticles("data/artikli.json",function(res){
        const article=res.find(elem=>elem.idArtikla==ddlValue);
        if(quantity>10){
            price=quantity*article.cena2;
        }
        else{
            price=quantity*article.cena1;
        }
        priceNode.html(price);
        totalPrice();
    })
}
function totalPrice(){
    const prices=[...document.querySelectorAll(".price")].map(price=>Number(price.innerHTML));
    let total=0;
    if(prices.length!=0){
        total=prices.reduce((total,price)=>total+price);
    }
    document.querySelector("#total").innerHTML=total;
}

