function colorPromise(){
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
            resolve();
        },1000)
    })
}

async function isCyclicTracePath(graphComponentMatrix,cycleResponse)
{
    let [srcr,srcc]=cycleResponse;
    let visited=[];  // Node visited Trace
    let dfsVisited=[];  // Stack Visited Trace
     
    for(let i=0;i<rows;i++)
    {
        // console.log("ok");
        let visitedRow=[];
        let dfsVisitedRow=[];
        for(let j=0;j<cols;j++)
        {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    let response=await dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited);
    if(response===true)
    {
        return Promise.resolve(true);
    }



    return Promise.resolve(false);

}

// Colour Tracking Path
async function dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited)
{
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;

    for(let children = 0;children<graphComponentMatrix[srcr][srcc].length;children++)
    {
        let [[nrid,ncid]]=graphComponentMatrix[srcr][srcc][children];

        let cell= document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);

        cell.style.backgroundColor="lightblue";
        await colorPromise();

        if(visited[nrid][ncid] === false)
        {
            let response=await dfsCycleDetectionTracePath(graphComponentMatrix,nrid,ncid,visited,dfsVisited);
            
            if(response===true)
            {
                cell.style.backgroundColor="transparent";
                await colorPromise();

                return Promise.resolve(true);
            }
        }
        else if(visited[nrid][ncid]===true && dfsVisited[nrid][ncid]===true)
        {
            let cyclicCell=document.querySelector(`.cell[rid="${nrid}"][cid="${ncid}"]`);
            cyclicCell.style.backgroundColor="lightsalmon";
            await colorPromise();

            cyclicCell.style.backgroundColor="transparent";
            await colorPromise();

            cell.style.backgroundColor="transparent";
            await colorPromise();

            return Promise.resolve(true);
        }        
    }

    dfsVisited[srcr][srcc]=false;
    return Promise.resolve(false);
}