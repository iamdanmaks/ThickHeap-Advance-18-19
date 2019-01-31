function Node(value, index) {
    this.value = value;
    this.parent = null;
    this.left = null;
    this.right = null;
    this.leftChild = null;
    this.rank = 0;
    this.index = index;
    this.right_node;
    this.top_node;
}

function RootCounterNode() {
    this.value = 0;
    this.listPointer = null;
    this.prevListPointer = null;
}

function ThickHeap() {
    this._size = 0;
    this._maxRank = -1;
    this._minNode = null;
    this._rootCounter = [];

    this.getMaxRank = function() {
        for (var i = this._maxRank; i >= 0; i--) {
            if (this._rootCounter[i].value == 3) return i + 1;
            if (this._rootCounter[i].value > 0) return i;

        }
        return 0;
    }

    this._insertTreeInList = function(tree) {
        if (tree.rank > this._maxRank || this._rootCounter[tree.rank].value == 3) {
            throw "insertTreeInList error";
        }

        if (this._rootCounter[tree.rank].listPointer == null) {
            this._rootCounter[tree.rank].listPointer = tree;
            return;
        }

        var cur = this._rootCounter[tree.rank].listPointer;

        while (cur.right != null) {
            cur = cur.right;
        }
        cur.right = tree;
    }

    this._deleteTreeFromList = function(tree) {
        var rank = tree.rank;
        if (rank > this._maxRank) {
            throw "deleteTreeFromList error";
        }
        var currentPointer = this._rootCounter[rank].listPointer;
        if (currentPointer == tree) {
            this._rootCounter[rank].listPointer = tree.right;
            tree.right = null;
            return;
        }
        while (currentPointer.right != tree) {
            currentPointer = currentPointer.right;
        }
        currentPointer.right = tree.right;
        tree.right = null;
    }

    this._getMinFromList = function(listPointer) {
        var curp = listPointer;
        while (curp != null) {
            svg.op_queue.push({
                op: "activatenode",
                args: [curp]
            });
            if (this._getKey(curp) < this._getKey(this._minNode)) {
                svg.op_queue.push({
                    op: "changemin",
                    args: [this._minNode, curp]
                });
                this._minNode = curp;
            }
            curp = curp.right;
        }
    }

    this._fastening = function(p1, p2, p3) {
        svg.op_queue.push({
            op: "deleteright",
            args: [p1, p2, p3]
        }); // VISUALIZATION
        var svg1 = p1,
            svg2 = p2,
            svg3 = p3; // VISUALIZATION
        var minp;
        // Если узел явлеятся minNode, он должен быть в корне
        var foundmin = false;
        if (p1.rank == this._minNode.rank) {
            if (p1 == this._minNode) {
                minp = p1;
                p1 = p3;
                foundmin = true;
            } else if (p2 == this._minNode) {
                minp = p2;
                p2 = p3;
                foundmin = true;
            } else if (p3 == this._minNode) {
                minp = p3;
                foundmin = true;
            }
        }
        if (!foundmin) {
            if (p1.value <= p2.value && p1.value <= p3.value) {
                minp = p1;
                p1 = p3;
            } else if (p2.value <= p3.value && p2.value <= p1.value) {
                minp = p2;
                p2 = p3;
            } else if (p3.value <= p2.value && p3.value <= p1.value) {
                minp = p3;
            }
        }


        svg.op_queue.push({
            op: "fastening",
            args: [svg1, svg2, svg3, p1, p2, minp]
        });
        p1.left = null;
        p1.right = p2;
        p1.parent = minp;
        p2.left = p1;
        p2.right = minp.leftChild;
        p2.parent = minp;
        if (minp.leftChild != null) {
            minp.leftChild.left = p2;
        }

        minp.leftChild = p1;
        minp.left = null;
        minp.right = null;
        minp.parent = null;
        minp.rank++;
        return minp;
    }

    this._fixRootNode = function(rank) {
        if (rank > this._maxRank || this._rootCounter[rank].value != 3) {
            throw "fixRootNode error";
        }
        this._rootCounter[rank].value = 0;
        svg.op_queue.push({
            op: "setrootval",
            args: [rank, 1]
        });
        var p1 = this._rootCounter[rank].listPointer;
        var p2 = p1.right;
        var p3 = p2.right;
        p1.right = p2.right = null;
        var newp = this._fastening(p1, p2, p3);
        this._rootCounter[rank].listPointer = null;
        this._insertTree(newp);
    }

    this._insertTree = function(tree, needanim) {
        var rank = tree.rank;
        var wasvalue = this._maxRank >= rank ? this._rootCounter[rank].value : 0;
        if (rank > this._maxRank + 1) {
            throw "insertTree error";
        }
        if (rank == this._maxRank + 1) {
            this._increaseMaxRank();
        }
        var isfix = false;

        if (this._rootCounter[rank].value == 3) {
            isfix = true;
            this._fixRootNode(rank);
        } else if (this._rootCounter[rank].value == 1) {
            svg.op_queue.push({
                op: "addright",
                args: [this._rootCounter[rank].listPointer, tree]
            });
        } else if (this._rootCounter[rank].value == 2) {
            svg.op_queue.push({
                op: "addright",
                args: [this._rootCounter[rank].listPointer.right, tree]
            });
        }


        this._insertTreeInList(tree);
        this._rootCounter[rank].value++;
        if (!isfix) svg.op_queue.push({
            op: "setrootval",
            args: [rank, this._rootCounter[rank].value]
        });
        if (needanim == true && tree.rank == 0 && wasvalue == 3 && this._rootCounter[0].value == 1 && this._maxRank > 0) {
            svg.op_queue.push({
                op: "leftadded",
                args: [tree]
            }); // VISUALIZATION
        }
        if (needanim == true) {
            svg.nextAnimation();
        }
    }

    this._deleteTree = function(tree) {
        if (tree.rank > this._maxRank || this._rootCounter[tree.rank].value == 0) {
            throw "deleteTree error";
        }
        this._deleteTreeFromList(tree);
        this._rootCounter[tree.rank].value--;
        svg.op_queue.push({
            op: "setrootval",
            args: [tree.rank, this._rootCounter[tree.rank].value]
        });
    }

    this._setMinNodeInRoot = function() {
        this._minNode = null;
        for (var i = this._maxRank; i >= 0; --i) {
            this._getMinFromList(this._rootCounter[i].listPointer);
        }
    }

    this._increaseMaxRank = function() {
        this._maxRank++;
        svg.op_queue.push({
            op: "increaserank",
            args: []
        });
        this._rootCounter.push(new RootCounterNode());
    }

    this._getKey = function(p) {
        if (p == null) {
            return Number.MAX_VALUE;
        } else {
            return p.value;
        }
    }

    this.insert = function(value) {
        var wasvalue = this._maxRank >= 0 ? this._rootCounter[0].value : 0;
        var newIndex = svg.createNode(value);
        this._size++;
        var newNode = new Node(value, newIndex);

        svg.op_queue.push({
            op: "opacityNode",
            args: [newNode]
        });

        var prevMin;
        if (this._getKey(newNode) < this._getKey(this._minNode)) {
            prevMin = this._minNode;
            this._minNode = newNode;
        }
        this._insertTree(newNode);

        if (wasvalue == 3 && this._rootCounter[0].value == 1 && this._maxRank > 0) {
            svg.op_queue.push({
                op: "leftadded",
                args: [newNode]
            });
        }

        if (this._minNode == newNode) {
            svg.op_queue.push({
                op: "changemin",
                args: [prevMin, newNode]
            });
        }
    }

    this.getMin = function() {
        if (this._minNode == null) {
            throw "Error. Heap is empty.";
        }
        svg.op_queue.push({
            op: "movetop",
            args: [this._minNode]
        });
        return this._minNode.value;
    }

    this.deleteMin = function() {
        if (this._minNode == null) {
            throw "Error. Heap is empty.";
        }
        this._size--;

        delta = getDelta(this._minNode.rank);
        var args = [];
        args.push(this._minNode);
        var minLeft = this._rootCounter[this._minNode.rank].listPointer;
        if (minLeft == this._minNode) minLeft = null;
        else {
            while (minLeft.right != this._minNode) minLeft = minLeft.right;
        }

        for (var rank = this._minNode.rank - 1; rank >= 0; rank--) {
            if (this._rootCounter[rank].listPointer != null) {
                toMove.push(this._rootCounter[rank].listPointer);
            }
        }

        var cur = this._minNode.leftChild;

        var cur1 = this._minNode.leftChild;
        this._minNode.leftChild = null;

        while (cur1 != null) {
            args.push(cur1);
            cur1 = cur1.right;
        }
        svg.op_queue.push({
            op: "setdeleted",
            args: [this._minNode, minLeft]
        });
        svg.op_queue.push({
            op: "movedown",
            args: args
        });
        svg.op_queue.push({
            op: "deletenode",
            args: args
        });
        if (this._minNode.right != null)
            svg.op_queue.push({
                op: "moverightpart",
                args: [this._minNode.right]
            });
        if (minLeft != null && this._minNode.right != null) {
            svg.op_queue.push({
                op: "addright",
                args: [minLeft, this._minNode.right]
            });
        }

        while (cur != null) {
            var temp = cur;
            cur = cur.right;
            temp.left = null;
            temp.right = null;
            temp.parent = null;
            toInsert.push(temp);
        }
        needFinDelMin = true;
        this._deleteTree(this._minNode);
        var minValue = this._minNode.value;
        return minValue;
    }

    this.getNewMin = function() {
        this._setMinNodeInRoot();
        svg.nextAnimation();
    }
    this.getSize = function() {
        return this._size;
    }
    this.isEmpty = function() {
        return this._size == 0;
    }
}
