for(let i=0;i<rows;i++)
{
    for(let j=0;j<cols;j++)
    {
        let cell= document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",()=>{
            let address=addressbar.value;
            let [activeCell, cellProp]=activecell(address);
            let enteredData=activeCell.innerText;

            if(enteredData===cellProp.value) return;

            cellProp.value=enteredData;
            // if data modifies removes P-C relation, formula empty, update children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula="";
            updateChildrenCells(address);
        })
    }
}

let formulaBar=document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",async(e)=>{   
    let inputFormula=formulaBar.value; 
    if(e.key==="Enter" && inputFormula)
    {
        let address=addressbar.value;
        let [cell,cellProp]=activecell(address);

        if(inputFormula!==cellProp.formula)
        {
            removeChildFromParent(cellProp.formula);
        }

        // check formula is cyclic or not, then only evaluate
        // True or False given by the function
        addChildToGraphComponent(inputFormula,address);
        let cycleResponse=isCyclic(graphComponentMatrix);

        if(cycleResponse)
        {
            // alert("Your formula is cyclic");
            let response=confirm("Your formula is cyclic. Do you want to trace your path?");
            while(response===true)
            {
                await isCyclicTracePath(graphComponentMatrix,cycleResponse);
                response=confirm("Your formula is cyclic. Do you want to trace your path?");    
            }
            removeChildFromGraphComponent(inputFormula,address);
            return;
        }

        let evaluatedValue=evaluateFormula(inputFormula);

        

        // To update UI and cellProp in DB
        setCellUIandProp(inputFormula,evaluatedValue,address);
        addChildToParent(inputFormula);
        
        updateChildrenCells(address);
        
    }
    
})

function evaluateFormula(formulaExpression)
{
    let encodedFormula=formulaExpression.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90)
        {
            let [activeCell,cellProp]=activecell(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;
        }
    }
    let decodedFormula=encodedFormula.join(" ");
    return eval(decodedFormula);
}

function addChildToParent(formulaExpression)
{
    let childAddress=addressbar.value;
    let encodedFormula=formulaExpression.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90)
        {
            let [parentActiveCell,parentCellProp]=activecell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formulaExpression)
{
    let childAddress=addressbar.value;
    let encodedFormula=formulaExpression.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90)
        {
            let [parentActiveCell,parentCellProp]=activecell(encodedFormula[i]);
            let idx=parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}

function updateChildrenCells(address){
    let [parentCell,parentCellProp]=activecell(address);
    let children=parentCellProp.children;
    for(let i=0;i<children.length;i++)
    {
        let [childCell,childCellProp]=activecell(children[i]);
        let childFormula=childCellProp.formula;
        let childEvaluatedFormula=evaluateFormula(childFormula);
        setCellUIandProp(childFormula,childEvaluatedFormula,children[i]);
        updateChildrenCells(children[i]);
    }
}

function addChildToGraphComponent(formula,childAddress)
{
    let [crid,ccid]=decodeRIDCIDFromAddress(childAddress);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90)
        {
            let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([[crid,ccid]]);
        }
    }
}

function removeChildFromGraphComponent(formula,childAddress)
{
    let [crid,ccid]=decodeRIDCIDFromAddress(childAddress);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++)
    {
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90)
        {
            let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function setCellUIandProp(formula,evaluatedValue,address)
{
    
    let [activeCell,cellProp]=activecell(address);

    // UI Update
    activeCell.innerText=evaluatedValue;

    // DB Update
    cellProp.value=evaluatedValue;
    cellProp.formula=formula;
}