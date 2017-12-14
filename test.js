let fs = require('fs');
let join = require('path').join;
let paths = require('path');
var compressor = require('node-minify');

/**
 *
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
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

    }

    finder(startPath);
    return result;
}

let fileNames = findSync('./js/min');
var reg=/^(<script src=)"js\/.\.js">(<\/script>)$/;
fs.readFile('./life.php',(err,data)=>{
    data.toString().replace(/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig, function (str) {

        console.log(str.split('<script'));


        // return result; //所以搜索到了几个字就返回几个*
    })
    // console.log(data.toString().replace(/<script.*?>.*?<\/script>/ig, ''));


    // fs.writeFile('./newLife.php',data.toString().replace(/<script.*?>.*?<\/script>/ig, ''),(err,data)=>{
    //     console.log(data);
    // })
})