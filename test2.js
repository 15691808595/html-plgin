let fs = require('fs');

var reg=/^(<script src=)"js\/.\.js">(<\/script>)$/;
var reg2=/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig;
var fileArr=[];
fs.readFile('./life.php',(err,data)=>{
    // data.toString().replace(reg2, function (str) {
    //  // console.log(str);
    //     return 23;
    // })
    data.toString().replace(/script/ig,'234')
    console.log(data.toString());
})