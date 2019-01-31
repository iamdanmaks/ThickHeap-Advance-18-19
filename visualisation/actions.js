var thickHeap = new ThickHeap();

var scale = 1,
    panning = false,
    xoff = 0,
    yoff = 0,
    start = {x: 0, y: 0},
    doc = document.getElementById("layout");

function setTransform() {
  doc.style.transform = "translate(" + xoff + "px, " + yoff + "px) scale(" + scale + ")";
}

doc.onmousedown = function(e) {
  e.preventDefault();
  start = {x: e.clientX - xoff, y: e.clientY - yoff};    
  panning = true;
}

doc.onmouseup = function(e) {
  panning = false;
}

doc.onmousemove = function(e) {
  e.preventDefault();         
  if (!panning) {
    return;
  }
  xoff = (e.clientX - start.x);
  yoff = (e.clientY - start.y);
  setTransform();
}

doc.onwheel = function(e) {
    e.preventDefault();
    
    var xs = (e.clientX - xoff) / scale,
        ys = (e.clientY - yoff) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);

    (delta > 0) ? (scale *= 1.1) : (scale /= 1.1);

    xoff = e.clientX - xs * scale;
    yoff = e.clientY - ys * scale;

    setTransform();          
}

var cPushArray = new Array();
var cStep = -1;

function cPush(obj) {
    cStep++;
    if (cStep < cPushArray.length) 
    { 
        cPushArray.length = cStep; 
    }
    cPushArray.push(obj);
}

function undo() {
    if (cStep > 0) {
        cStep--;
        
        for (var key in cPushArray[cStep].heap) {
            thickHeap[key] = cPushArray[cStep].heap[key];
        }
        
        for (var key in cPushArray[cStep].layout) {
            svg[key] = cPushArray[cStep].layout[key];
        }

        svg.nextAnimation();
    }
}

function redo() {
    if (cStep < cPushArray.length-1) {
        cStep++;
        thickHeap = cPushArray[cStep].heap;
        svg = cPushArray[cStep].layout;
        svg.nextAnimation();
    }
}

function hideWarnings() {
    sp1.style.opacity = 0;
    sp2.style.opacity = 0;
    sp3.style.opacity = 0;
    sp4.style.opacity = 0;
    sp5.style.opacity = 0;
    sp6.style.opacity = 0;
    sp7.style.opacity = 0;
}

function showSpan(sp, msg) {
    sp.textContent = msg;
    sp.style.opacity = 1;

    setTimeout(function(){
        sp.style.opacity = 0;
    }, 3500);
}

function check(val) {
    if (val === "") 
        return false;
    
    console.log(val);
    for (var i = 0; i < val.length; ++i) {
        if (val[i] === 'e') 
            return false;
    }
    
    var ans = +val;
    
    if (isNaN(ans)) 
        return false;
    
    return true;
}

function close_modal(){
    var modal = d.getElementById("modal");
    modal.style.opacity = 0;
    modal.style.display = "none";

    var question = d.getElementById("question");
    question.style.opacity = 0;
    question.style.display = "none";
}

var example = 0;

function insert_ready1(){
    hideWarnings();
    
    example = 1;

    if (thickHeap.getSize() != 0){
        var modal = d.getElementById("modal");
        modal.style.display = "block";
        modal.style.opacity = 1;

        var question = d.getElementById("question");
        question.style.display = "block";
        question.style.opacity = 1;
    }
    else{
        ins1();
    }
}

function ins1(){
    if (isexample == true) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    isexample = true;

    svg.DELAY = -20;
    var i = 0;
    var timerId = setTimeout(function tick() {
        if (i == -16){
            clearTimeout(timerId);
            isexample = false;
            return;
        }
        svg.DELAY = -20;
        thickHeap.insert(--i);
        svg.nextAnimation();
        d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
        timerId = setTimeout(tick, 5000);
    }, 5000);
}

