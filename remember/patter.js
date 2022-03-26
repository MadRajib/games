class Pattern{
    generate(len, min, max, tough){
        min = Math.ceil(min);
        max = Math.floor(max);
        let mult = (max - min + 1) ;
        let pattern = []
        switch(tough){
            case 1:
                while(pattern.length < len){
                    var r = Math.floor(Math.random() * mult + min);
                    if(pattern.indexOf(r) === -1) pattern.push(r);
                }
                break;
            case 2:
            for (let i =0; i<len ;i++) {
                let num = Math.floor(Math.random() * mult + min);
                pattern.push(num);
            }
            break;
            
            default:
                for(let i = 0;i < len; i++)
                    pattern.push(i+1);
        }
        return pattern;
    }
}