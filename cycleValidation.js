// Storage -> 2D Matrix (Basic)
let graphComponentMatrix=[];

for(let i=0;i<rows;i++)
{
    let row=[];
    for(let j=0;j<cols;j++)
    {
        // Why array -> more than 1 children dependency
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

// console.log(graphComponentMatrix);

function isCyclic(graphComponentMatrix)
{
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
    // console.log(visited);
    // console.log(dfsVisited);
    for(let i=0;i<rows;i++)
    {
        for(let j=0;j<cols;j++)
        {
            if(visited[i][j]===false)
            {
                let response=dfsCycleDetection(graphComponentMatrix,i,j,visited,dfsVisited);
                if(response===true)
                {
                    return true;
                }
            }
        }
    }
    // console.log(visited);
    return false;
}
// Start -> Visited(True) && dfsVisited(True)
// End -> dfsVisited(False)
// if visited(True) then already visited, go back no use
// Cycle condition -> if(visited[i][j]==true && dfsVisited[i][j]==true) -> cycle detected

function dfsCycleDetection(graphComponentMatrix,srcr,srcc,visited,dfsVisited)
{
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;

    for(let children = 0;children<graphComponentMatrix[srcr][srcc].length;children++)
    {
        let [[nrid,ncid]]=graphComponentMatrix[srcr][srcc][children];
        // console.log(visited);
        // console.log(visited[nrid][ncid]);
        
        if(visited[nrid][ncid] === false)
        {
            let response=dfsCycleDetection(graphComponentMatrix,nrid,ncid,visited,dfsVisited);
            if(response===true)
            {
                return true;
            }
        }
        else if(visited[nrid][ncid]===true && dfsVisited[nrid][ncid]===true)
        {
            return true;
        }        
    }

    dfsVisited[srcr][srcc]=false;
    return false;
}