function insert_ready2(){
    hideWarnings();
    
    example = 2;

    if (thickHeap.getSize() != 0){
        var modal = d.getElementById("modal");
        modal.style.display = "block";
        modal.style.opacity = 1;

        var question = d.getElementById("question");
        question.style.display = "block";
        question.style.opacity = 1;
    }
    else{
        ins2();
    }
}

function ins2(){
    if (isexample == true) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    isexample = true;

    svg.DELAY = -20;
    var i = 5;
    var timerId = setTimeout(function tick() {
        if (i == 20){
            clearTimeout(timerId);
            isexample = false;
            return;
        }
        svg.DELAY = -20;
        thickHeap.insert(++i);
        svg.nextAnimation();
        d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
        timerId = setTimeout(tick, 5000);
    }, 5000);
}

function insert_ready3(){
    hideWarnings();
    
    example = 3;

    if (thickHeap.getSize() != 0){
        var modal = d.getElementById("modal");
        modal.style.display = "block";
        modal.style.opacity = 1;

        var question = d.getElementById("question");
        question.style.display = "block";
        question.style.opacity = 1;
    }
    else{
        ins3();
    }
}

function ins3(){
    if (isexample == true) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    isexample = true;

    svg.DELAY = -20;
    var i = 0;
    var step = 0;
    var timerId = setTimeout(function tick() {
        if (step == 16){
            clearTimeout(timerId);
            isexample = false;
            return;
        }
        svg.DELAY = -20;
        ++step;
        thickHeap.insert(i);
        svg.nextAnimation();
        d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
        timerId = setTimeout(tick, 5000);
    }, 5000);
}

function insert_ready4(){
    hideWarnings();
    
    example = 4;

    if (thickHeap.getSize() != 0){
        var modal = d.getElementById("modal");
        modal.style.display = "block";
        modal.style.opacity = 1;

        var question = d.getElementById("question");
        question.style.display = "block";
        question.style.opacity = 1;
    }
    else{
        ins4();
    }
}

function ins4(){
    if (isexample == true) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }
    
    isexample = true;

    svg.DELAY = -20;
    var i = 5;
    var step = 0;
    var timerId = setTimeout(function tick() {
        if (step == 16){
            clearTimeout(timerId);
            isexample = false;
            return;
        }
        svg.DELAY = -20;
        ++step;
        --i;
        if (step % 2 == 0)
            i *= -1;
        else {
            i -= 3;
            i *= -1;
        }
        thickHeap.insert(i);
        svg.nextAnimation();
        d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
        timerId = setTimeout(tick, 5000);
    }, 5000);
}

function insert_sequence(){
    hideWarnings();
    if (isexample == true) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    svg.DELAY = -100;
    var step = 0;
    var values = d.getElementById("seq").value.split(',');  
    var len = values.length;
    
    if (values === [""] && len === 1){
        showSpan(sp5, "Введите значения.");
        return;
    }

    for (var i = 0; i < len; ++i){
        console.log(i);
        console.log(values[i]);
        if (check(values[i]) == false || /^\-?\d+|\.$/.test(values[i]) == false || +values[i] < -99 || +values[i] > 999) {
            showSpan(sp1, "Числа должны быть от -99 до 999");
            return;
        }
    }

    isexample = true;

    var timerId = setTimeout(function tick() {
        if (step == len){
            clearTimeout(timerId);
            isexample = false;
            return;
        }
        svg.DELAY = -100;
        thickHeap.insert(+values[step]);
        svg.nextAnimation();
        d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
        ++step;
        timerId = setTimeout(tick, 7500);
    }, 7500);
}

function clear_heap(){
    d.getElementById("layout").innerHTML = basement;
    svg.nodes_ = [];
    svg.edges_ = [];
    svg.rootnodes_ = [];
    svg.op_queue = [];
    svg.nextX = 50;
    svg.nextRank = 0;
    svg.DELAY = -5;
    svg.moveNodes = [];
    svg.listPointers = [];

    thickHeap._size = 0;
    thickHeap._maxRank = -1;
    thickHeap._minNode = null;
    thickHeap._rootCounter = [];
    
    d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
}

