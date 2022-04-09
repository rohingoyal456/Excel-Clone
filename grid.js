let rows=100;
let cols=26;

let addressColContainer=document.querySelector(".address-col-container");
let addressRowContainer=document.querySelector(".address-row-container");
let cellContainer=document.querySelector(".cells-container");
let addressbar=document.querySelector(".address-bar");

for(let i=0;i<rows;i++)
{
    let addressCol=document.createElement("div");
    addressCol.setAttribute("class","address-col");
    addressCol.innerHTML=i+1;
    addressColContainer.appendChild(addressCol);
}

for(let i=0;i<cols;i++)
{
    let addressRow=document.createElement("div");
    addressRow.setAttribute("class","address-row");
    let chr=String.fromCharCode(65+i);
    addressRow.innerHTML=chr;
    addressRowContainer.appendChild(addressRow);
}

for(let i=0;i<rows;i++)
{
    let rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container");
    for(let j=0;j<cols;j++)
    {
        let cell=document.createElement("div");
        cell.setAttribute("class","cell");

        // attributes for cell and storage identification
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);

        cell.setAttribute("contenteditable","true");
        cell.setAttribute("spellcheck","false");
        rowContainer.appendChild(cell);
        addListenerForAddressBarDisplay(cell,i,j);
    }
    cellContainer.appendChild(rowContainer)
}

function addListenerForAddressBarDisplay(cell,i,j){
    cell.addEventListener("click",function(){
        let address=String.fromCharCode(65+j)+(i+1);
        addressbar.value=address;
    })
}

let firstCell=document.querySelector(".cell");
firstCell.click();