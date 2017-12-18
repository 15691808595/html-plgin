let fs = require('fs');
let join = require('path').join;
let paths = require('path');
var compressor = require('node-minify');
var hrf = require('hash-rename-file');
var rf = require('rimraf');
// rf('./js/hash',(err,data)=>{});
// rf('./js/min',(err,data)=>{});
// rf('./test2-life.php',(err,data)=>{});
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
            if(!/min/.test(paths.dirname(fPath))){
                if (stats.isDirectory()) finder(fPath);
                if (stats.isFile()) {
                    // console.log('fPath',paths.basename(fPath,'.js'));
                    // console.log(fPath);
                    compressor.minify({
                        compressor: 'gcc',
                        input: fPath,
                        output: './js/min/' + paths.basename(fPath,'.js') +'.min.js',
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
                let reg=/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig;
                if(paths.extname(fPath)==='.php'){
                    console.log(fPath+'正在替换...');
                    fs.readFile(fPath,(err,data)=>{
                        let result=data.toString().replace(reg, function (str) {
                            let str2=str.replace('</script>',''); // 去除后缀
                            let basename=str.replace('</script>','').substring(str2.lastIndexOf('/')+1,str2.lastIndexOf('.js')); // admin common
                            if(/\/min\//.test(str2)){
                                return str;
                            }else {

                                return str.replace(basename,'min/'+basename+'.min');
                            }
                        });

                        fs.writeFile('test2-'+fPath,result,(err,data)=>{
                            console.log(err+'test2-'+fPath+'文件已经替换成功');
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

            hrf('./js/min/' + paths.basename(fPath,'.js') +'.js', './js/hash/', function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('./js/min/' + paths.basename(fPath,'.js') +'.js哈希已经生成');
            });

        });

    }
    finder(startPath);
}

findSync('./js');
findSyncChange('./');
addMinHash('./js/min');