let fs = require('fs');
let join = require('path').join;
let paths = require('path');


// 寻找php文件并替换
function findSyncChange(startPath) {

    let hashFile=hashFileArr('./js/hash');
    let noHashFile=noHashFileArr(hashFile);

    function finder(_path) {
        let files = fs.readdirSync(_path);
        files.forEach((val, index) => {
            let fPath = join(_path, val);
            let stats = fs.statSync(fPath);
            if (stats.isFile()) {
                let reg=/<script[ ]+src="(\.\/)?js\/.*><\/script>/ig;
                if(paths.extname(fPath)==='.php'){
                    // console.log(fPath+'正在替换...');
                    fs.readFile(fPath,(err,data)=>{
                        let result=data.toString().replace(reg, function (str) {
                            let str2=str.replace('</script>',''); // 去除后缀
                            let b=str.replace('</script>','').substring(str2.lastIndexOf('/')+1,str2.lastIndexOf('.js')); // admin common
                            let basename=b.replace('.min','');
                            if(/\/hash\//.test(str2)){
                                return str;
                            }else {
                                let index='';
                                if(noHashFile.indexOf(basename)>=0){
                                    index=noHashFile.indexOf(basename);
                                }

                                return str.replace('min/'+basename,'hash/'+hashFile[index]);
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
// 返回一个hash文件夹下哈希值路径数组  'zan.min_5e8802d' 数组
function hashFileArr(startPath) {
    let arr=[];
    function finder(_path) {
        let files = fs.readdirSync(_path);
        files.forEach((val, index) => {
            let fPath = join(_path, val);
            arr.push(fPath.substring(fPath.lastIndexOf('hash')+5,fPath.lastIndexOf('.')))
        });

    }
    finder(startPath);
    return arr;
}
// 返回一个hash文件夹下不带哈希值路径数组  'zan' 数组
function noHashFileArr(arr) {
    let newArr=[];
    for(let i in arr){
        newArr.push((arr[i].substring(0,arr[i].indexOf('.'))))
    }
    return newArr;
}

findSyncChange('./');
