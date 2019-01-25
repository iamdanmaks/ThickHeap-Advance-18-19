var d = document;
var toInsert = [];
var toMove = [];
var delta;
var needFinDelMin = false;
var isauto = true;
var isanim = false;
var result;
var isauto = true;
var ismoving = false;
var issecond = false;
			
function getDelta(rank)
{
    if (rank == 0) 
        return svg.HOR_DIST;
    if (rank == 1) 
        return 2 * svg.HOR_DIST;
    
    return 3 * getDelta(rank - 1);
}
			
function getFirstX(rank)
{
	var ans = svg.START_X;
	for (var currank = thickHeap._maxRank; currank >= rank; currank--)
	{
		var pointer = thickHeap._rootCounter[currank].listPointer;
        if (pointer == null) 
            continue;
        
            while (pointer != null)
			{
				ans = svg.getNodeCoords(pointer.index).x + svg.HOR_DIST;
				pointer = pointer.right;
			}
	}
	return ans;
}

var svg = {
    layout_ : null,
    nodes_ : [],
    edges_ : [],
    rootnodes_ : [],
    op_queue : [], // {op : "", args:[]}
    NODE_RADIUS : 17,
    START_X : 40,
    START_Y : 170,
    HOR_DIST : 70,
    VER_DIST : 75,
    nextRank : 0,
    DELAY : 10,
    nextX : 50,
    moveNodes : [], // {node:, x:, y:, stopx, stopy, moveFunc}
    listpointers: [],

    setRootVal : function(index, value)
    {
        var el = svg.rootnodes_[index].children[3];
        var el1 = svg.rootnodes_[index].children[1];
        el1.classList.add("activeCell");
        el.textContent = value;
        setTimeout(function() {svg.nextAnimation(); el1.classList.remove("activeCell");}, 500);
    },
    
    getRootCoords : function(index)
    {
        var attr = this.rootnodes_[index].getAttribute("transform").substr(10).split(',');
        var x = parseInt(attr[0]), y = parseInt(attr[1]);
        return {x:x, y:y};
    },
    
    setRootCoords : function(index, x, y)
    {
        this.rootnodes_[index].setAttribute("transform", "translate(" + x + ", " + y + ")");
        while ((x + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("width") ||
                 (y + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("height"))
        {
            layout.currentScale = parseFloat(layout.currentScale) - 0.01
        }
    },
    
    // возвращает новую позицию
    updRootCoords : function(node, dx, dy)
    {
        var attr = node.getAttribute("transform").substr(10).split(',');
        var x = parseInt(attr[0]), y = parseInt(attr[1]);
        node.setAttribute("transform", "translate(" + (x + dx) + ", " + (y + dy) + ")");
        while ((x + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("width") ||
                 (y + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("height"))
        {
            layout.currentScale = parseFloat(layout.currentScale) - 0.01
        }
        return {x:x + dx, y:y + dy};
    },
    
    increaseRank : function()
    {
        var g = d.createElementNS("http://www.w3.org/2000/svg", 'g');
        
        
        var rect1 = d.createElementNS("http://www.w3.org/2000/svg","rect");
        rect1.classList.add("cell");
        rect1.setAttribute("width", "24");
        rect1.setAttribute("height", "24");
        
        var rect2 = d.createElementNS("http://www.w3.org/2000/svg","rect");
        rect2.classList.add("cell");
        rect2.setAttribute("width", "24");
        rect2.setAttribute("height", "24");
        rect2.setAttribute("y", "25");
        
        var text1 = d.createElementNS("http://www.w3.org/2000/svg", "text");
        text1.setAttribute("x", "8");
        text1.setAttribute("y", "17");
        text1.textContent = svg.nextRank;
        
        var text2 = d.createElementNS("http://www.w3.org/2000/svg", "text");
        text2.setAttribute("x", "8");
        text2.setAttribute("y", "43");
        text2.textContent = "0";
        
        
        g.appendChild(rect1);
        g.appendChild(rect2);
        
        g.appendChild(text1);
        g.appendChild(text2);
        
        g.style.opacity = 0;
        
        this.rootnodes_.push(g);
        
        this.setRootCoords(svg.nextRank, 400, 5);
        this.layout_.appendChild(g);
        svg.nextRank++;
        return svg.nextRank - 1;
    },
    
    moveRoot : function(node, dx, dy, isroot, func)
    {
        var cor = svg.updRootCoords(node, dx, dy);
        if (isroot)
        {
            if (func != null)
            {
                setTimeout(svg.moveStep, svg.DELAY);
            }
            return cor;
        }
    },
    
    moveFull : function(node, dx, dy, isroot, func)
    {
        var curcor = svg.updNodeCoords(node.index, dx, dy);
        if (node.top_node != null)
        {
            svg.updEdgeCoords(node.top_node, dx, dy);
        }
        if (node.right_node != null)
        {
            svg.updEdgeCoords(node.right_node, dx, dy);
        }
        
        if (node.right != null)
        {
            svg.moveFull(node.right, dx, dy, false);
        }
        if (node.leftChild != null)
        {
            svg.moveFull(node.leftChild, dx, dy, false);
        }
        
        if (isroot)
        {
            if (func != null)
            {
                setTimeout(svg.moveStep, svg.DELAY);
            }
            return curcor;
        }
    },
    
    moveTreeToDel : function(node, dx, dy, isroot, func)
    {
        pointers = d.getElementsByClassName("pointer");
        for (var i = 0; i < pointers.length; ++i){
            pointers[i].style.opacity = 0;
            console.log(pointers[i].opacity);
        }
        var curcor = svg.updNodeCoords(node.index, dx, dy);
        if (node.top_node != null)
        {
            svg.updEdgeCoords(node.top_node, dx, dy);
        }
        if (node.right_node != null)
        {
            svg.updEdgeCoords(node.right_node, dx, dy);
        }
        
        if (node.right != null && isroot == false)
        {
            svg.moveTreeToDel(node.right, dx, dy, false);
        }
        if (node.leftChild != null)
        {
            svg.moveTreeToDel(node.leftChild, dx, dy, false);
        }
        
        if (isroot)
        {
            if (func != null)
            {
                setTimeout(svg.moveStep, svg.DELAY);
            }
            return curcor;
        }
    },
    
    moveTreeFast : function(node, dx, dy, isroot, func)
    {
        pointers = d.getElementsByClassName("pointer");
        for (var i = 0; i < pointers.length; ++i){
            pointers[i].style.opacity = 0;
            console.log(pointers[i].opacity);
        }
        if (isroot == false && (node == svg.moveNodes[0].node || 
                                       node == svg.moveNodes[1].node ||
                                       node == svg.moveNodes[2].node))
        {
            if (node.right != null)
            {
                svg.moveTreeFast(node.right, dx, dy, false);
            }
            return;
        }
        var curcor = svg.updNodeCoords(node.index, dx, dy);
        if (node.top_node != null)
        {
            svg.updEdgeCoords(node.top_node, dx, dy);
        }
        if (node.right_node != null)
        {
            svg.updEdgeCoords(node.right_node, dx, dy);
        }
        
        if (node.right != null && isroot == false)
        {
            svg.moveTreeFast(node.right, dx, dy, false);
        }
        if (node.leftChild != null)
        {
            svg.moveTreeFast(node.leftChild, dx, dy, false);
        }
        
        if (isroot)
        {
            if (func != null)
            {
                setTimeout(svg.moveStep, svg.DELAY);
            }
            return curcor;
        }
    },
    
    moveStep : function()
    {
        var wasfirst = false;
        for (var i = 0; i < svg.moveNodes.length; i++)
        {
            var el = svg.moveNodes[i];
            var newcor;
            if (el.x != el.stopx)
            {
                var dx = el.x < el.stopx ? 1 : -1;
                if (wasfirst == false)
                {
                    newcor = el.moveFunc(el.node, dx, 0, true, svg.moveStep);
                    wasfirst = true;
                }
                else
                {
                    newcor = el.moveFunc(el.node, dx, 0, true, null);
                }
                el.x = newcor.x;
                el.y = newcor.y;
            }
            else if (el.y != el.stopy)
            {
                var dy = el.y < el.stopy ? 1 : -1;
                if (wasfirst == false)
                {
                    newcor = el.moveFunc(el.node, 0, dy, true, svg.moveStep);
                    wasfirst = true;
                }
                else
                {
                    newcor = el.moveFunc(el.node, 0, dy, true, null);
                }
                el.x = newcor.x;
                el.y = newcor.y;
            }
        }
        if (wasfirst == false)
        {
            // добавляем нужные ребра после fastening
            if (svg.moveNodes.length && svg.moveNodes[0].moveFunc == svg.moveTreeFast && svg.moveNodes.length == 3)
            {
                var n1 = svg.moveNodes[0].node;
                var n2 = svg.moveNodes[1].node;
                var n3 = svg.moveNodes[2].node;
                svg.op_queue.unshift({op:"addedges", args:[n1, n2, n3]});
                svg.nextAnimation();
                return;
            }
            for (var i = 0; i < svg.moveNodes.length; i++)
            {
                if (svg.moveNodes[i].moveFunc != svg.moveRoot) svg.deactivateNode(svg.moveNodes[i].node.index);							
            }
            svg.nextAnimation();
        }
    },
    
    opacityStep : function(index, isnode, isdesc, func)
    {
        if (isdesc)
        {
            if (isnode)
            {
                if (svg.nodes_[index].style.opacity == 0)
                {
                    svg.deactivateNode(index);
                    if (func != null) func();
                }						
                else
                {
                    svg.nodes_[index].style.opacity = +svg.nodes_[index].style.opacity - 0.02;
                    setTimeout(svg.opacityStep, svg.DELAY, index, isnode, isdesc, func);
                }
            }
            else
            {
                if (svg.edges_[index].style.opacity == 0)
                {
                    svg.deactivateEdge(index);
                    if (func != null) func();
                }						
                else
                {
                    svg.edges_[index].style.opacity = +svg.edges_[index].style.opacity - 0.02;
                    setTimeout(svg.opacityStep, svg.DELAY, index, isnode, isdesc, func);
                }
            }
        }
        else
        {
            if (isnode)
            {
                if (svg.nodes_[index].style.opacity == 1)
                {
                    svg.deactivateNode(index);
                    if (func != null) func();
                }						
                else
                {
                    svg.nodes_[index].style.opacity = +svg.nodes_[index].style.opacity + 0.02;
                    setTimeout(svg.opacityStep, svg.DELAY, index, isnode, isdesc, func);
                }
            }
            else
            {
                if (svg.edges_[index].style.opacity == 1)
                {
                    svg.deactivateEdge(index);
                    if (func != null) func();
                }						
                else
                {
                    svg.edges_[index].style.opacity = +svg.edges_[index].style.opacity + 0.02;
                    setTimeout(svg.opacityStep, svg.DELAY, index, isnode, isdesc, func);
                }
            }
        }
    },
    
    activateEdge : function(index)
    {
        this.edges_[index].setAttribute("class", "link activeLink");
    },
    
    deactivateEdge : function(index)
    {
        this.edges_[index].setAttribute("class", "link");
    },
    
    activateNode : function(index)
    {
        this.nodes_[index].firstChild.classList.add("activeNode");// setAttribute("class", "node activeNode");
    },
    
    deactivateNode : function(index)
    {
        svg.nodes_[index].firstChild.classList.remove("activeNode");
    },
    
    createNode : function(value)
    {
        var g = d.createElementNS("http://www.w3.org/2000/svg", 'g');
        
        var circle = d.createElementNS("http://www.w3.org/2000/svg","circle");
        circle.setAttribute("class", "node");
        circle.setAttribute("r", this.NODE_RADIUS);
        g.appendChild(circle);
        g.style.opacity = 0;
        
        var text = d.createElementNS("http://www.w3.org/2000/svg","text");
        text.setAttribute("y", 5);
        text.setAttribute('text-anchor', "middle");
        text.textContent = value;
        g.appendChild(text);
        this.nodes_.push(g);
        
        this.setNodeCoords(this.nodes_.length - 1, this.nextX, this.START_Y);
        this.nextX += this.HOR_DIST;
        this.layout_.appendChild(g);
        return this.nodes_.length - 1;
    },
    
    createEdge(stind, finind, is2side)
    {
        var path = d.createElementNS("http://www.w3.org/2000/svg", 'path');
        
        var stcor = this.getNodeCoords(stind);
        var fincor = this.getNodeCoords(finind);
        
        path.setAttribute("class", "link");
        if (is2side)
        {
            path.setAttribute("style", "opacity:0; marker-end: url('#end-arrow'); marker-start: url('#start-arrow');");
        }
        else
        {
            path.setAttribute("style", "opacity:0; marker-end: url('#end-arrow');");
        }

        this.edges_.push(path);
        this.setEdgeCoords(this.edges_.length - 1, stcor.x, stcor.y, fincor.x, fincor.y);
        this.layout_.insertBefore(path, this.layout_.firstChild);
        return this.edges_.length - 1;
    },
    
    getNodeCoords : function(index)
    {
        var attr = this.nodes_[index].getAttribute("transform").substr(10).split(',');
        var x = parseInt(attr[0]), y = parseInt(attr[1]);
        return {x:x, y:y};
    },
    
    setNodeCoords : function(index, x, y)
    {
        this.nodes_[index].setAttribute("transform", "translate(" + x + ", " + y + ")");
        while ((x + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("width") ||
                 (y + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("height"))
        {
            layout.currentScale = parseFloat(layout.currentScale) - 0.01
        }
    },
    
    // возвращает новую позицию
    updNodeCoords : function(index, dx, dy)
    {
        pointers = d.getElementsByClassName("pointer");
        for (var i = 0; i < pointers.length; ++i){
            pointers[i].style.opacity = 0;
            console.log(pointers[i].opacity);
        }
        var attr = this.nodes_[index].getAttribute("transform").substr(10).split(',');
        var x = parseInt(attr[0]), y = parseInt(attr[1]);
        this.nodes_[index].setAttribute("transform", "translate(" + (x + dx) + ", " + (y + dy) + ")");
        while ((x + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("width") ||
                 (y + svg.NODE_RADIUS * 2) * layout.currentScale > +layout.getAttribute("height"))
        {
            layout.currentScale = parseFloat(layout.currentScale) - 0.01
        }
        return {x:x + dx, y:y + dy};
    },
                    
    getEdgeCoords : function(index)
    {
        var attr = this.edges_[index].getAttribute("d").substr(1).split('L');
        attr[0] = attr[0].split(',');
        attr[1] = attr[1].split(',');
        var xs = parseInt(attr[0][0]), ys = parseInt(attr[0][1]);
        var xf = parseInt(attr[1][0]), yf = parseInt(attr[1][1]);
        return {xs:xs + dx, ys:ys + dy, xf:xf + dx, yf:yf + dy};
    },
    
    setEdgeCoords : function(index, xs, ys, xf, yf)
    {
        this.edges_[index].setAttribute("d", "M" + xs + "," + ys + "L" + xf + "," + yf);
    },
    
    // возвращает новую позицию
    updEdgeCoords : function(index, dx, dy)
    {
        var attr = this.edges_[index].getAttribute("d").substr(1).split('L');
        attr[0] = attr[0].split(',');
        attr[1] = attr[1].split(',');
        var xs = parseInt(attr[0][0]), ys = parseInt(attr[0][1]);
        var xf = parseInt(attr[1][0]), yf = parseInt(attr[1][1]);
        this.edges_[index].setAttribute("d", "M" + (xs + dx) + "," + (ys + dy) + "L" +
                                                  (xf + dx) + "," + (yf + dy));
        return {xs:xs + dx, ys:ys + dy, xf:xf + dx, yf:yf + dy};
    },

    draw_pointer: function(){
        for (var i = 0; i <= thickHeap._maxRank; ++i){
            thickHeap._rootCounter[i].prevListPointer = thickHeap._rootCounter[i].listPointer

            rootCoords = svg.getRootCoords(i);
            nodeCoords = svg.getNodeCoords(thickHeap._rootCounter[i].listPointer.index);

            var path = d.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("class", "link pointer change_pointer");

            svg.listpointers.push(path);
            svg.listpointers[svg.listpointers.length - 1]
                .setAttribute("d", "M" + (rootCoords.x + 11) + "," + (rootCoords.y + 47) + "L" + nodeCoords.x + "," + nodeCoords.y);
            svg.layout_.insertBefore(path, svg.layout_.firstChild);
        }
    },
    
    nextAnimation : function()
    {
        if (isauto == false)
        {
            if (issecond == true)
            {
                ismoving = false;
                return;
            }
            else
            {
                ismoving = true;
                issecond = true;
            }
        }
        if (svg.op_queue.length == 0) 
        {
            if (toInsert.length == 0)
            {
                d3.selectAll("path.pointer").remove();
                if (needFinDelMin)
                {
                    needFinDelMin = false;
                    svg.nextX = getFirstX(0);
                    thickHeap.getNewMin();
                    return;
                }
                else
                {
                    isanim = false;
                    ismoving = false;
                    hideWarnings();
                    res.textContent = result;
                    setOp("<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>");
                    pointers = d.getElementsByClassName("pointer");
                    
                    svg.draw_pointer();
                    
                    for (var i = 0; i < pointers.length; ++i){
                        pointers[i].classList.remove("change_pointer");
                    }

                    return;
                }
            }
            var node = toInsert.shift();
            svg.moveNodes = [];
            while (toMove.length && toMove[0].rank >= node.rank)
            {
                var curnode = toMove.shift();
                var obj = {};
                var cor = svg.getNodeCoords(curnode.index);
                obj.moveFunc = svg.moveFull;
                obj.node = curnode;
                obj.x = cor.x;;
                obj.y = cor.y;
                obj.stopx = cor.x - delta;
                obj.stopy = cor.y;
                svg.activateNode(curnode.index);
                svg.moveNodes.push(obj);
            }
            svg.op_queue.push({op:"movetopos", args:[node]});
            if (svg.moveNodes.length > 0)
            {
                //alert(2);
                svg.moveStep();
                return;
            }
        }
        var op = svg.op_queue.shift();
        
        // description
        if (op.op == "fastening")
        {
            var s = [op.args[0], op.args[1], op.args[2]]; 
            var f = [op.args[3], op.args[4], op.args[5]]; 
            var cor = [];
            
            for (var i = 0; i < 3; ++i)
            {
                svg.activateNode(s[i].index);
                cor.push(svg.getNodeCoords(s[i].index));								
            }
            svg.moveNodes = [];
            for (var i = 0; i < 3; i++)
            {
                var obj = {};
                obj.node = s[i];
                obj.x = cor[i].x;
                obj.y = cor[i].y;
                obj.moveFunc = svg.moveTreeFast;
                if (s[i] == f[2])
                {
                    obj.stopx = cor[2].x;
                    obj.stopy = cor[2].y;
                    if (s[i].rank == 1)
                    {	
                        obj.stopx = cor[1].x;
                    }
                    svg.moveNodes[2] = obj;
                }
                else if (s[i] == f[1])
                {
                    obj.stopx = cor[1].x;
                    obj.stopy = cor[1].y + svg.VER_DIST;
                    svg.moveNodes[1] = obj;
                }
                else if (s[i] == f[0])
                {
                    obj.stopx = cor[0].x;
                    obj.stopy = cor[0].y + svg.VER_DIST;								
                    svg.moveNodes[0] = obj;
                }
            }
            setOp("Связывание трёх деревьев ранга " + f[0].rank + " в дерево ранга " + (f[0].rank + 1));
            svg.moveStep();
        }
        
        else if (op.op == "leftadded")
        {
            svg.moveNodes = [];
            svg.nextX -= svg.HOR_DIST;
            var node = op.args[0];
            var cor = svg.getNodeCoords(node.index);
            svg.activateNode(node.index);
            var obj = {};
            
            obj.moveFunc = svg.moveTreeFast;
            obj.node = node;
            obj.x = cor.x;;
            obj.y = cor.y;
            obj.stopx = cor.x - svg.HOR_DIST;
            obj.stopy = cor.y;
            svg.moveNodes = [];
            svg.moveNodes[0] = obj;
            svg.moveStep();
        }
        
        else if (op.op == "addright")
        {
            var node1 = op.args[0], node2 = op.args[1];
            node1.right_node = svg.createEdge(node1.index, node2.index, false);
            var ind = node1.right_node;
            svg.activateEdge(ind);
            svg.opacityStep(ind, false, false, svg.nextAnimation);
        }
        
        else if (op.op == "deleteright")
        {
            var p1 = op.args[0], p2 = op.args[1], p3 = op.args[2];
            svg.opacityStep(p1.right_node, false, true, null);
            svg.opacityStep(p2.right_node, false, true, svg.nextAnimation);
            p1.right_node = null;
            p2.right_node = null;
            p3.right_node = null;
        }
        
        else if (op.op == "opacityNode")
        {
            var node1 = op.args[0];
            svg.opacityStep(node1.index, true, false, svg.nextAnimation);
            setOp("Вставка нового дерева ранга 0 в кучу.");
        }
        
        else if (op.op == "deactivatenodes")
        {
            for (var i = 0; i < op.args.length; i++)
            {
                svg.deactivateNode(op.args[i].index);							
            }
            svg.nextAnimation();
        }
        
        else if (op.op == "changemin")
        {
            var pr = op.args[0], cur = op.args[1];
            if (pr != null)
            {
                svg.nodes_[pr.index].firstChild.classList.remove("minNode");			
            }
            svg.nodes_[cur.index].firstChild.classList.add("minNode");	
            setTimeout(svg.nextAnimation, 1000);
            setOp("Обновление минимального узла.");
        }
        
        else if (op.op == "setdeleted")
        {
            var node = op.args[0];
            var leftn = op.args[1];
            svg.nodes_[node.index].firstChild.classList.add("deletedNode");
            if (node.right_node != null && leftn != null)
            {
                svg.opacityStep(node.right_node, false, true, null);
                svg.opacityStep(leftn.right_node, false, true, svg.nextAnimation);
            }
            else if(node.right_node != null)
            {
                svg.opacityStep(node.right_node, false, true, svg.nextAnimation);
            }
            else if(leftn != null)
            {
                svg.opacityStep(leftn.right_node, false, true, svg.nextAnimation);
            }
            else svg.nextAnimation();
            setOp("Удаление дерева ранга " + node.rank + " из списка деревьев.")
        }
        
        else if (op.op == "movedown")
        {
            //alert(1);
            var deltay = op.args[0].rank * svg.VER_DIST;
            svg.moveNodes = []; 
            for (var i = 0; i < op.args.length; i++)
            {
                var curnode = op.args[i];
                var obj = {};
                var cor = svg.getNodeCoords(curnode.index);
                obj.moveFunc = svg.moveTreeToDel;
                obj.node = curnode;
                obj.x = cor.x;;
                obj.y = cor.y;
                obj.stopx = cor.x;
                obj.stopy = cor.y + deltay;
                svg.moveNodes.push(obj);
            }
            svg.activateNode(op.args[0].index);
            svg.moveStep()
        }
        
        // description
        else if (op.op == "deletenode")
        {
            if (op.args.length == 1)
            {
                svg.opacityStep(op.args[0].index, true, true, svg.nextAnimation);
                return;
            }
            else
            {
                svg.opacityStep(op.args[0].index, true, true, null);
            }
            for (var i = 1; i < op.args.length - 1; i++)
            {
                var node = op.args[i];
                svg.opacityStep(node.top_node, false, true, null);
                if (node.right_node != null)
                {
                    svg.opacityStep(node.right_node, false, true, null);
                }
                node.top_node = null;
                node.right_node = null;
            }
            var node = op.args[i];
            svg.opacityStep(node.top_node, false, true, svg.nextAnimation);
            if (node.right_node != null)
            {
                svg.opacityStep(node.right_node, false, true, null);
            }
            node.top_node = null;
            node.right_node = null;
            setOp("Удаление связей с детьми и связей между детьми удаленной вершины.");
        }
        
        // desc
        else if (op.op == "moverightpart")
        {
            //alert(1);
            var node = op.args[0];
            var obj = {};
            var cor = svg.getNodeCoords(node.index);
            svg.activateNode(node.index);
            svg.moveNodes = [];
            obj.moveFunc = svg.moveFull;
            obj.node = node;
            obj.x = cor.x;;
            obj.y = cor.y;
            obj.stopx = cor.x - delta;
            obj.stopy = cor.y;
            svg.moveNodes.push(obj);
            svg.moveStep();
            setOp("Восстановление списочной части ранга " + node.rank + ".");
        }
        
        //desc
        else if (op.op == "movetopos")
        {
            //alert(1);
            var node = op.args[0];
            var newx = getFirstX(node.rank);
            newx += (getDelta(node.rank) - svg.HOR_DIST);
            var obj = {};
            var cor = svg.getNodeCoords(node.index);
            
            svg.activateNode(node.index);
            svg.moveNodes = [];
            obj.moveFunc = svg.moveFull;
            obj.node = node;
            obj.x = cor.x;;
            obj.y = cor.y;
            obj.stopx = newx;
            obj.stopy = svg.START_Y;
            svg.moveNodes.push(obj);
            delta -= getDelta(node.rank);
            svg.op_queue.push({op:"insertTree", args:[node]});
            svg.moveStep();
            setOp("Вставка сына удаленной вершины ранга " + node.rank + " в кучу.");
        }
        
        else if (op.op == "insertTree")
        {
            thickHeap._insertTree(op.args[0], true);
        }
        
        // description
        else if (op.op == "addedges")
        {
            var n1 = op.args[0];
            var n2 = op.args[1];
            var n3 = op.args[2];
            n1.top_node = svg.createEdge(n1.index, n3.index, true);
            n2.top_node = svg.createEdge(n2.index, n3.index, false);
            n1.right_node = svg.createEdge(n1.index, n2.index, true);
            if (n2.right != null)
            {
                var plc = n2.right; //prev left child
                n2.right_node = svg.createEdge(n2.index, plc.index, true);
                svg.opacityStep(n2.right_node, false, false, null);
                svg.opacityStep(plc.top_node, false, true, null);
                plc.top_node = svg.createEdge(plc.index, n3.index, false);
                svg.opacityStep(plc.top_node, false, false, null);
            }
            svg.opacityStep(n1.top_node, false, false, null);
            svg.opacityStep(n1.right_node, false, false, null);
            svg.opacityStep(n2.top_node, false, false, svg.nextAnimation);
            svg.op_queue.unshift({op:"deactivatenodes", args:[n1, n2, n3]});
            setOp("Обновление ссылок.");
        }
        
        //description
        else if (op.op == "movetop")
        {
            var node = op.args[0];
            var ind = svg.createNode(node.value);
            svg.nextX -= svg.HOR_DIST;
            svg.nodes_[ind].firstChild.classList.add("minNode");
            var mincor = svg.getNodeCoords(node.index);
            svg.setNodeCoords(ind, mincor.x, mincor.y);
            svg.nodes_[ind].style.opacity = 1;
            svg.moveNodes = [];
            var obj = {};
            obj.moveFunc = svg.moveFull;
            obj.node = new Node(node.value, ind);
            obj.x = mincor.x;;
            obj.y = mincor.y;
            obj.stopx = mincor.x;
            obj.stopy =mincor.y - 2*svg.HOR_DIST;
            svg.moveNodes.push(obj);
            svg.opacityStep(ind, true, true, null);
            svg.moveStep();
            setOp("Получение значения минимального узла.")
        }
        
        else if (op.op == "activatenode")
        {
            var node = op.args[0];
            svg.activateNode(node.index);
            setTimeout(svg.deactivateNode, 1000, node.index);
            setTimeout(svg.nextAnimation, 1001);
        }
        
        // description
        else if (op.op == "increaserank")
        {
            //alert(2);
            var ind = svg.increaseRank();
            svg.moveNodes = [];
            for (var i = ind - 1; i >=0; i--)
            {
                var obj = {};
                obj.moveFunc = svg.moveRoot;
                obj.node = svg.rootnodes_[i];
                var cor = svg.getRootCoords(i);
                obj.x = cor.x;;
                obj.y = cor.y;
                obj.stopx = cor.x + 25;
                obj.stopy = cor.y;
                svg.moveNodes.push(obj);
            }
            svg.moveStep();
            svg.op_queue.unshift({op:"showroot", args:[]});
            setOp("Добавление нового разряда в корневой счетчик.");
        }
        
        else if (op.op == "showroot")
        {
            //alert(1);
            svg.rootnodes_[svg.nextRank - 1].style['transition-duration'] = ".5s";
            svg.rootnodes_[svg.nextRank - 1].style.opacity = 1;
            svg.nextAnimation();
        }
        
        // description
        else if (op.op == "setrootval")
        {
            svg.setRootVal(op.args[0], op.args[1]);
            setOp("Изменение значения " + op.args[0] + "-го разряда корневого счетчика на " + op.args[1] + ".");
        }
    }				
}
