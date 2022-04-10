import {
    data
} from "./data.js";
import { camera } from "./treeCam.js";

// new ResizeObserver(outputsize).observe(searchWarpper);

//time consuming , no seaching actually
var setting = {
    callback: {
        // onCollapse: clickButton,
        // onExpand: clickButton,
        onClick: clickzTreeNode,
    },
};


// function clickButton(e, treeId, treeNode) {

// }

function clickzTreeNode(e, treeId, treeNode) {
    //TODO set camera
    camera
    console.log(treeId + ", " + treeNode.name)
}


function initTree() {
    $.fn.zTree.init($("#treeDemo"), setting, data);
}

var key;
$(document).ready(function () {
    initTree();
});
//