let sheetDB=[];

for(let i=1;i<=rows;i++)
{
    let sheetRow=[];
    for (let j=1;j<=cols;j++)
    {
        let cellProp={
            bold:false,
            italic:false,
            underline:false,
            alignment:"left",
            fontFamily:"monospace",
            fontSize:"14",
            fontColor:"#000000",
            backgroundColor:"#ecf0f1",
            value:"",
            formula:"",
            children:[]
        }
        sheetRow.push(cellProp)
    }
    sheetDB.push(sheetRow)
}


// selectors for cell properties 

let bold=document.querySelector(".bold");
let italic=document.querySelector(".italic");
let underline=document.querySelector(".underline");
let alignment=document.querySelectorAll(".alignment");
let leftAlign=alignment[0];
let centerAlign=alignment[1];
let rightAlign=alignment[2];
let fontFamily=document.querySelector(".font-family-prop");
let fontSize=document.querySelector(".font-size-prop");
let fontColor=document.querySelector(".font-color-prop");
let backgroundColor=document.querySelector(".background-color-prop")

let activeColorProp="#d1d8e0";
let inactiveColorProp="#ecf0f1";

// application of two way binding
// attach property listeners

bold.addEventListener("click",function(){
    let address=addressbar.value;
    let [cell,cellProp]=activecell(address);

    // modification
    cellProp.bold=!cellProp.bold;    // data change 
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";    // UI change (1)
    bold.style.backgroundColor=cellProp.bold ? activeColorProp:inactiveColorProp;  // UI change (2)
    console.log(cellProp);
})

italic.addEventListener("click",function(){
    let address=addressbar.value;
    let [cell,cellProp]=activecell(address);

    // modification
    cellProp.italic=!cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor=cellProp.italic ? activeColorProp:inactiveColorProp;
})

underline.addEventListener("click",function(){
    let address=addressbar.value;
    let [cell,cellProp]=activecell(address);

    // modification
    cellProp.underline=!cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    underline.style.backgroundColor=cellProp.underline ? activeColorProp:inactiveColorProp;
})

fontSize.addEventListener("change",()=>{
    let address=addressbar.value;
    let [cell,cellProp]=activecell(address);
    
    cellProp.fontSize=fontSize.value;
    cell.style.fontSize=cellProp.fontSize+"px";
    // fontSize.value=cellProp.fontSize;
})

fontFamily.addEventListener("change",()=>{
    let address=addressbar.value;
    let [cell,cellProp]=activecell(address);
    
    cellProp.fontFamily=fontFamily.value;
    cell.style.fontFamily=cellProp.fontFamily;
    // fontFamily.value=cellProp.fontFamily;
})

fontColor.addEventListener("change",()=>{
    let address=addressbar.value;
    let [cell,cellProp]=activecell(address);
    
    cellProp.fontColor=fontColor.value;
    cell.style.color=cellProp.fontColor;
    fontColor.value=cellProp.fontColor;
})

backgroundColor.addEventListener("change",()=>{
    let address=addressbar.value;
    let [cell,cellProp]=activecell(address);
    
    cellProp.backgroundColor=backgroundColor.value;
    cell.style.backgroundColor=cellProp.backgroundColor;
    backgroundColor.value=cellProp.backgroundColor;
})

alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click",(e) =>{
        let address=addressbar.value;
        let [cell,cellProp]=activecell(address);
        let alignValue= e.target.classList[0];
        cellProp.alignment=alignValue;
        cell.style.textAlign=cellProp.alignment;  // ui change part 1
        
        // ui change part 2
        switch(alignValue)  
        {
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;
        }
    })
})


let allCells=document.querySelectorAll(".cell");
for(let i=0;i<allCells.length;i++)
{
    addListenertoAttachCellProperties(allCells[i]);
}

function addListenertoAttachCellProperties(cell){
    cell.addEventListener("click",(e)=>{    
        let address=addressbar.value;
        let [rid,cid]=decodeRIDCIDFromAddress(address);
        let cellProp=sheetDB[rid][cid];

        // apply cell properties 
        
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize=cellProp.fontSize+"px";
        cell.style.fontFamily=cellProp.fontFamily;
        cell.style.color=cellProp.fontColor;
        cell.style.backgroundColor=cellProp.backgroundColor;
        cell.style.textAlign=cellProp.alignment;
        
        
        // apply properties to UI prop container

        bold.style.backgroundColor=cellProp.bold ? activeColorProp:inactiveColorProp;
        italic.style.backgroundColor=cellProp.italic ? activeColorProp:inactiveColorProp;
        underline.style.backgroundColor=cellProp.underline ? activeColorProp:inactiveColorProp;
        fontSize.value=cellProp.fontSize;
        fontFamily.value=cellProp.fontFamily;
        fontColor.value=cellProp.fontColor;
        backgroundColor.value=cellProp.backgroundColor;
        switch(cellProp.alignment)
        {
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;
        }
        let formulaBar=document.querySelector(".formula-bar");
        formulaBar.value=cellProp.formula;
        cell.value=cellProp.value;
    })
}

function activecell(address)
{
    let [rid,cid]=decodeRIDCIDFromAddress(address);
    let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp=sheetDB[rid][cid];
    return [cell,cellProp];
}

function decodeRIDCIDFromAddress(address){
    let rid=Number(address.slice(1))-1;
    let cid=Number(address.charCodeAt(0))-65;
    return [rid,cid];
}