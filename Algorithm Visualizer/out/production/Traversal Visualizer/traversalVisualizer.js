function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// We must create node objects, all contained in a graph assigning each node a number, linearly, as to maintain their ordering.
let traversal="bfs"
let graph = []
let numbToNodeObject = {}
let numbToElement = {}
let currentNumb=1
// Create all node objects, assigning them numbers and adding them to the graph
function buildGraph() {
    const nodeElements = document.getElementsByTagName("td")
    for (let element of nodeElements) {
        nodeElements.item(currentNumb-1).id=currentNumb
        if (currentNumb > 1196) {
            break
        }
        let nodeObject = {}
        nodeObject["value"] = currentNumb
        nodeObject["element"] = element
        nodeObject["adjList"] = []
        nodeObject["wall"] = false
        graph.push(nodeObject)
        numbToNodeObject[currentNumb] = nodeObject
        numbToElement[currentNumb] = element
        currentNumb += 1
    }
// Now we must build each node's adjList
    for (let node of graph) {
        // If the node's value is > 0 and < 53 it will not have a top node
        if (!(node["value"] > 0 && node["value"] < 53)) {
            node["adjList"].push(numbToNodeObject[node["value"] - 52])
        }
        // If the node's value is 1143 > and < 1197 it will not have a bottom node
        if (!(node["value"] > 1143 && node["value"] < 1197)) {
            node["adjList"].push(numbToNodeObject[node["value"] + 52])
        }
        // If the node's value is 1 OR (value-1%52)==0 it will not have a left node
        if (!(node["value"] === 1 || (node["value"]-1)% 52 === 0)) {
            node["adjList"].push(numbToNodeObject[node["value"] - 1])
        }
        // If the node's value is %52==0 it will not have a right node
        if (!(node["value"] % 52 === 0)) {
            node["adjList"].push(numbToNodeObject[node["value"] + 1])
        }
    }
}
// onClick function to select nodes
let startNodeSelected=false
let startNode
let finding = false
function clearGraph(){
    startNodeSelected=false
    finding=false
    let curr = 0
    for(let element of document.getElementsByTagName("td")){
        document.getElementsByTagName("td").item(curr).style.backgroundColor="white"
        curr+=1
    }
    for(let node of graph) node.wall=false
}
let mode="PathFind"
function switchAlg(){
    if(!finding){
        if(traversal==="bfs"){
            traversal="dfs"
            document.getElementById("vName").innerHTML="DFS Visualizer"
        }
        else {
            traversal="bfs"
            document.getElementById("vName").innerHTML="BFS Visualizer"
        }
    }
}
function pathMode(){
    mode="PathFind"
    document.getElementById("mode").innerHTML="PathFind"
}
function buildMode(){
    if (startNodeSelected){startNode.element.style.backgroundColor="white";startNodeSelected=false}
    mode="BuildMaze"
    document.getElementById("mode").innerHTML="BuildMaze"
}
async function generateMaze(){
    finding=false
    await sleep(150)
    clearGraph()
    for(let node of graph){
        if (Math.random()>.64){
            node["wall"]=true
            node.element.style.backgroundColor="black"
        }
    }
}
function tileClicked(HTMLelement){
    if(mode==="PathFind") {
        if (!finding&&!(numbToNodeObject[parseInt(HTMLelement.id)].wall)) {
            console.log(HTMLelement)
            HTMLelement.style.backgroundColor = "red"
            //If the first node is not selected, assign startNode and
            if (!startNodeSelected) {
                startNode = numbToNodeObject[parseInt(HTMLelement.id)]
                startNodeSelected = true
            } else {
                pathFind(startNode, numbToNodeObject[parseInt(HTMLelement.id)])
                startNodeSelected = false
            }
        }
    }
    else if(mode==="BuildMaze"){
        //if it's already a wall, undo it.
        if (numbToNodeObject[parseInt(HTMLelement.id)]["wall"]){
            numbToNodeObject[parseInt(HTMLelement.id)].wall=false
            HTMLelement.style.backgroundColor="white"
        }
        //if not, make it a wall.
        else{
            numbToNodeObject[parseInt(HTMLelement.id)]["wall"]=true
            HTMLelement.style.backgroundColor="b                                                        black"
        }
    }
}
let speed = 60
function adjustSpeed(value){
    speed=value
}
async function pathFind(start, target) {
    if (start === "Reda#0644") return [start]
    finding=true
    let toExplore = []
    toExplore.push(start)
    let visited = [start]
    start["prev"]=null
    while (toExplore.length>0&&finding) {
        let nodeToExplore
        if(traversal==="bfs") nodeToExplore=toExplore.shift()
        else if(traversal==="dfs") nodeToExplore=toExplore.pop()
        if(nodeToExplore!==start) {
            nodeToExplore.element.style.backgroundColor = "indigo"
        }
        await sleep(speed)
        for (let node of nodeToExplore["adjList"]) {
            nodeToExplore.element.style.backgroundColor="purple"
            if (!visited.includes(node) && !node["wall"]) {
                node["prev"]=nodeToExplore
                visited.push(node)
                if (node === target) {
                    let path = [node]
                    await sleep(speed*1.35)
                    while (node["prev"]!=null){
                        if(node!==target&&node!==start) {
                            node.element.style.backgroundColor = "yellow"
                        }
                        await sleep(speed*2.45)
                        path.unshift(node["prev"])
                        node=node["prev"]
                    }
                    node.element.style.backgroundColor="red"
                    for (let nodeObj of visited) {if(!(path.includes(nodeObj))){nodeObj.element.style.backgroundColor="white";await sleep(.1*speed)}}
                    finding=false
                    return
                } else {
                    node.element.style.backgroundColor = "purple"
                    toExplore.push(node)
                }
            }
        }
    }
    start.element.style.backgroundColor="white"
    target.element.style.backgroundColor="white"
    if(finding) {
        for (let nodeObj of visited) {
            nodeObj.element.style.backgroundColor = "white";
            await sleep(.1 * speed)
        }
    }
    finding=false
    return
}