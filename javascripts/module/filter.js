define(function(require, exports, module) {
    require('base_book'); //引入一个小js库
    require('../../stylesheets/filter.css')
    var data1 = 1; //私有数据
    var id = "#search_box";
    
    exports.data2 = 2; //公共数据

    exports.func2 = function(str) { //公共方法
        alert(str)
    }
    exports.filter = function(){
    	ST.Widget.SearchPop(id,"a");
		ST.Widget.Shake()
    }
});