let rows=100;
let cols=26;
let addressColContainer=document.querySelector(".address-col-container");
let addressRowContainer=document.querySelector(".address-row-container");
let cellContainer=document.querySelector(".cells-container");
let addressbar=document.querySelector(".address-bar");

for(let i=1;i<=rows;i++)
{
    let addressCol=document.createElement("div");
    addressCol.setAttribute("class","address-col");
    addressCol.innerHTML=i;
    addressColContainer.appendChild(addressCol);
}

for(let i=1;i<=cols;i++)
{
    let addressRow=document.createElement("div");
    addressRow.setAttribute("class","address-row");
    let chr=String.fromCharCode(64+i);
    addressRow.innerHTML=chr;
    addressRowContainer.appendChild(addressRow);
}

for(let i=1;i<=rows;i++)
{
    let rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container");
    for(let j=1;j<=cols;j++)
    {
        let cell=document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable","true");
        rowContainer.appendChild(cell);
        addListenerForAddressBarDisplay(cell,i,j);
    }
    cellContainer.appendChild(rowContainer)
}

function addListenerForAddressBarDisplay(cell,i,j){
    cell.addEventListener("click",function(){
        let address=String.fromCharCode(64+j)+i;
        addressbar.value=address;
    })
}