function insert_click() {
    hideWarnings();

    if (isanim) {
        showSpan(sp1, "Дождитесь окончания отрисовки операции.");
        return;
    }

    if (isexample) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    var val = ins.value;
    if (check(val) == false || /^\-?\d+|\.$/.test(val) == false) {
        showSpan(sp1, "Введите число от -99 до 999");
        return;
    }

    res.textContent = "-";
    thickHeap.insert(+val);
    isanim = true;
    if (isauto) svg.nextAnimation();
    result = "OK";
    d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
}

function insertrand_click() {
    hideWarnings();

    if (isanim) {
        showSpan(sp5, "Дождитесь окончания отрисовки операции.");
        return;
    }

    if (isexample) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    val = 999 - Math.floor(1098 * Math.random());
    res.textContent = "-";
    thickHeap.insert(val);
    cPush({layout: svg, heap: thickHeap});
    isanim = true;
    if (isauto) svg.nextAnimation();
    result = "OK";
    d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
}

function deleteMin_click() {
    hideWarnings();

    if (isanim) {
        showSpan(sp3, "Дождитесь окончания отрисовки операции.");
        return;
    }
    if (thickHeap.isEmpty()) {
        showSpan(sp3, "Куча пустая.");
        return;
    }

    if (isexample) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    res.textContent = "-";
    result = thickHeap._minNode.value;
    thickHeap.deleteMin();
    isanim = true;
    cPush({layout: svg, heap: thickHeap});
    svg.nextAnimation();
    d.getElementById("sizeCounter").innerHTML = "Количество элементов: " + thickHeap.getSize();
}

function getMin_click() {
    hideWarnings();
    if (isanim) {
        showSpan(sp2, "Дождитесь окончания отрисовки операции.");
        return;
    }
    if (thickHeap.isEmpty()) {
        showSpan(sp2, "Куча пустая.");
        return;
    }

    if (isexample) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    res.textContent = "-";
    var val = thickHeap.getMin();
    isanim = true;
    svg.nextAnimation();
    result = val;
}

function size_click() {
    hideWarnings();
    if (isanim) {
        showSpan(sp4, "Дождитесь окончания отрисовки операции.");
        return;
    }

    if (isexample) {
        showSpan(sp5, "Дождитесь окончания отрисовки примера.");
        return;
    }

    var val = thickHeap.getSize();
    res.textContent = val;
}

function speedChange() {
    speedsp.textContent = speed.value;
    svg.DELAY = 25 - speed.value;
}

function setOp(op) {
    var newSp = d.createElement("span");
    newSp.classList.add("operation");
    newSp.textContent = op;
    if (oper.children.length == 0) {
        oper.appendChild(newSp);
    } else {
        oper.insertBefore(d.createElement('br'), oper.firstChild);
        oper.insertBefore(newSp, oper.firstChild);
    }
}

function changeMode() {
    var step = d.getElementById('nextstep');

    if (step.style.display == 'none') {
        step.style.display = 'block';
        step.style.opacity = 1;
    } else {
        step.style.opacity = 0;
        step.style.display = 'none';
    }

    hideWarnings();
    // пошаговый выключили
    if (mode.checked == false) {
        if (isanim) {
            mode.checked = true;
            showSpan(sp7, "Дождитесь окончания отрисовки операции.");
            return;
        } else {
            isauto = true;
            nextstep.setAttribute("disabled", "disabled");
        }
    } else {
        if (isanim) {
            mode.checked = false;
            showSpan(sp7, "Дождитесь окончания отрисовки операции.");
            return;
        } else {
            isauto = false;
            nextstep.removeAttribute("disabled");
        }
    }
}

function nextStep() {
    hideWarnings();
    if (isanim == false) {
        showSpan(sp6, "Выберите операцию перед пошаговым выполнением.");
        return;
    }
    if (ismoving) {
        showSpan(sp6, "Дождитесь окончания отрисовки шага");
        return;
    } else {
        issecond = false;
        svg.nextAnimation();
    }
}
