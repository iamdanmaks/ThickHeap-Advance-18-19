var thickHeap = new ThickHeap();

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
}

function check(val) {
    if (val == "") return false;
    for (var i = 0; i < val.length; ++i) {
        if (val[i] == '.' || val[i] == ',') return false;
    }
    var ans = +val;
    if (isNaN(ans)) return false;
    return true;
}

function insert_click() {
    hideWarnings();
    if (isanim) {
        showSpan(sp1, "Дождитесь окончания отрисовки операции.");
        return;
    }

    var val = ins.value;
    if (check(val) == false) {
        showSpan(sp1, "Введите целое число от -99 до 999");
        return;
    }

    res.textContent = "-";
    thickHeap.insert(+val);
    isanim = true;
    if (isauto) svg.nextAnimation();
    result = "OK";
}

function insertrand_click() {
    hideWarnings();
    if (isanim) {
        showSpan(sp5, "Дождитесь окончания отрисовки операции.");
        return;
    }

    val = 999 - Math.floor(1098 * Math.random());

    res.textContent = "-";
    thickHeap.insert(val);
    isanim = true;
    if (isauto) svg.nextAnimation();
    result = "OK";
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

    res.textContent = "-";
    result = thickHeap._minNode.value;
    thickHeap.deleteMin();
    isanim = true;
    svg.nextAnimation();
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
