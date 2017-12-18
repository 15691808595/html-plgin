let fs = require('fs');
let join = require('path').join;
let paths = require('path');
var compressor = require('node-minify');
var hrf = require('hash-rename-file');
var rf = require('rimraf');
fs.exists('./css/hash',(data)=>{
    data&&rf('./css/hash',(err,data)=>{});
});
fs.exists('./css/min',(data)=>{
    data&&rf('./css/min',(err,data)=>{});
});

/**
 *
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
// 寻找js并压缩
function findSync(startPath) {
    function finder(_path) {
        let files = fs.readdirSync(_path);
        files.forEach((val, index) => {
            let fPath = join(_path, val);
            let stats = fs.statSync(fPath);
            console.log(fPath+'文件正在压缩...');
            if(/css/.test(paths.dirname(fPath))){
                if (stats.isDirectory()) finder(fPath);
                if (stats.isFile()) {
                    // console.log('fPath',paths.basename(fPath,'.js'));
                    // console.log(fPath);
                    compressor.minify({
                        compressor: 'clean-css',
                        input: fPath,
                        output: './css/min/' + paths.basename(fPath,'.css') +'.min.css',
                        callback: function (err, min) {
                        }
                    });
                }
            }


        });

    }
    finder(startPath);
}
// 寻找php文件并替换
function findSyncChange(startPath) {
    function finder(_path) {
        let files = fs.readdirSync(_path);
        files.forEach((val, index) => {
            let fPath = join(_path, val);
            let stats = fs.statSync(fPath);
            if (stats.isFile()) {
                let reg=/<link[ ]+rel="stylesheet"[ ]+(type="text\/css")?href="(\.\/)?css\/.*">/ig;
                // let reg=/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig;
                if(paths.extname(fPath)==='.php'){
                    console.log(fPath+'正在替换...');
                    fs.readFile(fPath,(err,data)=>{
                        let result=data.toString().replace(reg, function (str) {
                            // let str2=str.replace('</script>',''); // 去除后缀
                            let basename=str.substring(str.lastIndexOf('/')+1,str.lastIndexOf('.css')); // admin common
                            if(/\/min\//.test(str)||/\/hash\//.test(str)){
                                return str;
                            }else {

                                return str.replace(basename,'min/'+basename+'.min');
                            }
                        });

                        fs.writeFile(fPath,result,(err,data)=>{
                            console.log(err+fPath+'文件已经替换成功');
                        })
                    });
                }

            }

        });

    }
    finder(startPath);
}
// min文件增加哈希值
function addMinHash(startPath) {
    function finder(_path) {
        let files = fs.readdirSync(_path);
        files.forEach((val, index) => {
            let fPath = join(_path, val);

            hrf('./css/min/' + paths.basename(fPath,'.css') +'.css', './css/hash/', function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('./css/min/' + paths.basename(fPath,'.css') +'.css哈希已经生成');
            });

        });

    }
    finder(startPath);
}

findSync('./css');
findSyncChange('./');
addMinHash('./css/min');