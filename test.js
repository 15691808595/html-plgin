let fs = require('fs');
let join = require('path').join;
let paths = require('path');
var compressor = require('node-minify');

/**
 *
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
let fPathArr=[];
let fPathArrItem=[];
function findSync(startPath) {
    let result = [];
    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) {
                // console.log('fPath',paths.basename(fPath,'.js'));
                // console.log(fPath);
                fPathArr.push(fPath)
                // console.log(fPath.indexOf('min'),fPath.lastIndexOf('.min'));
                // console.log(fPath.substring(fPath.indexOf('min')+4,fPath.indexOf('0')));
                fPathArrItem.push(fPath.substring(fPath.indexOf('min')+4,fPath.indexOf('0')));
                // compressor.minify({
                //     compressor: 'gcc',
                //     input: fPath,
                //     output: './js/min/' + paths.basename(fPath,'.js') + Math.random()+'.min.js',
                //     callback: function (err, min) {
                //     }
                // });
                // result.push(fPath)
                result.push(paths.basename(fPath,'.js'))
            }
        });
        // console.log(fPathArr,fPathArrItem);
    }

    finder(startPath);
    return result;
}

let fileNames = findSync('./js/min');
var reg=/^(<script src=)"js\/.\.js">(<\/script>)$/;
var fileArr=[];
fs.readFile('./life.php',(err,data)=>{
    data.toString().replace(/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig, function (str) {
        fileArr.push(str.replace(/<\/script>/,''));
        // console.log(str,1);
console.log(fileArr);

return [1,2,3]
        // return result; //所以搜索到了几个字就返回几个*
    })
    // console.log(fileArr);
    // console.log(data.toString().replace(/<script.*?>.*?<\/script>/ig, ''));
    var fileArrBasename=[];
    for(let i in fileArr){
        // console.log(fileArr[i].lastIndexOf('.'),fileArr[i].lastIndexOf('/'),fileArr[i].substring(fileArr[i].lastIndexOf('/')+1,fileArr[i].lastIndexOf('.')));
        fileArrBasename.push(fileArr[i].substring(fileArr[i].lastIndexOf('/')+1,fileArr[i].lastIndexOf('.')))
    }
    // console.log(fileArrBasename);
    // console.log(fPathArrItem);
    let html='';
    // html+=data.toString().replace(/<script.*?>.*?<\/script>/ig, '');
    for(let i in fPathArrItem){
        // console.log(fPathArrItem[i],1);
        // console.log(fileArrBasename[i],2);
        // console.log(fileArrBasename[i]);
        // console.log(fPathArr[i]);
        // console.log(fPathArrItem[i]);
        if(fileArrBasename.indexOf(fPathArrItem[i])!==-1){
            // fileArrBasename[i]=fPathArr[i];
            // console.log(fPathArr[i],i);
            html+=`<script src="./${fPathArr[i]}"></script>`;
        }
    }
    // fs.writeFile('./newLife.php',data.toString().replace(/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig, html),(err,data)=>{
    //     console.log(data);
    // })
    fs.writeFile('./newLife.php',data.toString().replace(/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig, html),(err,data)=>{
        console.log(data);
    })
})