
export default function findTokenValue(token, remBase = false) {
    switch (token.type) {
        case 'COLOR' :
            const alpha = `${((token.value.a / 1  * 1000) / 1000 ).toFixed(2)}`;
            const colorStr = `rgba( ${
                    Math.round((token.value.r / 1 ) * 255)
                }, ${
                    Math.round((token.value.g / 1 ) * 255)
                }, ${
                    Math.round((token.value.b / 1 ) * 255)
                }, ${
                    alpha === '1.00' ? '1' : alpha
                } )`;
            return colorStr;
            break;
        case 'ALIAS' :
            // let the other side figure out reference...
            return token.value;
            break;
        case 'BOOLEAN' :
            // not sure what this would be in css
            return token.value ? '1' : '0';
            break;
        case 'STRING' :
            return token.value;
            break;
        case 'DIMENSION' :
            const isPixel = (token.name.indexOf('breakpoint') === 0);
            if (remBase && !isPixel) {
                const em = token.value / remBase;
                return `${em.toFixed(4)}rem`;
            }else{
                return `${token.value}px`;
            }
            break;
        case 'INT' :
        case 'FLOAT' :
            return `${token.value}`;
            break;
    }
};
